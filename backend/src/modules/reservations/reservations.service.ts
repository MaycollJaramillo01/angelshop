import createError from 'http-errors';
import { pool } from '../../db/pool.js';
import { addHours } from '../../utils/dates.js';
import { generateCode } from '../../utils/ids.js';
import { emitRealtime } from '../../realtime/socket.js';
import { queueNotification } from '../notifications/notifications.service.js';
import {
  Reservation,
  ReservationState,
  CreateReservationInput,
  ReservationItem,
  CreateReservationItemInput
} from './reservations.types.js';
import { logger } from '../../utils/logger.js';

const mapReservationItem = (row: any): ReservationItem => ({
  id: row.id,
  reserva_id: row.reserva_id,
  variante_id: row.variante_id,
  quantity: row.quantity,
  price_snapshot: Number(row.price_snapshot)
});

const mapReservation = (
  row: any,
  items: ReservationItem[] = []
): Reservation => ({
  id: row.id,
  codigo: row.codigo,
  nombre: row.nombre,
  email: row.email,
  telefono: row.telefono,
  estado: row.estado,
  fecha_creacion: row.fecha_creacion,
  fecha_expiracion: row.fecha_expiracion,
  observaciones: row.observaciones ?? null,
  items
});

const mergeReservationItems = (
  row: any,
  items: ReservationItem[]
): ReservationItem[] => {
  if (items.length > 0) return items;
  if (row.variante_id) {
    return [
      {
        id: 0,
        reserva_id: row.id,
        variante_id: row.variante_id,
        quantity: 1,
        price_snapshot: 0
      }
    ];
  }
  return items;
};

const loadReservationItems = async (
  client: any,
  reservationIds: number[]
): Promise<Map<number, ReservationItem[]>> => {
  const map = new Map<number, ReservationItem[]>();
  if (reservationIds.length === 0) return map;
  const { rows } = await client.query(
    'SELECT * FROM reservation_items WHERE reserva_id = ANY($1::int[])',
    [reservationIds]
  );
  for (const row of rows) {
    const item = mapReservationItem(row);
    const existing = map.get(item.reserva_id) ?? [];
    existing.push(item);
    map.set(item.reserva_id, existing);
  }
  return map;
};

const validateAndLockVariants = async (
  client: any,
  items: CreateReservationItemInput[]
) => {
  const requested = new Map<number, number>();
  for (const item of items) {
    const current = requested.get(item.variantId) ?? 0;
    requested.set(item.variantId, current + item.quantity);
  }
  const variantIds = Array.from(requested.keys());
  for (const variantId of variantIds) {
    const { rows: variants } = await client.query(
      'SELECT id, stock_disponible, stock_reservado FROM variantes WHERE id=$1 FOR UPDATE',
      [variantId]
    );
    const variant = variants[0];
    if (!variant) {
      throw createError(404, 'Variante no encontrada');
    }
    const needed = requested.get(variant.id) ?? 0;
    if (variant.stock_disponible < needed) {
      throw createError(409, 'Sin stock');
    }
  }
  return requested;
};

export const createReservation = async (input: CreateReservationInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const requested = await validateAndLockVariants(client, input.items);
    const variantIds = Array.from(requested.keys());
    for (const [variantId, quantity] of requested) {
      await client.query(
        'UPDATE variantes SET stock_disponible=stock_disponible-CAST($1 AS INT), stock_reservado=stock_reservado+CAST($1 AS INT), updated_at=now() WHERE id=$2',
        [quantity, variantId]
      );
    }

    const codigo = generateCode();
    const exp = addHours(new Date(), input.ventanaHoras);

    const { rows: reservations } = await client.query(
      `INSERT INTO reservas(codigo, variante_id, nombre, email, telefono, estado, fecha_expiracion)
       VALUES($1,$2,$3,$4,$5,'activa',$6)
       RETURNING *`,
      [codigo, null, input.nombre, input.email, input.telefono, exp]
    );

    const reservationRow = reservations[0];
    const items: ReservationItem[] = [];
    for (const item of input.items) {
      const { rows: created } = await client.query(
        `INSERT INTO reservation_items(reserva_id, variante_id, quantity, price_snapshot)
         VALUES($1,$2,$3,$4) RETURNING *`,
        [reservationRow.id, item.variantId, item.quantity, 0]
      );
      items.push(mapReservationItem(created[0]));
    }

    await client.query('COMMIT');

    const reservation = mapReservation(reservationRow, items);
    for (const variantId of variantIds) {
      emitRealtime('stock:updated', { varianteId: variantId });
    }
    emitRealtime('reserva:creada', {
      id: reservation.id,
      codigo: reservation.codigo
    });
    await queueNotification(reservation, 'confirmacion');

    return reservation;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getReservationByCode = async (
  codigo: string
): Promise<Reservation | null> => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      'SELECT * FROM reservas WHERE codigo=$1',
      [codigo]
    );
    const row = rows[0];
    if (!row) return null;
    const itemsMap = await loadReservationItems(client, [row.id]);
    const items = mergeReservationItems(row, itemsMap.get(row.id) ?? []);
    return mapReservation(row, items);
  } finally {
    client.release();
  }
};

export const updateReservationState = async (
  id: number,
  targetState: ReservationState,
  options: { releaseStock?: boolean; consumeStock?: boolean } = {}
): Promise<Reservation> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT * FROM reservas WHERE id=$1 FOR UPDATE',
      [id]
    );
    const reservationRow = rows[0];
    if (!reservationRow) {
      await client.query('ROLLBACK');
      throw createError(404, 'Reserva no encontrada');
    }
    if (reservationRow.estado !== 'activa') {
      await client.query('ROLLBACK');
      throw createError(409, 'La reserva no está activa');
    }

    const itemsMap = await loadReservationItems(client, [id]);
    const items = mergeReservationItems(reservationRow, itemsMap.get(id) ?? []);
    const variantIds = Array.from(
      new Set(items.map((item) => item.variante_id))
    );
    if (
      (options.releaseStock || options.consumeStock) &&
      variantIds.length > 0
    ) {
      await client.query(
        'SELECT id FROM variantes WHERE id = ANY($1::int[]) FOR UPDATE',
        [variantIds]
      );
    }

    if (options.releaseStock) {
      for (const item of items) {
        await client.query(
          'UPDATE variantes SET stock_disponible=stock_disponible+CAST($1 AS INT), stock_reservado=stock_reservado-CAST($1 AS INT), updated_at=now() WHERE id=$2',
          [item.quantity, item.variante_id]
        );
      }
      for (const variantId of variantIds) {
        emitRealtime('stock:updated', { varianteId: variantId });
      }
    }

    if (options.consumeStock) {
      for (const item of items) {
        await client.query(
          'UPDATE variantes SET stock_reservado=stock_reservado-CAST($1 AS INT), updated_at=now() WHERE id=$2',
          [item.quantity, item.variante_id]
        );
      }
      for (const variantId of variantIds) {
        emitRealtime('stock:updated', { varianteId: variantId });
      }
    }

    const { rows: updatedRows } = await client.query(
      'UPDATE reservas SET estado=$1 WHERE id=$2 RETURNING *',
      [targetState, id]
    );

    await client.query('COMMIT');
    const reservation = mapReservation(updatedRows[0], items);

    if (targetState === 'cancelada') {
      emitRealtime('reserva:cancelada', {
        id: reservation.id,
        codigo: reservation.codigo
      });
      await queueNotification(reservation, 'cancelacion');
    }
    if (targetState === 'retirada') {
      emitRealtime('reserva:retirada', {
        id: reservation.id,
        codigo: reservation.codigo
      });
    }
    if (targetState === 'expirada') {
      emitRealtime('reserva:expirada', {
        id: reservation.id,
        codigo: reservation.codigo
      });
      await queueNotification(reservation, 'expiracion');
    }

    return reservation;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const cancelReservation = (id: number) =>
  updateReservationState(id, 'cancelada', { releaseStock: true });
export const markReservationAsCollected = (id: number) =>
  updateReservationState(id, 'retirada', { consumeStock: true });

export const listReservations = async (filters: {
  estado?: string;
  desde?: string;
  hasta?: string;
}) => {
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (filters.estado) {
    values.push(filters.estado);
    conditions.push(`estado = $${values.length}`);
  }
  if (filters.desde) {
    values.push(filters.desde);
    conditions.push(`fecha_creacion >= $${values.length}`);
  }
  if (filters.hasta) {
    values.push(filters.hasta);
    conditions.push(`fecha_creacion <= $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT * FROM reservas ${where} ORDER BY fecha_creacion DESC`,
    values
  );
  const itemsMap = await loadReservationItems(
    pool,
    rows.map((row) => row.id)
  );
  return rows.map((row) =>
    mapReservation(row, mergeReservationItems(row, itemsMap.get(row.id) ?? []))
  );
};

export const expireReservations = async (): Promise<number> => {
  const client = await pool.connect();
  const notifications: Reservation[] = [];
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT * FROM reservas WHERE estado='activa' AND now() >= fecha_expiracion FOR UPDATE`
    );
    let processed = 0;
    const itemsMap = await loadReservationItems(
      client,
      rows.map((row) => row.id)
    );
    const variantIds = Array.from(
      new Set(
        rows.flatMap((row) =>
          mergeReservationItems(row, itemsMap.get(row.id) ?? []).map(
            (item) => item.variante_id
          )
        )
      )
    );
    if (variantIds.length > 0) {
      await client.query(
        'SELECT id FROM variantes WHERE id = ANY($1::int[]) FOR UPDATE',
        [variantIds]
      );
    }

    for (const row of rows) {
      const items = mergeReservationItems(row, itemsMap.get(row.id) ?? []);
      await client.query("UPDATE reservas SET estado='expirada' WHERE id=$1", [
        row.id
      ]);
      for (const item of items) {
        await client.query(
          'UPDATE variantes SET stock_disponible=stock_disponible+CAST($1 AS INT), stock_reservado=stock_reservado-CAST($1 AS INT), updated_at=now() WHERE id=$2',
          [item.quantity, item.variante_id]
        );
      }
      const reservation = mapReservation({ ...row, estado: 'expirada' }, items);
      for (const item of items) {
        emitRealtime('stock:updated', { varianteId: item.variante_id });
      }
      emitRealtime('reserva:expirada', {
        id: reservation.id,
        codigo: reservation.codigo
      });
      notifications.push(reservation);
      processed += 1;
    }
    await client.query('COMMIT');
    for (const reservation of notifications) {
      await queueNotification(reservation, 'expiracion');
    }
    return processed;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error expirando reservas', { error });
    throw error;
  } finally {
    client.release();
  }
};

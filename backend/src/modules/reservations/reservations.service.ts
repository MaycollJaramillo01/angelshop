import createError from 'http-errors';
import { pool } from '../../db/pool.js';
import { addHours } from '../../utils/dates.js';
import { generateCode } from '../../utils/ids.js';
import { emitRealtime } from '../../realtime/socket.js';
import { queueNotification } from '../notifications/notifications.service.js';
import { Reservation, ReservationState, CreateReservationInput } from './reservations.types.js';
import { logger } from '../../utils/logger.js';

const mapReservation = (row: any): Reservation => ({
  id: row.id,
  codigo: row.codigo,
  variante_id: row.variante_id,
  nombre: row.nombre,
  email: row.email,
  telefono: row.telefono,
  estado: row.estado,
  fecha_creacion: row.fecha_creacion,
  fecha_expiracion: row.fecha_expiracion,
  observaciones: row.observaciones ?? null
});

export const createReservation = async (input: CreateReservationInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: variants } = await client.query(
      'SELECT id, stock_disponible, stock_reservado FROM variantes WHERE id=$1 FOR UPDATE',
      [input.varianteId]
    );
    const variant = variants[0];
    if (!variant || variant.stock_disponible <= 0) {
      await client.query('ROLLBACK');
      throw createError(409, 'Sin stock');
    }

    await client.query(
      'UPDATE variantes SET stock_disponible=stock_disponible-1, stock_reservado=stock_reservado+1, updated_at=now() WHERE id=$1',
      [input.varianteId]
    );

    const codigo = generateCode();
    const exp = addHours(new Date(), input.ventanaHoras);

    const { rows: reservations } = await client.query(
      `INSERT INTO reservas(codigo, variante_id, nombre, email, telefono, estado, fecha_expiracion)
       VALUES($1,$2,$3,$4,$5,'activa',$6)
       RETURNING *`,
      [codigo, input.varianteId, input.nombre, input.email, input.telefono, exp]
    );

    await client.query('COMMIT');

    const reservation = mapReservation(reservations[0]);
    emitRealtime('stock:updated', { varianteId: input.varianteId });
    emitRealtime('reserva:creada', { id: reservation.id, codigo: reservation.codigo });
    await queueNotification(reservation, 'confirmacion');

    return {
      codigo: reservation.codigo,
      fechaExpiracion: reservation.fecha_expiracion
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getReservationByCode = async (codigo: string): Promise<Reservation | null> => {
  const { rows } = await pool.query('SELECT * FROM reservas WHERE codigo=$1', [codigo]);
  return rows[0] ? mapReservation(rows[0]) : null;
};

export const updateReservationState = async (
  id: number,
  targetState: ReservationState,
  options: { releaseStock?: boolean; consumeStock?: boolean } = {}
): Promise<Reservation> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT * FROM reservas WHERE id=$1 FOR UPDATE', [id]);
    const reservationRow = rows[0];
    if (!reservationRow) {
      await client.query('ROLLBACK');
      throw createError(404, 'Reserva no encontrada');
    }
    if (reservationRow.estado !== 'activa') {
      await client.query('ROLLBACK');
      throw createError(409, 'La reserva no está activa');
    }

    if (options.releaseStock) {
      await client.query(
        'UPDATE variantes SET stock_disponible=stock_disponible+1, stock_reservado=stock_reservado-1, updated_at=now() WHERE id=$1',
        [reservationRow.variante_id]
      );
      emitRealtime('stock:updated', { varianteId: reservationRow.variante_id });
    }

    if (options.consumeStock) {
      await client.query(
        'UPDATE variantes SET stock_reservado=stock_reservado-1, updated_at=now() WHERE id=$1',
        [reservationRow.variante_id]
      );
      emitRealtime('stock:updated', { varianteId: reservationRow.variante_id });
    }

    const { rows: updatedRows } = await client.query(
      'UPDATE reservas SET estado=$1 WHERE id=$2 RETURNING *',
      [targetState, id]
    );

    await client.query('COMMIT');
    const reservation = mapReservation(updatedRows[0]);

    if (targetState === 'cancelada') {
      emitRealtime('reserva:cancelada', { id: reservation.id, codigo: reservation.codigo });
      await queueNotification(reservation, 'cancelacion');
    }
    if (targetState === 'retirada') {
      emitRealtime('reserva:retirada', { id: reservation.id, codigo: reservation.codigo });
    }
    if (targetState === 'expirada') {
      emitRealtime('reserva:expirada', { id: reservation.id, codigo: reservation.codigo });
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

export const cancelReservation = (id: number) => updateReservationState(id, 'cancelada', { releaseStock: true });
export const markReservationAsCollected = (id: number) => updateReservationState(id, 'retirada', { consumeStock: true });

export const listReservations = async (filters: { estado?: string; desde?: string; hasta?: string }) => {
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
  const { rows } = await pool.query(`SELECT * FROM reservas ${where} ORDER BY fecha_creacion DESC`, values);
  return rows.map(mapReservation);
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
    for (const row of rows) {
      await client.query(
        'UPDATE reservas SET estado=\'expirada\' WHERE id=$1',
        [row.id]
      );
      await client.query(
        'UPDATE variantes SET stock_disponible=stock_disponible+1, stock_reservado=stock_reservado-1, updated_at=now() WHERE id=$1',
        [row.variante_id]
      );
      const reservation = mapReservation({ ...row, estado: 'expirada' });
      emitRealtime('stock:updated', { varianteId: row.variante_id });
      emitRealtime('reserva:expirada', { id: reservation.id, codigo: reservation.codigo });
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

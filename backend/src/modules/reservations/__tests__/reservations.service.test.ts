import fs from 'fs';
import path from 'path';

const migrationsDir = path.resolve(__dirname, '../../../db/migrations');
const schema = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort()
  .map((file) => fs.readFileSync(path.join(migrationsDir, file), 'utf8'))
  .join('\n');

jest.mock('../../../realtime/socket', () => ({
  emitRealtime: jest.fn()
}));

jest.mock('../../notifications/notifications.service', () => ({
  queueNotification: jest.fn()
}));

jest.mock('../../../db/pool', () => {
  const { newDb } = require('pg-mem');
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.none(schema);
  const adapter = db.adapters.createPg();
  const { Pool } = adapter;
  const pool = new Pool();
  return {
    pool,
    withTransaction: async (fn: any) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  };
});

const { pool } = require('../../../db/pool');
const {
  createReservation,
  getReservationByCode,
  expireReservations
} = require('../reservations.service');

let seededVariantId: number;

const seedData = async () => {
  const { rows: products } = await pool.query(
    `INSERT INTO productos(nombre) VALUES('Test Producto') RETURNING id`
  );
  const productId = products[0].id;
  const { rows: variants } = await pool.query(
    `INSERT INTO variantes(producto_id, talla, color, sku, stock_disponible, stock_reservado)
     VALUES($1, 'M', 'Negro', 'SKU-1', 2, 0) RETURNING id`,
    [productId]
  );
  seededVariantId = variants[0].id;
};

describe('Reservations service', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM notificaciones');
    await pool.query('DELETE FROM reservation_items');
    await pool.query('DELETE FROM reservas');
    await pool.query('DELETE FROM variantes');
    await pool.query('DELETE FROM productos');
    await seedData();
  });

  test('creates reservation when stock available', async () => {
    const result = await createReservation({
      items: [{ variantId: seededVariantId, quantity: 2 }],
      nombre: 'Cliente',
      email: 'cliente@example.com',
      telefono: '123456789',
      ventanaHoras: 24
    });
    expect(result.codigo).toHaveLength(8);
    const variant = await pool.query(
      'SELECT stock_disponible, stock_reservado FROM variantes WHERE id=$1',
      [seededVariantId]
    );
    expect(variant.rows[0]).toEqual({
      stock_disponible: 0,
      stock_reservado: 2
    });
  });

  test('throws conflict when no stock', async () => {
    await pool.query('UPDATE variantes SET stock_disponible=0 WHERE id=$1', [
      seededVariantId
    ]);
    await expect(
      createReservation({
        items: [{ variantId: seededVariantId, quantity: 1 }],
        nombre: 'Cliente',
        email: 'cliente@example.com',
        telefono: '123456789',
        ventanaHoras: 24
      })
    ).rejects.toMatchObject({ status: 409 });
  });

  test('expires reservations and releases stock', async () => {
    await pool.query(
      `INSERT INTO reservas(codigo, variante_id, nombre, email, telefono, estado, fecha_expiracion)
       VALUES('CODIGO1', $1, 'Test', 't@example.com', '999', 'activa', now() - interval '1 hour')`,
      [seededVariantId]
    );
    await pool.query(
      `INSERT INTO reservation_items(reserva_id, variante_id, cantidad, precio_reserva)
       VALUES((SELECT id FROM reservas WHERE codigo='CODIGO1'), $1, 1, 0)`,
      [seededVariantId]
    );
    await pool.query(
      'UPDATE variantes SET stock_disponible=1, stock_reservado=1 WHERE id=$1',
      [seededVariantId]
    );
    const count = await expireReservations();
    expect(count).toBe(1);
    const res = await pool.query(
      'SELECT estado FROM reservas WHERE codigo=$1',
      ['CODIGO1']
    );
    expect(res.rows[0].estado).toBe('expirada');
    const variant = await pool.query(
      'SELECT stock_disponible, stock_reservado FROM variantes WHERE id=$1',
      [seededVariantId]
    );
    expect(variant.rows[0]).toEqual({
      stock_disponible: 2,
      stock_reservado: 0
    });
  });

  test('create and fetch reservation', async () => {
    const result = await createReservation({
      items: [{ variantId: seededVariantId, quantity: 1 }],
      nombre: 'Cliente',
      email: 'cliente@example.com',
      telefono: '123456789',
      ventanaHoras: 24
    });
    const fetched = await getReservationByCode(result.codigo);
    expect(fetched?.codigo).toBe(result.codigo);
  });
});

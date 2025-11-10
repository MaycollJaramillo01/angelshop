import createError from 'http-errors';
import { pool } from '../../db/pool.js';
import { Variant } from './variants.types.js';

export const listVariantsByProduct = async (productId: number): Promise<Variant[]> => {
  const { rows } = await pool.query<Variant>('SELECT * FROM variantes WHERE producto_id=$1 ORDER BY talla ASC', [productId]);
  return rows;
};

export const updateVariant = async (id: number, data: Partial<Pick<Variant, 'stock_disponible' | 'stock_reservado'>>): Promise<Variant> => {
  const { rows } = await pool.query<Variant>(
    `UPDATE variantes SET stock_disponible=$1, stock_reservado=$2, updated_at=now() WHERE id=$3 RETURNING *`,
    [data.stock_disponible, data.stock_reservado, id]
  );
  const variant = rows[0];
  if (!variant) {
    throw createError(404, 'Variante no encontrada');
  }
  return variant;
};

import { pool } from '../../db/pool.js';
import { PaginatedProducts, Product } from './products.types.js';

export const listProducts = async (page = 1, pageSize = 12): Promise<PaginatedProducts> => {
  const offset = (page - 1) * pageSize;
  const client = await pool.connect();
  try {
    const [items, count] = await Promise.all([
      client.query<Product>('SELECT * FROM productos ORDER BY created_at DESC LIMIT $1 OFFSET $2', [pageSize, offset]),
      client.query<{ count: string }>('SELECT COUNT(*)::text as count FROM productos')
    ]);
    return {
      data: items.rows,
      total: Number(count.rows[0].count),
      page,
      pageSize
    };
  } finally {
    client.release();
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const { rows } = await pool.query<Product>('SELECT * FROM productos WHERE id=$1', [id]);
  return rows[0] ?? null;
};

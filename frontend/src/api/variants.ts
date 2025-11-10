import { apiClient } from './client.js';

export interface Variant {
  id: number;
  talla: string;
  color: string;
  sku: string;
  stock_disponible: number;
  stock_reservado: number;
}

export const fetchVariants = async (productoId: string) => {
  const { data } = await apiClient.get<Variant[]>(`variantes`, { params: { productoId } });
  return data;
};

import { apiClient } from './client.js';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export const fetchProducts = async () => {
  const { data } = await apiClient.get<{ data: Product[] }>('productos');
  return data.data;
};

export const fetchProduct = async (id: string) => {
  const { data } = await apiClient.get<Product>(`productos/${id}`);
  return data;
};

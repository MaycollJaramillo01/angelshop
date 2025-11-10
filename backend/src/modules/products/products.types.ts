export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado_publicacion: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

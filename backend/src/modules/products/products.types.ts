export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  slug: string;
  precio: number;
  image_url: string;
  categoria: string;
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

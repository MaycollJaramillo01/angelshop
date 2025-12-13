import { apiClient } from './client.js';

export interface CreateReservationItemBody {
  variantId: number;
  quantity: number;
}

export interface CreateReservationBody {
  items: CreateReservationItemBody[];
  nombre: string;
  email: string;
  telefono: string;
  ventanaHoras: 24 | 48 | 72;
}

export interface ReservationItem {
  id: number;
  reserva_id: number;
  variante_id: number;
  quantity: number;
  price_snapshot: number;
  producto_nombre?: string;
  talla?: string;
  color?: string;
}

export interface ReservationDetails {
  id: number;
  codigo: string;
  estado: string;
  fecha_expiracion: string;
  fecha_creacion: string;
  items: ReservationItem[];
}

export interface PaginatedReservations {
  data: ReservationDetails[];
  total: number;
  page: number;
  pageSize: number;
}

export const createReservation = async (body: CreateReservationBody) => {
  const { data } = await apiClient.post<ReservationDetails>('reservas', body);
  return data;
};

export const fetchReservation = async (codigo: string) => {
  const { data } = await apiClient.get<ReservationDetails>(
    `reservas/${codigo}`
  );
  return data;
};

export const fetchAdminReservations = async (
  token: string,
  params: { page?: number; pageSize?: number } = {}
) => {
  const { data } = await apiClient.get<PaginatedReservations>(
    'admin/reservas',
    {
      params,
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return data;
};

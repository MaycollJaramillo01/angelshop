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
  cantidad: number;
  precio_reserva: number;
}

export interface ReservationDetails {
  id: number;
  codigo: string;
  estado: string;
  fecha_expiracion: string;
  fecha_creacion: string;
  items: ReservationItem[];
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

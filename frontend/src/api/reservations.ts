import { apiClient } from './client.js';

export interface CreateReservationBody {
  varianteId: number;
  nombre: string;
  email: string;
  telefono: string;
  ventanaHoras: 24 | 48 | 72;
}

export const createReservation = async (body: CreateReservationBody) => {
  const { data } = await apiClient.post<{ codigo: string; fechaExpiracion: string }>('reservas', body);
  return data;
};

export interface ReservationDetails {
  id: number;
  codigo: string;
  estado: string;
  fecha_expiracion: string;
  fecha_creacion: string;
}

export const fetchReservation = async (codigo: string) => {
  const { data } = await apiClient.get<ReservationDetails>(`reservas/${codigo}`);
  return data;
};

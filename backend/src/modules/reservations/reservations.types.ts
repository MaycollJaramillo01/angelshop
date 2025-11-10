export type ReservationState = 'activa' | 'expirada' | 'cancelada' | 'retirada';

export interface Reservation {
  id: number;
  codigo: string;
  variante_id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: ReservationState;
  fecha_creacion: string;
  fecha_expiracion: string;
  observaciones: string | null;
}

export interface CreateReservationInput {
  varianteId: number;
  nombre: string;
  email: string;
  telefono: string;
  ventanaHoras: 24 | 48 | 72;
}

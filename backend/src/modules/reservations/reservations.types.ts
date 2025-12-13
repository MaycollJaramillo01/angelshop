export type ReservationState = 'activa' | 'expirada' | 'cancelada' | 'retirada';

export interface Reservation {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: ReservationState;
  fecha_creacion: string;
  fecha_expiracion: string;
  observaciones: string | null;
  items: ReservationItem[];
}

export interface ReservationItem {
  id: number;
  reserva_id: number;
  variante_id: number;
  cantidad: number;
  precio_reserva: number;
}

export interface CreateReservationItemInput {
  variantId: number;
  quantity: number;
}

export interface CreateReservationInput {
  items: CreateReservationItemInput[];
  nombre: string;
  email: string;
  telefono: string;
  ventanaHoras: 24 | 48 | 72;
}

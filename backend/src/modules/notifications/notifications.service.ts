import { pool } from '../../db/pool.js';
import { logger } from '../../utils/logger.js';
import { Reservation } from '../reservations/reservations.types.js';
import { sendMail } from './mailer.js';

type NotificationType = 'confirmacion' | 'recordatorio' | 'expiracion' | 'cancelacion';
type NotificationChannel = 'email' | 'sms';

const templates: Record<NotificationType, (reservation: Reservation) => string> = {
  confirmacion: (reservation) =>
    `Hola ${reservation.nombre}, tu reserva ${reservation.codigo} está activa hasta ${reservation.fecha_expiracion}.`,
  recordatorio: (reservation) =>
    `Recordatorio: tu reserva ${reservation.codigo} sigue activa hasta ${reservation.fecha_expiracion}.`,
  expiracion: (reservation) => `Tu reserva ${reservation.codigo} ha expirado.`,
  cancelacion: (reservation) => `Tu reserva ${reservation.codigo} ha sido cancelada.`
};

export const queueNotification = async (
  reservation: Reservation,
  tipo: NotificationType,
  canal: NotificationChannel = 'email'
) => {
  const payload = { subject: `Reserva ${tipo}`, body: templates[tipo](reservation) };
  await pool.query(`INSERT INTO notificaciones(reserva_id, tipo, canal, payload) VALUES($1,$2,$3,$4)`, [
    reservation.id,
    tipo,
    canal,
    JSON.stringify(payload)
  ]);

  if (canal === 'email') {
    await sendMail({ to: reservation.email, subject: payload.subject, text: payload.body });
  } else {
    logger.info('[SMS] (simulado)', { to: reservation.telefono, message: payload.body });
  }
};

export const findActiveExpiredReservations = `
  SELECT id, variante_id FROM reservas
  WHERE estado = 'activa' AND now() >= fecha_expiracion
  ORDER BY fecha_expiracion ASC
  FOR UPDATE SKIP LOCKED
`;

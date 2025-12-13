CREATE TABLE IF NOT EXISTS reservation_items (
  id SERIAL PRIMARY KEY,
  reserva_id INT REFERENCES reservas(id) ON DELETE CASCADE,
  variante_id INT REFERENCES variantes(id) ON DELETE CASCADE,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_reserva NUMERIC(10, 2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS reservation_items_reserva_idx ON reservation_items (reserva_id);

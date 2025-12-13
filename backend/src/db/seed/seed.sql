INSERT INTO productos (nombre, descripcion) VALUES
  ('Chaqueta Aurora', 'Chaqueta ligera para uso diario'),
  ('Vestido Solar', 'Vestido cómodo para verano')
ON CONFLICT DO NOTHING;

INSERT INTO variantes (producto_id, talla, color, sku, stock_disponible, stock_reservado)
VALUES
  (1, 'S', 'Azul', 'AURORA-S-AZUL', 5, 0),
  (1, 'M', 'Azul', 'AURORA-M-AZUL', 5, 0),
  (2, 'M', 'Rojo', 'SOLAR-M-ROJO', 4, 0)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO usuarios (nombre, email, hash_password, rol)
VALUES
  ('Admin', 'admin@angelshop.local', '$2a$10$7qDWUpAJZciV06P88GJE7e.fh3UeJ8V4aHcRUW2KIiMzFxLpy0X3C', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO reservas (codigo, variante_id, nombre, email, telefono, estado, fecha_expiracion)
VALUES
  ('RESERVA1', 1, 'Laura', 'laura@example.com', '600123123', 'activa', now() + interval '24 hours'),
  ('RESERVA2', 2, 'Carlos', 'carlos@example.com', '600456456', 'activa', now() + interval '48 hours'),
  ('RESERVA3', 3, 'Sonia', 'sonia@example.com', '600789789', 'cancelada', now() + interval '24 hours')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO reservation_items (reserva_id, variante_id, cantidad, precio_reserva)
VALUES
  ((SELECT id FROM reservas WHERE codigo = 'RESERVA1'), 1, 1, 0),
  ((SELECT id FROM reservas WHERE codigo = 'RESERVA2'), 2, 1, 0),
  ((SELECT id FROM reservas WHERE codigo = 'RESERVA3'), 3, 1, 0)
ON CONFLICT DO NOTHING;

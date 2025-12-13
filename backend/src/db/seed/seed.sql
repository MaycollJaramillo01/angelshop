TRUNCATE TABLE reservation_items, reservas, variantes, productos, usuarios RESTART IDENTITY CASCADE;

INSERT INTO usuarios (nombre, email, hash_password, rol)
VALUES
  ('Admin', 'admin@angelshop.local', '$2a$10$7qDWUpAJZciV06P88GJE7e.fh3UeJ8V4aHcRUW2KIiMzFxLpy0X3C', 'admin');

INSERT INTO productos (nombre, descripcion, slug, precio, image_url, categoria) VALUES
  ('Parka Aurora', 'Parka impermeable con forro térmico para climas fríos y lluviosos.', 'parka-aurora', 159.90, 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg', 'outerwear'),
  ('Zapatillas Brisa', 'Zapatillas ligeras con suela acolchada ideales para caminar en la ciudad.', 'zapatillas-brisa', 119.00, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 'footwear'),
  ('Camiseta Lienzo', 'Camiseta orgánica de algodón con cuello redondo y caída relajada.', 'camiseta-lienzo', 35.00, 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'tops'),
  ('Pantalón Eco Terra', 'Pantalón cargo de algodón reciclado con bolsillos amplios y corte recto.', 'pantalon-eco-terra', 89.50, 'https://images.pexels.com/photos/6311398/pexels-photo-6311398.jpeg', 'pants');

INSERT INTO variantes (producto_id, talla, color, sku, stock_disponible, stock_reservado)
VALUES
  (1, 'S', 'Gris Niebla', 'AURORA-S-GRIS', 8, 0),
  (1, 'M', 'Gris Niebla', 'AURORA-M-GRIS', 0, 0),
  (1, 'L', 'Negro Carbón', 'AURORA-L-NEGRO', 4, 0),
  (2, '38', 'Blanco Hielo', 'BRISA-38-BLANCO', 6, 0),
  (2, '39', 'Blanco Hielo', 'BRISA-39-BLANCO', 0, 0),
  (2, '40', 'Negro Grafito', 'BRISA-40-NEGRO', 3, 0),
  (3, 'S', 'Crudo', 'LIENZO-S-CRUDO', 5, 0),
  (3, 'M', 'Crudo', 'LIENZO-M-CRUDO', 2, 0),
  (3, 'L', 'Azul Noche', 'LIENZO-L-AZUL', 0, 0),
  (4, '30', 'Negro Bosque', 'TERRA-30-NEGRO', 3, 0),
  (4, '32', 'Oliva', 'TERRA-32-OLIVA', 1, 0),
  (4, '34', 'Arena', 'TERRA-34-ARENA', 0, 0);

INSERT INTO reservas (codigo, variante_id, nombre, email, telefono, estado, fecha_expiracion)
VALUES
  ('RES-URB-001', 1, 'Lucía Vega', 'lucia@ejemplo.com', '600111222', 'activa', now() + interval '24 hours'),
  ('RES-URB-002', 5, 'Miguel Soto', 'miguel@ejemplo.com', '600333444', 'activa', now() + interval '36 hours'),
  ('RES-URB-003', 9, 'Valeria Cruz', 'valeria@ejemplo.com', '600555666', 'cancelada', now() + interval '12 hours'),
  ('RES-URB-004', 10, 'Diego Marín', 'diego@ejemplo.com', '600777888', 'activa', now() + interval '48 hours');

INSERT INTO reservation_items (reserva_id, variante_id, quantity, price_snapshot)
VALUES
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-001'), 1, 2, 159.90),
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-001'), 7, 1, 35.00),
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-002'), 5, 1, 119.00),
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-003'), 9, 1, 35.00),
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-004'), 10, 1, 89.50),
  ((SELECT id FROM reservas WHERE codigo = 'RES-URB-004'), 4, 1, 119.00);

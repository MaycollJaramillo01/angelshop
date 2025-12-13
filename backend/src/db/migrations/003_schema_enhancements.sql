ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS categoria TEXT NOT NULL DEFAULT 'general';

UPDATE productos
SET slug = 'producto-' || id::text
WHERE slug IS NULL;

ALTER TABLE productos
  ALTER COLUMN slug DROP DEFAULT,
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE productos ADD CONSTRAINT productos_slug_unique UNIQUE (slug);

CREATE INDEX productos_categoria_idx ON productos (categoria);

ALTER TABLE variantes ALTER COLUMN stock_disponible SET DEFAULT 0;
ALTER TABLE variantes ALTER COLUMN stock_reservado SET DEFAULT 0;

ALTER TABLE variantes
  ADD CONSTRAINT variantes_producto_talla_color_key UNIQUE (producto_id, talla, color);

ALTER TABLE variantes
  ADD CONSTRAINT variantes_talla_not_empty CHECK (talla <> '');
ALTER TABLE variantes
  ADD CONSTRAINT variantes_color_not_empty CHECK (color <> '');

CREATE INDEX variantes_producto_idx ON variantes (producto_id);

ALTER TABLE reservation_items RENAME COLUMN cantidad TO quantity;
ALTER TABLE reservation_items RENAME COLUMN precio_reserva TO price_snapshot;

ALTER TABLE reservation_items
  ALTER COLUMN quantity SET NOT NULL,
  ALTER COLUMN price_snapshot SET NOT NULL,
  ALTER COLUMN price_snapshot SET DEFAULT 0;

ALTER TABLE reservation_items
  ADD CONSTRAINT reservation_items_quantity_check CHECK (quantity > 0);

CREATE INDEX reservation_items_variante_idx ON reservation_items (variante_id);
CREATE INDEX reservation_items_reserva_variante_idx ON reservation_items (reserva_id, variante_id);

CREATE INDEX reservas_estado_idx ON reservas (estado);
CREATE INDEX reservas_estado_expiracion_idx ON reservas (estado, fecha_expiracion);

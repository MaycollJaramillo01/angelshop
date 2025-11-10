CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado_publicacion BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS variantes (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  talla TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  stock_disponible INT NOT NULL CHECK (stock_disponible >= 0),
  stock_reservado INT NOT NULL DEFAULT 0 CHECK (stock_reservado >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  variante_id INT REFERENCES variantes(id),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('activa','expirada','cancelada','retirada')),
  fecha_creacion TIMESTAMPTZ DEFAULT now(),
  fecha_expiracion TIMESTAMPTZ NOT NULL,
  observaciones TEXT
);

CREATE TABLE IF NOT EXISTS notificaciones (
  id SERIAL PRIMARY KEY,
  reserva_id INT REFERENCES reservas(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('confirmacion','recordatorio','expiracion','cancelacion')),
  canal TEXT CHECK (canal IN ('email','sms')),
  estado_envio TEXT DEFAULT 'pendiente',
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  email TEXT UNIQUE,
  hash_password TEXT,
  rol TEXT CHECK (rol IN ('admin','operador')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reservas_variante_estado_idx ON reservas (variante_id, estado);
CREATE INDEX IF NOT EXISTS reservas_fecha_expiracion_idx ON reservas (fecha_expiracion);

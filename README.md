# AngelShop Monorepo (Local)

Sistema de reservas de prendas sin pago con backend Express + PostgreSQL y frontend React.

## Requisitos

- Node.js 20
- Docker (opcional para stack completo)

## Puesta en marcha rápida

```bash
docker compose up --build
```

Servicios:

- Frontend: http://localhost:5173
- Backend API + Socket.io: http://localhost:4000
- MailHog UI: http://localhost:8025
- PostgreSQL 17: localhost:5432 (postgres/postgres)

El backend aplica migraciones y seed manualmente mediante:

```bash
cd backend
npm install
npm run db:setup # crea la base de datos si no existe, migra y deja datos de prueba con imágenes reales
npm run dev
```

Comandos individuales si necesitas control granular:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

Frontend en paralelo:

```bash
cd frontend
npm install
npm run dev
```

## Autenticación

- JWT con secreto local `dev-secret`.
- Usuario inicial: `admin@angelshop.local` / `admin123`.

## Tests

```bash
cd backend
npm test
```

## Notificaciones

- Envío simulado a consola.
- Si MailHog está disponible se usa como SMTP local (host `mailhog`, puerto `1025`).

## Tiempo real

- Socket.io emite eventos: `stock:updated`, `reserva:creada`, `reserva:expirada`, `reserva:cancelada`.

## Seguridad

- Helmet, CORS restringido a localhost, rate limiting básico y validaciones Zod.

## Estructura

```
angelshop/
  backend/
  frontend/
  docker-compose.yml
```

Migraciones en `backend/src/db/migrations` y semilla en `backend/src/db/seed/seed.sql`.

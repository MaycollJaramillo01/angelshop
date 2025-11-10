import dotenv from 'dotenv';

dotenv.config();

const number = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  port: number(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/angelshop',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:*',
  mailhogHost: process.env.MAILHOG_HOST ?? 'localhost',
  mailhogPort: number(process.env.MAILHOG_PORT, 1025)
};

import { Client } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const escapeIdentifier = (identifier: string): string =>
  `"${identifier.replace(/"/g, '""')}"`;

const buildAdminConnection = () => {
  const url = new URL(env.databaseUrl);
  const databaseName = url.pathname.replace(/^\//, '');

  if (!databaseName) {
    throw new Error(
      'DATABASE_URL no contiene un nombre de base de datos válido'
    );
  }

  const adminUrl = new URL(env.databaseUrl);
  adminUrl.pathname = '/postgres';

  return { databaseName, adminConnectionString: adminUrl.toString() };
};

const run = async () => {
  const { databaseName, adminConnectionString } = buildAdminConnection();

  if (databaseName === 'postgres') {
    logger.info(
      'Usando base de datos postgres por defecto, no se requiere creación'
    );
    return;
  }

  const client = new Client({ connectionString: adminConnectionString });
  await client.connect();

  const { rowCount } = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [databaseName]
  );

  if ((rowCount ?? 0) === 0) {
    logger.info(`Creando base de datos ${databaseName}`);
    await client.query(`CREATE DATABASE ${escapeIdentifier(databaseName)}`);
  } else {
    logger.info(`Base de datos ${databaseName} ya existe, se omite creación`);
  }

  await client.end();
};

run().catch((error) => {
  logger.error('Error verificando/creando la base de datos', { error });
  process.exitCode = 1;
});

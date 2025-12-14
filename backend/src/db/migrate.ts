import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

export const runMigrations = async (
  options: { closeConnection?: boolean } = {}
) => {
  const { closeConnection = true } = options;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  await pool.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, executed_at TIMESTAMPTZ DEFAULT now())`
  );
  for (const file of files) {
    const { rowCount } = await pool.query(
      'SELECT 1 FROM schema_migrations WHERE filename=$1',
      [file]
    );
    if ((rowCount ?? 0) > 0) {
      logger.info(`Migración ${file} ya aplicada, se omite`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    logger.info(`Ejecutando migración ${file}`);
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations(filename) VALUES($1)', [
      file
    ]);
  }
  if (closeConnection) {
    await pool.end();
  }
};

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  runMigrations().catch((error) => {
    logger.error('Error ejecutando migraciones', { error });
    process.exitCode = 1;
  });
}

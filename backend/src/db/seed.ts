import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedFile = path.join(__dirname, 'seed', 'seed.sql');

const run = async () => {
  const sql = fs.readFileSync(seedFile, 'utf8');
  logger.info('Ejecutando seed determinístico');
  await pool.query(sql);
  await pool.end();
};

run().catch((error) => {
  logger.error('Error ejecutando seed', { error });
  process.exitCode = 1;
});

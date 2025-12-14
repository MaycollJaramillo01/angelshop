import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { runMigrations } from './db/migrate.js';
import { initSocket } from './realtime/socket.js';
import { startExpirationJob } from './jobs/expireReservations.job.js';
import { logger } from './utils/logger.js';

const start = async () => {
  await runMigrations({ closeConnection: false });

  const app = createApp();
  const server = http.createServer(app);

  initSocket(server);
  startExpirationJob();

  server.listen(env.port, () => {
    logger.info(`Servidor iniciado en http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  logger.error('Error iniciando servidor', { error });
  process.exitCode = 1;
});

import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { initSocket } from './realtime/socket.js';
import { startExpirationJob } from './jobs/expireReservations.job.js';
import { logger } from './utils/logger.js';

const app = createApp();
const server = http.createServer(app);

initSocket(server);
startExpirationJob();

server.listen(env.port, () => {
  logger.info(`Servidor iniciado en http://localhost:${env.port}`);
});

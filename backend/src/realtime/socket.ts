import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: /http:\/\/localhost:.*/ }
  });

  io.on('connection', (socket) => {
    logger.info('Cliente conectado a tiempo real', { id: socket.id });
  });

  return io;
};

export const emitRealtime = (event: string, payload: unknown) => {
  if (!io) return;
  io.emit(event, payload);
};

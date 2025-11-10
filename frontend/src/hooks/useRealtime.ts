import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRealtimeStore, useToastStore } from '../app/store';

const endpoint = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1').replace(/\/v1$/, '');

export const useRealtime = () => {
  const setOnline = useRealtimeStore((s) => s.setOnline);
  const showMessage = useToastStore((s) => s.showMessage);

  useEffect(() => {
    const socket: Socket = io(endpoint, { transports: ['websocket'], autoConnect: true });
    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));
    socket.on('reserva:creada', () => showMessage('Nueva reserva creada en tiempo real.'));
    socket.on('reserva:expirada', () => showMessage('Una reserva ha expirado.'));
    socket.on('reserva:cancelada', () => showMessage('Una reserva fue cancelada.'));
    return () => {
      socket.disconnect();
    };
  }, [setOnline, showMessage]);
};

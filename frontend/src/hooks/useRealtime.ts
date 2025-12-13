import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRealtimeStore, useToastStore, useVariantStore } from '../app/store';
import { fetchVariants } from '../api/variants';
import { REALTIME_ENDPOINT } from '../api/client';

export const useRealtime = () => {
  const setOnline = useRealtimeStore((s) => s.setOnline);
  const showMessage = useToastStore((s) => s.showMessage);
  const findProductByVariant = useVariantStore((s) => s.findProductByVariant);
  const setVariants = useVariantStore((s) => s.setVariants);

  useEffect(() => {
    const socket: Socket = io(REALTIME_ENDPOINT, {
      transports: ['websocket'],
      autoConnect: true
    });

    const refreshVariantStock = async (variantId: number) => {
      const productId = findProductByVariant(variantId);
      if (!productId) return;
      try {
        const data = await fetchVariants(productId);
        setVariants(productId, data);
      } catch (error) {
        console.error('No se pudo actualizar el stock en tiempo real', error);
      }
    };

    const handleConnect = () => setOnline(true);
    const handleDisconnect = () => setOnline(false);
    const handleStockUpdated = (payload: { varianteId: number }) => {
      if (payload?.varianteId) {
        refreshVariantStock(payload.varianteId);
      }
    };
    const handleReservationCreated = () =>
      showMessage('Nueva reserva creada en tiempo real.');
    const handleReservationExpired = () =>
      showMessage('Una reserva ha expirado.');
    const handleReservationCancelled = () =>
      showMessage('Una reserva fue cancelada.');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('stock:updated', handleStockUpdated);
    socket.on('reserva:creada', handleReservationCreated);
    socket.on('reserva:expirada', handleReservationExpired);
    socket.on('reserva:cancelada', handleReservationCancelled);
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('stock:updated', handleStockUpdated);
      socket.off('reserva:creada', handleReservationCreated);
      socket.off('reserva:expirada', handleReservationExpired);
      socket.off('reserva:cancelada', handleReservationCancelled);
      socket.disconnect();
    };
  }, [findProductByVariant, setOnline, setVariants, showMessage]);
};

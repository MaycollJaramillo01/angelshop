import { useRealtimeStore } from '../app/store';

export const RealtimeBadge = () => {
  const online = useRealtimeStore((s) => s.online);
  return (
    <div className={`realtime-badge ${online ? 'online' : 'offline'}`} aria-live="polite">
      Tiempo real: {online ? 'conectado' : 'desconectado'}
    </div>
  );
};

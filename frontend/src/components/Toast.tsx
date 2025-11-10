import { useEffect } from 'react';
import { useToastStore } from '../app/store';

export const Toast = () => {
  const { message, clear } = useToastStore();

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => clear(), 4000);
    return () => clearTimeout(id);
  }, [message, clear]);

  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
      <button onClick={clear} className="icon-button" aria-label="Cerrar aviso">
        ×
      </button>
    </div>
  );
};

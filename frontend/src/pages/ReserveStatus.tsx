import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReservation, ReservationDetails } from '../api/reservations';

const ReserveStatus = () => {
  const { codigo } = useParams();
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);

  useEffect(() => {
    if (!codigo) return;
    fetchReservation(codigo).then(setReservation).catch(() => setReservation(null));
  }, [codigo]);

  if (!reservation) {
    return <p role="status">Cargando reserva...</p>;
  }

  return (
    <section>
      <h1>Estado de la reserva</h1>
      <dl className="detail-list">
        <div>
          <dt>Código</dt>
          <dd>{reservation.codigo}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{reservation.estado}</dd>
        </div>
        <div>
          <dt>Expira</dt>
          <dd>{new Date(reservation.fecha_expiracion).toLocaleString()}</dd>
        </div>
      </dl>
    </section>
  );
};

export default ReserveStatus;

import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Reservation {
  id: number;
  codigo: string;
  estado: string;
  fecha_creacion: string;
  fecha_expiracion: string;
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('angelshop-token');
    if (!token) {
      setReservations([]);
      return;
    }
    apiClient
      .get<Reservation[]>('admin/reservas', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => setReservations(response.data))
      .catch(() => setReservations([]));
  }, []);

  return (
    <section>
      <h1>Reservas</h1>
      <table className="data-table">
        <caption>Listado de reservas activas y recientes</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Estado</th>
            <th scope="col">Creación</th>
            <th scope="col">Expiración</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan={4}>Inicia sesión para ver reservas o no hay datos disponibles.</td>
            </tr>
          ) : (
            reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.codigo}</td>
                <td>{reservation.estado}</td>
                <td>{new Date(reservation.fecha_creacion).toLocaleString()}</td>
                <td>{new Date(reservation.fecha_expiracion).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default AdminReservations;

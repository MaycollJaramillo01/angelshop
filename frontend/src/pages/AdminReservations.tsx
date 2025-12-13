import {
  Fragment,
  type ChangeEvent,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  fetchAdminReservations,
  PaginatedReservations,
  ReservationDetails
} from '../api/reservations';

const AdminReservations = () => {
  const [reservations, setReservations] = useState<PaginatedReservations>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10
  });
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(reservations.total / reservations.pageSize), 1),
    [reservations.total, reservations.pageSize]
  );

  useEffect(() => {
    const token = localStorage.getItem('angelshop-token');
    if (!token) {
      setReservations({ data: [], total: 0, page: 1, pageSize: 10 });
      return;
    }

    setLoading(true);
    fetchAdminReservations(token, {
      page: reservations.page,
      pageSize: reservations.pageSize
    })
      .then(setReservations)
      .catch(() =>
        setReservations({ data: [], total: 0, page: 1, pageSize: 10 })
      )
      .finally(() => setLoading(false));
  }, [reservations.page, reservations.pageSize]);

  const handlePageChange = (page: number) => {
    setReservations((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    setReservations((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  return (
    <section>
      <h1>Reservas</h1>
      <div
        className="table-actions"
        style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
      >
        <label>
          Tamaño de página
          <select value={reservations.pageSize} onChange={handlePageSizeChange}>
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div style={{ marginLeft: 'auto' }}>
          Página {reservations.page} de {totalPages}
        </div>
      </div>
      <table className="data-table">
        <caption>Listado de reservas activas y recientes</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Estado</th>
            <th scope="col">Creación</th>
            <th scope="col">Expiración</th>
            <th scope="col">Artículos</th>
          </tr>
        </thead>
        <tbody>
          {reservations.data.length === 0 ? (
            <tr>
              <td colSpan={5}>
                {loading
                  ? 'Cargando reservas...'
                  : 'Inicia sesión para ver reservas o no hay datos disponibles.'}
              </td>
            </tr>
          ) : (
            reservations.data.map((reservation) => (
              <Fragment key={reservation.id}>
                <tr key={reservation.id}>
                  <td>{reservation.codigo}</td>
                  <td>{reservation.estado}</td>
                  <td>
                    {new Date(reservation.fecha_creacion).toLocaleString()}
                  </td>
                  <td>
                    {new Date(reservation.fecha_expiracion).toLocaleString()}
                  </td>
                  <td>{reservation.items.length}</td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <ReservationItemsTable items={reservation.items} />
                  </td>
                </tr>
              </Fragment>
            ))
          )}
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem'
        }}
      >
        <button
          type="button"
          onClick={() => handlePageChange(Math.max(1, reservations.page - 1))}
          disabled={reservations.page <= 1 || loading}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() =>
            handlePageChange(Math.min(totalPages, reservations.page + 1))
          }
          disabled={reservations.page >= totalPages || loading}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

const ReservationItemsTable = ({
  items
}: {
  items: ReservationDetails['items'];
}) => {
  if (items.length === 0) {
    return <p>No hay artículos asociados.</p>;
  }

  return (
    <table className="data-table" aria-label="Artículos de la reserva">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Talla</th>
          <th scope="col">Color</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio reservado</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.producto_nombre ?? 'Producto'}</td>
            <td>{item.talla ?? '—'}</td>
            <td>{item.color ?? '—'}</td>
            <td>{item.quantity}</td>
            <td>{item.price_snapshot.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminReservations;

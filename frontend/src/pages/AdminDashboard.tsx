import { Outlet } from 'react-router-dom';

const AdminDashboard = () => (
  <section>
    <h1>Panel de administración</h1>
    <p>Gestiona reservas, productos y variantes.</p>
    <Outlet />
  </section>
);

export default AdminDashboard;

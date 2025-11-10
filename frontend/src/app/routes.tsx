import React, { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { RealtimeBadge } from '../components/RealtimeBadge';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';

const Home = lazy(() => import('../pages/Home'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const ReserveStatus = lazy(() => import('../pages/ReserveStatus'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/AdminProducts'));
const AdminVariants = lazy(() => import('../pages/AdminVariants'));
const AdminReservations = lazy(() => import('../pages/AdminReservations'));

const Loading = () => <div className="loading" role="status">Cargando...</div>;

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-shell">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header />
    <main id="contenido" className="main-content">
      <RealtimeBadge />
      {children}
    </main>
    <Footer />
    <Toast />
  </div>
);

export const AppRoutes = () => {
  const element = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/producto/:slug', element: <ProductDetail /> },
    { path: '/reserva/:codigo', element: <ReserveStatus /> },
    { path: '/admin', element: <AdminLogin /> },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />,
      children: [{ index: true, element: <AdminReservations /> }]
    },
    { path: '/admin/productos', element: <AdminProducts /> },
    { path: '/admin/variantes', element: <AdminVariants /> },
    { path: '/admin/reservas', element: <AdminReservations /> }
  ]);

  return (
    <Layout>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </Layout>
  );
};

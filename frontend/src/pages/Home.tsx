import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../api/products';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data)).catch(() => setProducts([]));
  }, []);

  return (
    <section>
      <header className="section-header">
        <h1>Reserva tus prendas favoritas</h1>
        <p>Sin pagos, con confirmación inmediata y accesibilidad AA.</p>
      </header>
      <div className="grid" role="list">
        {products.map((product) => (
          <article key={product.id} role="listitem" className="product-card">
            <h2>{product.nombre}</h2>
            <p>{product.descripcion ?? 'Descubre los detalles en la ficha del producto.'}</p>
            <Link className="button" to={`/producto/${product.id}`}>
              Reservar
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Home;

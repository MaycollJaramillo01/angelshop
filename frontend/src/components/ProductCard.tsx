import { Link } from 'react-router-dom';
import type { Product } from '../api/products';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => (
  <article className="product-card" aria-labelledby={`product-${product.id}`}>
    <h3 id={`product-${product.id}`}>{product.nombre}</h3>
    <p>{product.descripcion}</p>
    <Link className="button" to={`/producto/${product.id}`}>Ver detalles</Link>
  </article>
);

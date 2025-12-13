import { Link } from 'react-router-dom';
import { Card, CardBody, CardText, Button } from 'reactstrap';
import type { Product } from '../api/products';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => (
  <Card className="product-card" aria-labelledby={`product-${product.id}`}>
    <CardBody>
      <h3 id={`product-${product.id}`}>{product.nombre}</h3>
      <CardText>{product.descripcion}</CardText>
      <Button tag={Link} to={`/producto/${product.id}`} color="dark" outline>
        Ver detalles
      </Button>
    </CardBody>
  </Card>
);

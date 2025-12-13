import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../api/products';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardText,
  CardFooter,
  CardSubtitle,
  Badge
} from 'reactstrap';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section>
      <Container>
        <section className="hero">
          <Row className="align-items-center">
            <Col md="6">
              <div className="hero-copy">
                <span className="hero-kicker">Nueva cápsula minimal</span>
                <h1 className="hero-title">
                  Reserva estilo boutique inspirado en Zara.com
                </h1>
                <p>
                  Piezas esenciales en tonos neutros y siluetas limpias. Reserva
                  sin pago, confirma al instante y retira en tienda con la misma
                  experiencia editorial.
                </p>
                <div className="d-flex gap-3 align-items-center">
                  <Button tag={Link} to="#coleccion" color="dark">
                    Ver colección
                  </Button>
                  <Button tag={Link} to="/admin" color="light" outline>
                    Panel de stock
                  </Button>
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <Badge color="dark">Reserva sin pago</Badge>
                  <span>Confirmación inmediata · Accesibilidad AA</span>
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className="hero-visual" aria-hidden="true" />
            </Col>
          </Row>
        </section>

        <header className="section-header" id="coleccion">
          <div className="section-title" aria-hidden="true">
            <span className="accent-line" /> Selección esencial
          </div>
          <h2>Diseños listos para reservar</h2>
          <p>
            Curaduría en clave minimal: cortes rectos, algodón premium y
            detalles que evocan la estética de Zara, ahora con reserva segura.
          </p>
        </header>

        <Row role="list">
          {products.map((product) => (
            <Col key={product.id} role="listitem" md="4" sm="6">
              <Card className="product-card">
                <CardBody>
                  <CardSubtitle>
                    {product.descripcion
                      ? 'Colección cápsula'
                      : 'Edición boutique'}
                  </CardSubtitle>
                  <h2>{product.nombre}</h2>
                  <CardText>
                    {product.descripcion ??
                      'Descubre los detalles en la ficha del producto.'}
                  </CardText>
                </CardBody>
                <CardFooter>
                  <span className="fw-semibold">Disponible para retiro</span>
                  <Button
                    tag={Link}
                    to={`/producto/${product.id}`}
                    color="dark"
                    outline
                  >
                    Reservar
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Home;

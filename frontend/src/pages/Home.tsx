import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Carousel,
  CarouselIndicators,
  CarouselItem,
  Col,
  Container,
  Row
} from 'reactstrap';
import { fetchProducts, Product } from '../api/products';

const bannerItems = [
  {
    id: 1,
    title: 'Colección esencial',
    subtitle:
      'Líneas depuradas, texturas suaves y tonos neutros para vestir sin esfuerzo.',
    tag: 'NOVEDAD'
  },
  {
    id: 2,
    title: 'Sastrería relajada',
    subtitle:
      'Blazers, camisas y pantalones con caídas ligeras y siluetas minimalistas.',
    tag: 'EDICIÓN LIMITADA'
  },
  {
    id: 3,
    title: 'Todo el día',
    subtitle:
      'Prendas versátiles que combinan confort y elegancia para cualquier plan.',
    tag: 'EXPERIENCIA ANGELSHOP'
  }
];

const createPlaceholder = (title: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23323330' font-family='Georgia,Times,serif' font-size='56'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const hasProducts = useMemo(() => products.length > 0, [products.length]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === bannerItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? bannerItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  return (
    <>
      <section className="banner-section py-4">
        <Container>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            className="minimal-carousel"
          >
            <CarouselIndicators
              items={bannerItems}
              activeIndex={activeIndex}
              onClickHandler={goToIndex}
            />
            {bannerItems.map((item) => (
              <CarouselItem
                key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
              >
                <Row className="align-items-center g-4 py-4">
                  <Col md="7">
                    <p className="text-uppercase letter-spaced small mb-2 text-muted">
                      {item.tag}
                    </p>
                    <h2 className="display-5 text-serif mb-3">{item.title}</h2>
                    <p className="lead text-secondary mb-0">{item.subtitle}</p>
                  </Col>
                  <Col md="5" className="text-md-end">
                    <div className="banner-block" aria-hidden="true">
                      <span className="banner-line" />
                      <span className="banner-line" />
                      <span className="banner-line" />
                    </div>
                  </Col>
                </Row>
              </CarouselItem>
            ))}
          </Carousel>
        </Container>
      </section>

      <section className="hero-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="8">
              <p className="text-uppercase letter-spaced small mb-2 text-muted">
                Reserva inmediata
              </p>
              <h1 className="display-4 text-serif mb-3">
                Tu estilo, sin esperas
              </h1>
              <p className="lead text-secondary">
                Descubre prendas con estética minimalista y acabados cuidados.
                Reserva ahora y paga en tienda solo cuando confirmes tu
                selección.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <header className="section-header mb-4 text-center">
            <p className="text-uppercase letter-spaced small mb-2 text-muted">
              Selección curada
            </p>
            <h3 className="fw-semibold">Reserva tus prendas favoritas</h3>
          </header>
          <Row className="g-4" role="list">
            {hasProducts ? (
              products.map((product) => (
                <Col key={product.id} md="4" role="listitem">
                  <Card className="h-100 shadow-sm border-0 product-card-elevated">
                    <CardImg
                      alt={`Imagen de ${product.nombre}`}
                      src={createPlaceholder(product.nombre)}
                      top
                      className="object-fit-cover"
                    />
                    <CardBody className="d-flex flex-column gap-2">
                      <CardTitle tag="h2" className="h5 text-serif mb-1">
                        {product.nombre}
                      </CardTitle>
                      <CardText className="text-secondary mb-3">
                        {product.descripcion ??
                          'Descubre los detalles en la ficha del producto.'}
                      </CardText>
                      <div className="mt-auto">
                        <Button
                          color="dark"
                          tag={Link}
                          to={`/producto/${product.id}`}
                          className="w-100"
                        >
                          Comprar/Reservar
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs="12" className="text-center text-secondary" role="status">
                Estamos curando las próximas prendas.
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, Product } from '../api/products';
import { VariantSelector } from '../components/VariantSelector';
import { ReserveForm } from '../components/ReserveForm';
import { useProductVariants } from '../hooks/useProductVariants';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge
} from 'reactstrap';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const variants = useProductVariants(slug);

  useEffect(() => {
    if (!slug) return;
    fetchProduct(slug)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [slug]);

  useEffect(() => {
    if (selected === null) return;
    const stillAvailable = variants.find(
      (variant) => variant.id === selected && variant.stock_disponible > 0
    );
    if (!stillAvailable) {
      setSelected(null);
    }
  }, [selected, variants]);

  if (!product) {
    return <p role="status">Cargando producto...</p>;
  }

  return (
    <section>
      <Container>
        <Row>
          <Col md="6">
            <Card className="product-card product-detail">
              <CardBody>
                <Badge color="dark">Edición boutique</Badge>
                <h1>{product.nombre}</h1>
                <CardText>
                  {product.descripcion ??
                    'Prenda disponible para reserva inmediata.'}
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <div className="product-detail">
              <VariantSelector
                variants={variants}
                selectedId={selected}
                onSelect={setSelected}
              />
              <ReserveForm varianteId={selected} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetail;

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, Product } from '../api/products';
import { Card } from '../components/Card';
import { Carousel, CarouselItem } from '../components/Carousel';
import { ReserveForm } from '../components/ReserveForm';
import { VariantSelector } from '../components/VariantSelector';
import { useProductVariants } from '../hooks/useProductVariants';

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

  const gallery = useMemo(
    () => [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80&sat=-80&blend-mode=multiply',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80'
    ],
    []
  );

  if (!product) {
    return <p role="status">Cargando producto...</p>;
  }

  return (
    <section className="product-detail minimal">
      <div className="product-hero">
        <Card
          className="media-card"
          title="Galería"
          description="Imágenes editoriales del producto"
        >
          <Carousel ariaLabel={`Imágenes de ${product.nombre}`}>
            {gallery.map((image, index) => (
              <CarouselItem key={`${product.id}-${index}`}>
                <img
                  src={image}
                  alt={`${product.nombre} - vista ${index + 1}`}
                />
              </CarouselItem>
            ))}
          </Carousel>
        </Card>

        <div className="product-info-stack">
          <Card
            title={product.nombre}
            description={
              product.descripcion ?? 'Prenda disponible para reserva inmediata.'
            }
          >
            <div className="product-copy">
              <p>
                Silueta limpia y proporciones relajadas en una paleta monocroma.
                Inspirada en la estética minimalista, lista para combinar con
                tus básicos favoritos.
              </p>
            </div>
          </Card>

          <Card
            title="Variantes"
            description="Selecciona tu talla y color preferidos."
          >
            <VariantSelector
              variants={variants}
              selectedId={selected}
              onSelect={setSelected}
            />
          </Card>

          <Card
            title="Reserva"
            description="Completa tus datos para asegurar la prenda."
          >
            <ReserveForm varianteId={selected} />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

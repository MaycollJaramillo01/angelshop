import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, Product } from '../api/products';
import { VariantSelector } from '../components/VariantSelector';
import { ReserveForm } from '../components/ReserveForm';
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

  if (!product) {
    return <p role="status">Cargando producto...</p>;
  }

  return (
    <section className="product-detail">
      <header>
        <h1>{product.nombre}</h1>
        <p>
          {product.descripcion ?? 'Prenda disponible para reserva inmediata.'}
        </p>
      </header>
      <VariantSelector
        variants={variants}
        selectedId={selected}
        onSelect={setSelected}
      />
      <ReserveForm varianteId={selected} />
    </section>
  );
};

export default ProductDetail;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, Product } from '../api/products';
import { fetchVariants, Variant } from '../api/variants';
import { VariantSelector } from '../components/VariantSelector';
import { ReserveForm } from '../components/ReserveForm';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchProduct(slug).then(setProduct).catch(() => setProduct(null));
    fetchVariants(slug).then((data) => setVariants(data)).catch(() => setVariants([]));
  }, [slug]);

  if (!product) {
    return <p role="status">Cargando producto...</p>;
  }

  return (
    <section className="product-detail">
      <header>
        <h1>{product.nombre}</h1>
        <p>{product.descripcion ?? 'Prenda disponible para reserva inmediata.'}</p>
      </header>
      <VariantSelector variants={variants} selectedId={selected} onSelect={setSelected} />
      <ReserveForm varianteId={selected} />
    </section>
  );
};

export default ProductDetail;

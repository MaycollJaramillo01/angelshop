import { useEffect } from 'react';
import { fetchVariants } from '../api/variants';
import { useVariantStore } from '../app/store';

export const useProductVariants = (productId: string | undefined) => {
  const variants = useVariantStore((state) =>
    productId ? (state.variantsByProduct[productId] ?? []) : []
  );
  const setVariants = useVariantStore((state) => state.setVariants);

  useEffect(() => {
    if (!productId) return;

    fetchVariants(productId)
      .then((data) => setVariants(productId, data))
      .catch(() => setVariants(productId, []));
  }, [productId, setVariants]);

  return variants;
};

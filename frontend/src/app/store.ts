import { create } from 'zustand';
import { Variant } from '../api/variants';

interface ToastState {
  message: string | null;
  showMessage: (message: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  showMessage: (message) => set({ message }),
  clear: () => set({ message: null })
}));

interface RealtimeState {
  online: boolean;
  setOnline: (value: boolean) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  online: false,
  setOnline: (online) => set({ online })
}));

interface VariantState {
  variantsByProduct: Record<string, Variant[]>;
  variantToProduct: Record<number, string>;
  setVariants: (productId: string, variants: Variant[]) => void;
  findProductByVariant: (variantId: number) => string | undefined;
}

export const useVariantStore = create<VariantState>((set, get) => ({
  variantsByProduct: {},
  variantToProduct: {},
  setVariants: (productId, variants) =>
    set((state) => {
      const variantToProduct = { ...state.variantToProduct };
      variants.forEach((variant) => {
        variantToProduct[variant.id] = productId;
      });
      return {
        variantsByProduct: {
          ...state.variantsByProduct,
          [productId]: variants
        },
        variantToProduct
      };
    }),
  findProductByVariant: (variantId) => get().variantToProduct[variantId]
}));

import { Variant } from '../api/variants';

interface Props {
  variants: Variant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const VariantSelector = ({ variants, selectedId, onSelect }: Props) => (
  <fieldset>
    <legend>Selecciona variante</legend>
    <div className="variant-grid">
      {variants.map((variant) => {
        const disabled = variant.stock_disponible <= 0;
        return (
          <label key={variant.id} className={`variant ${disabled ? 'disabled' : ''}`}>
            <input
              type="radio"
              name="variant"
              value={variant.id}
              disabled={disabled}
              checked={selectedId === variant.id}
              onChange={() => onSelect(variant.id)}
            />
            <span>{variant.talla} · {variant.color}</span>
            <span className="stock">{disabled ? 'Sin stock' : `Disponible: ${variant.stock_disponible}`}</span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

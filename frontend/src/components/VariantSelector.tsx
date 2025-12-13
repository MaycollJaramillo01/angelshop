import { Variant } from '../api/variants';
import { Badge, FormGroup } from './Form';

interface Props {
  variants: Variant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const VariantSelector = ({ variants, selectedId, onSelect }: Props) => (
  <FormGroup label="Selecciona variante" htmlFor="variant">
    <div className="variant-grid modern">
      {variants.map((variant) => {
        const disabled = variant.stock_disponible <= 0;
        const badgeTone = disabled
          ? 'danger'
          : variant.stock_disponible < 3
            ? 'muted'
            : 'success';
        const badgeLabel = disabled
          ? 'Sin stock'
          : variant.stock_disponible < 3
            ? `Últimas ${variant.stock_disponible}`
            : 'Disponible';
        return (
          <label
            key={variant.id}
            className={`variant minimal ${disabled ? 'disabled' : ''}`}
            aria-disabled={disabled}
          >
            <input
              type="radio"
              name="variant"
              id={`variant-${variant.id}`}
              value={variant.id}
              disabled={disabled}
              checked={selectedId === variant.id}
              onChange={() => onSelect(variant.id)}
            />
            <div className="variant-content">
              <div className="variant-meta">
                <span className="variant-title">{variant.talla}</span>
                <Badge tone={badgeTone as 'muted' | 'success' | 'danger'}>
                  {badgeLabel}
                </Badge>
              </div>
              <span className="variant-subtitle">{variant.color}</span>
            </div>
          </label>
        );
      })}
    </div>
  </FormGroup>
);

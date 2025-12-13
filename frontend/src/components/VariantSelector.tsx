import { Variant } from '../api/variants';
import { Badge, Input } from 'reactstrap';

interface Props {
  variants: Variant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const VariantSelector = ({ variants, selectedId, onSelect }: Props) => (
  <fieldset>
    <legend className="section-title">
      <span className="accent-line" /> Variantes disponibles
    </legend>
    <div className="variant-grid">
      {variants.map((variant) => {
        const disabled = variant.stock_disponible <= 0;
        const isActive = selectedId === variant.id;
        return (
          <label
            key={variant.id}
            className={`variant-card ${disabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">{variant.talla}</span>
              <Badge color={disabled ? 'light' : 'dark'}>{variant.color}</Badge>
            </div>
            <div className="card-text">
              {disabled ? 'Sin stock' : `Stock: ${variant.stock_disponible}`}
            </div>
            <div className="d-flex align-items-center gap-3">
              <Input
                type="radio"
                name="variant"
                value={variant.id}
                disabled={disabled}
                checked={isActive}
                onChange={() => onSelect(variant.id)}
                aria-label={`Elegir talla ${variant.talla} color ${variant.color}`}
              />
              <span className="fw-semibold">
                {isActive ? 'Seleccionado' : 'Elegir'}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  </fieldset>
);

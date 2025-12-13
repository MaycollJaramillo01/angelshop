import { FormEvent, useState } from 'react';
import { createReservation } from '../api/reservations';
import { useToastStore } from '../app/store';
import { useForm } from '../hooks/useForm';
import { Badge, Button, Form, FormGroup, Input } from './Form';

interface Props {
  varianteId: number | null;
}

export const ReserveForm = ({ varianteId }: Props) => {
  const { values, register, reset } = useForm({
    nombre: '',
    email: '',
    telefono: '',
    ventanaHoras: 24 as 24 | 48 | 72
  });
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const showMessage = useToastStore((s) => s.showMessage);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!varianteId) {
      showMessage('Selecciona una variante.');
      return;
    }
    if (quantity <= 0) {
      showMessage('Selecciona una cantidad válida.');
      return;
    }
    setLoading(true);
    try {
      const data = await createReservation({
        ...values,
        items: [{ variantId: varianteId, quantity }]
      });
      showMessage(
        `Reserva ${data.codigo} creada. Expira el ${new Date(data.fecha_expiracion).toLocaleString()}.`
      );
      reset();
      setQuantity(1);
    } catch (error) {
      showMessage('No se pudo crear la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} aria-describedby="captcha-hint">
      <div className="form-grid">
        <FormGroup label="Nombre" htmlFor="nombre">
          <Input id="nombre" {...register('nombre')} required minLength={2} />
        </FormGroup>
        <FormGroup label="Email" htmlFor="email">
          <Input id="email" type="email" {...register('email')} required />
        </FormGroup>
        <FormGroup label="Teléfono" htmlFor="telefono">
          <Input
            id="telefono"
            {...register('telefono')}
            required
            minLength={6}
          />
        </FormGroup>
        <FormGroup label="Cantidad" htmlFor="cantidad">
          <Input
            id="cantidad"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            required
          />
        </FormGroup>
        <FormGroup label="Ventana de recogida" htmlFor="ventanaHoras">
          <select
            id="ventanaHoras"
            className="input"
            {...register('ventanaHoras')}
          >
            <option value={24}>24 horas</option>
            <option value={48}>48 horas</option>
            <option value={72}>72 horas</option>
          </select>
        </FormGroup>
      </div>
      <div className="form-footer">
        <div
          className="captcha-mock"
          role="status"
          aria-live="polite"
          id="captcha-hint"
        >
          reCAPTCHA desactivado en local.
        </div>
        <div className="form-actions">
          <Badge tone={varianteId ? 'success' : 'danger'}>
            {varianteId
              ? 'Variante lista para reservar'
              : 'Selecciona una variante'}
          </Badge>
          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? 'Reservando...' : 'Reservar sin pago'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

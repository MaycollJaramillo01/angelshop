import { FormEvent, useState } from 'react';
import { createReservation } from '../api/reservations';
import { useToastStore } from '../app/store';
import { useForm } from '../hooks/useForm';

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
    <form
      onSubmit={handleSubmit}
      className="reserve-form"
      aria-describedby="captcha-hint"
    >
      <div>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" {...register('nombre')} required minLength={2} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} required />
      </div>
      <div>
        <label htmlFor="telefono">Teléfono</label>
        <input id="telefono" {...register('telefono')} required minLength={6} />
      </div>
      <div>
        <label htmlFor="cantidad">Cantidad</label>
        <input
          id="cantidad"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="ventanaHoras">Ventana de recogida</label>
        <select id="ventanaHoras" {...register('ventanaHoras')}>
          <option value={24}>24 horas</option>
          <option value={48}>48 horas</option>
          <option value={72}>72 horas</option>
        </select>
      </div>
      <div
        className="captcha-mock"
        role="status"
        aria-live="polite"
        id="captcha-hint"
      >
        reCAPTCHA desactivado en local.
      </div>
      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Reservando...' : 'Reservar sin pago'}
      </button>
    </form>
  );
};

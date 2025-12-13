import { ChangeEvent, FormEvent, useState } from 'react';
import { createReservation } from '../api/reservations';
import { useToastStore } from '../app/store';
import { useForm } from '../hooks/useForm';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

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
    <Form
      onSubmit={handleSubmit}
      className="reserve-form"
      aria-describedby="captcha-hint"
    >
      <FormGroup>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          {...register('nombre')}
          required
          minLength={2}
          placeholder="Nombre y apellido"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          required
          placeholder="tu@email.com"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          {...register('telefono')}
          required
          minLength={6}
          placeholder="+34 600 000 000"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="cantidad">Cantidad</Label>
        <Input
          id="cantidad"
          type="number"
          min={1}
          value={quantity}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setQuantity(Number(event.target.value))
          }
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="ventanaHoras">Ventana de recogida</Label>
        <Input id="ventanaHoras" type="select" {...register('ventanaHoras')}>
          <option value={24}>24 horas</option>
          <option value={48}>48 horas</option>
          <option value={72}>72 horas</option>
        </Input>
      </FormGroup>
      <div
        className="captcha-mock"
        role="status"
        aria-live="polite"
        id="captcha-hint"
      >
        reCAPTCHA desactivado en local.
      </div>
      <Button type="submit" color="dark" disabled={loading} className="mt-3">
        {loading ? 'Reservando...' : 'Reservar sin pago'}
      </Button>
    </Form>
  );
};

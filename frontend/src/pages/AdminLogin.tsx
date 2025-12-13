import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useToastStore } from '../app/store';
import {
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@angelshop.local');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();
  const showMessage = useToastStore((s) => s.showMessage);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { accessToken } = await login(email, password);
      localStorage.setItem('angelshop-token', accessToken);
      showMessage('Sesión iniciada.');
      navigate('/admin/reservas');
    } catch (error) {
      showMessage('Credenciales inválidas.');
    }
  };

  return (
    <Container className="admin-login">
      <Card className="product-card">
        <CardBody>
          <h1>Acceso admin</h1>
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </FormGroup>
            <Button type="submit" color="dark">
              Entrar
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default AdminLogin;

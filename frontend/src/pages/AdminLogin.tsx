import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useToastStore } from '../app/store';

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
    <section className="admin-login">
      <h1>Acceso admin</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="button">Entrar</button>
      </form>
    </section>
  );
};

export default AdminLogin;

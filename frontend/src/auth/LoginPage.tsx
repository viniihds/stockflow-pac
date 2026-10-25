import { FormEvent, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { setToken } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      nav('/');
    } catch (err: any) {
      setError(err?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card" role="main" aria-labelledby="auth-title">
      <div className="auth-brand">
        <div className="brand-mark">SF</div>
        <h1>StockFlow PAC</h1>
      </div>
      <h2 id="auth-title" className="auth-title">Acessar sua conta</h2>
      <p className="auth-subtitle">Entre para continuar gerenciando seu estoque</p>

      {error && <div className="alert error" role="alert">{error}</div>}

      <form onSubmit={onSubmit} aria-label="Formulario de login">
        <div className="form-field">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-label" htmlFor="password">Senha</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="auth-actions">
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <Link className="link" to="/register">Não tem conta? Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
}

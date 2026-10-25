import { FormEvent, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { setToken } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      const { token } = await api.register(email, password);
      setToken(token);
      nav('/');
    } catch (err: any) {
      setError(err?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card" role="main" aria-labelledby="register-title">
      <div className="auth-brand">
        <div className="brand-mark">SF</div>
        <h1>StockFlow PAC</h1>
      </div>
      <h2 id="register-title" className="auth-title">Criar sua conta</h2>
      <p className="auth-subtitle">Cadastre-se para começar a gerenciar seu estoque</p>

      {error && <div className="alert error" role="alert">{error}</div>}

      <form onSubmit={onSubmit} aria-label="Formulario de cadastro">
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
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-label" htmlFor="confirm">Confirmar senha</label>
          <input
            id="confirm"
            className="input"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <div className="auth-actions">
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <Link className="link" to="/login">Já tem conta? Entrar</Link>
        </div>
      </form>
    </div>
  );
}

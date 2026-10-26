import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { api } from '../api';
import { AuthProvider } from '../auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
  beforeEach(() => {
    // Simula usuario logado e evita chamadas reais de rede no painel
    localStorage.setItem('sf_token', 'token-de-teste');
    vi.spyOn(api, 'listMovementsSimple').mockResolvedValue([]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the stock management dashboard title', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(await screen.findByText('Visao geral do estoque')).toBeInTheDocument();
    expect(screen.getByText('Gestao de estoque')).toBeInTheDocument();
  });
});

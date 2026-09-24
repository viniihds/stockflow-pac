import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
  it('renders the stock management dashboard title', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getByText('Visao geral do estoque')).toBeInTheDocument();
    expect(screen.getByText('Gestao de estoque')).toBeInTheDocument();
  });
});

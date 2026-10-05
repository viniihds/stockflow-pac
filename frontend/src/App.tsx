import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, StockMovement } from './api';
import CategoriesPage from './categories/CategoriesPage';
import ProductsPage from './products/ProductsPage';
import MovementsPage from './movements/MovementsPage';
import FinancePage from './finance/FinancePage';
// Reports estão temporariamente desativados

function Dashboard() {
  const [items, setItems] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.listMovementsSimple();
        if (mounted) setItems(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Erro ao carregar movimentações');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Painel operacional</p>
          <h2>Visao geral do estoque</h2>
        </div>

        <div className="topbar-actions">
          <label className="search-field">
            <span className="search-label">Buscar</span>
            <input type="search" placeholder="Produto, categoria ou pedido" readOnly />
          </label>
          <button type="button" className="button button-secondary">
            Exportar
          </button>
          <button type="button" className="button button-primary">
            Novo produto
          </button>
        </div>
      </header>

      <section className="hero-strip">
        <div>
          <p className="section-label">Base operacional</p>
          <h3>Controle de produtos e movimentações</h3>
          <p>Use o menu lateral para acessar os módulos. Abaixo, as movimentações mais recentes.</p>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-label">Movimentacoes recentes</p>
              <h3>Últimas operações registradas</h3>
            </div>
          </div>
          {error && <div className="alert error">{error}</div>}
          {loading && <div className="skeleton" style={{ height: 140 }} />}
          {!loading && (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Responsável</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => {
                    const d = m.date ? new Date(m.date) : null;
                    const dateStr = d && !isNaN(d.getTime()) ? d.toLocaleString('pt-BR') : '—';
                    return (
                    <tr key={m.id}>
                      <td>{m.productName ?? (m.productId ? `#${m.productId}` : '—')}</td>
                      <td>
                        <span className={`status-pill ${m.type === 'ENTRY' ? 'status-entry' : 'status-exit'}`}>
                          {m.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td>{m.quantity}</td>
                      <td>{m.actor ?? '—'}</td>
                      <td>{dateStr}</td>
                    </tr>
                  )})}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="table-empty">Nenhuma movimentação encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default function App() {
  const location = useLocation();
  const isActive = (path: string) => (location.pathname === path ? 'nav-item nav-item-active' : 'nav-item');
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SF</div>
          <div>
            <p className="brand-eyebrow">StockFlow PAC</p>
            <h1>Gestao de estoque</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Navegacao principal">
          <NavLink to="/" className={() => isActive('/')}>Painel inicial</NavLink>
          <NavLink to="/products" className={() => isActive('/products')}>Produtos</NavLink>
          <NavLink to="/categories" className={() => isActive('/categories')}>Categorias</NavLink>
          <NavLink to="/movements" className={() => isActive('/movements')}>Movimentacoes</NavLink>
          <NavLink to="/finance" className={() => isActive('/finance')}>Financeiro</NavLink>
          {/* Removido temporariamente: Reports */}
        </nav>

        <section className="sidebar-card">
          <p className="section-label">Status do projeto</p>
          <h2>Versao inicial</h2>
          <p>
            Estrutura visual pronta para o primeiro ciclo. Backend e integracoes ficam para a proxima
            etapa.
          </p>
        </section>
      </aside>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        {/* Novas rotas */}
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="/finance" element={<FinancePage />} />
        {/* Rota de Reports removida temporariamente */}
      </Routes>
    </div>
  );
}

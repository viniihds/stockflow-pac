const kpis = [
  { label: 'Produtos cadastrados', value: '248', detail: '+18 neste mes', tone: 'emerald' },
  { label: 'Itens em estoque', value: '12.480', detail: 'Saldo consolidado', tone: 'sky' },
  { label: 'Alertas criticos', value: '7', detail: 'Reposicao urgente', tone: 'amber' },
  { label: 'Margem media', value: '34%', detail: 'Ultimo fechamento', tone: 'rose' },
] as const;

const movements = [
  { product: 'Papel sulfite A4', type: 'Entrada', qty: '+320', actor: 'Almoxarifado', date: '16/08/2026' },
  { product: 'Toner preto', type: 'Saida', qty: '-12', actor: 'Financeiro', date: '16/08/2026' },
  { product: 'Pasta arquivo', type: 'Entrada', qty: '+90', actor: 'Compras', date: '15/08/2026' },
  { product: 'Etiqueta adesiva', type: 'Saida', qty: '-44', actor: 'Operacao', date: '15/08/2026' },
] as const;

const alerts = [
  {
    title: 'Estoque minimo atingido',
    level: 'Alta prioridade',
    levelClass: 'high',
    text: 'Toner preto, etiqueta adesiva e caneta marcador precisam de reposicao imediata.',
  },
  {
    title: 'Entrega aguardada',
    level: 'Prioridade media',
    levelClass: 'medium',
    text: 'Pedido de insumos administrativos segue pendente de confirmacao com o fornecedor.',
  },
  {
    title: 'Conferencia semanal',
    level: 'Rotina',
    levelClass: 'low',
    text: 'A reconciliacao fisica do estoque deve ser feita antes do fechamento mensal.',
  },
] as const;

const shortcuts = [
  { title: 'Produtos', text: 'Cadastro e consulta de itens.' },
  { title: 'Categorias', text: 'Organizacao por grupos e filtros.' },
  { title: 'Movimentacoes', text: 'Entrada, saida e historico.' },
  { title: 'Relatorios', text: 'Visao operacional e financeira.' },
] as const;

import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import CategoriesPage from './categories/CategoriesPage';
import ProductsPage from './products/ProductsPage';

function Dashboard() {
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
          <p className="section-label">Base documental</p>
          <h3>Controle de produtos, entradas, saidas, prazos e financeiro em uma unica visao.</h3>
          <p>
            A primeira entrega prioriza leitura rapida do estado da operacao e deixa a navegacao
            preparada para o cadastro, o acompanhamento de movimentacoes e os relatorios.
          </p>
        </div>

        <div className="hero-meta">
          <div>
            <span className="meta-value">24</span>
            <span className="meta-label">produtos com alerta</span>
          </div>
          <div>
            <span className="meta-value">5</span>
            <span className="meta-label">entregas aguardadas</span>
          </div>
          <div>
            <span className="meta-value">R$ 128 mil</span>
            <span className="meta-label">estoque valorizado</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Indicadores principais">
        {kpis.map((item) => (
          <article key={item.label} className={`kpi-card kpi-${item.tone}`}>
            <p className="section-label">{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="section-label">Movimentacoes recentes</p>
              <h3>Ultimas operacoes registradas</h3>
            </div>
            <span className="panel-note">Mock visual da primeira versao</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Responsavel</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={`${movement.product}-${movement.date}-${movement.type}`}>
                    <td>{movement.product}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          movement.type === 'Entrada' ? 'status-entry' : 'status-exit'
                        }`}
                      >
                        {movement.type}
                      </span>
                    </td>
                    <td>{movement.qty}</td>
                    <td>{movement.actor}</td>
                    <td>{movement.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <section className="panel panel-rail">
          <div>
            <p className="section-label">Alertas de prioridade</p>
            <h3>Pontos que exigem atencao</h3>
          </div>

          <ul className="alert-list">
            {alerts.map((alert) => (
              <li key={alert.title} className="alert-item">
                <span className={`alert-level alert-level-${alert.levelClass}`}>{alert.level}</span>
                <strong>{alert.title}</strong>
                <p>{alert.text}</p>
              </li>
            ))}
          </ul>

          <div>
            <p className="section-label">Atalhos</p>
            <div className="shortcut-grid">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.title} className="shortcut">
                  <strong>{shortcut.title}</strong>
                  <span>{shortcut.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
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
          <button className="nav-item" type="button">Movimentacoes</button>
          <button className="nav-item" type="button">Financeiro</button>
          <button className="nav-item" type="button">Relatorios</button>
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
      </Routes>
    </div>
  );
}

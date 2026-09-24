import { useEffect, useMemo, useState } from 'react';
import { api, Product } from '../api';
import ProductFormModal from './ProductFormModal';

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useMemo(
    () =>
      async (q = query) => {
        try {
          setLoading(true);
          setError(null);
          const data = await api.listProductsSimple({ q });
          setItems(data);
        } catch (err: any) {
          setError(err?.message || 'Erro ao carregar produtos');
        } finally {
          setLoading(false);
        }
      },
    [query],
  );

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Confirma excluir este produto?')) return;
    await api.deleteProduct(id);
    await load();
  }

  async function handleSaved() {
    await load();
  }

  const total = items.length;

  function renderStatus(p: Product) {
    const isActive = p.active ?? true;
    const qty = p.quantity ?? 0;
    const min = p.minimumStock ?? 0;
    let label = 'Em estoque';
    let cls = 'status-entry';
    if (!isActive) {
      label = 'Inativo';
      cls = 'status-exit';
    } else if (qty <= 0) {
      label = 'Sem estoque';
      cls = 'status-exit';
    } else if (qty <= min) {
      label = 'Estoque baixo';
      cls = 'status-exit';
    }
    return <span className={`status-pill ${cls}`}>{label}</span>;
  }

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cadastro</p>
          <h2>Gerenciamento de Produtos</h2>
        </div>

        <div className="topbar-actions">
          <label className="search-field">
            <span className="search-label">Buscar</span>
            <input
              type="search"
              placeholder="Buscar produto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
            />
          </label>

          <button type="button" className="button button-primary" onClick={openCreate}>
            + Novo Produto
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h3>Lista de Produtos</h3>
          <span className="muted">Total: {total}</span>
        </div>

        {error && <div className="alert error">{error}</div>}
        {loading && <div className="skeleton" style={{ height: 160 }} />}

        {!loading && (
          <div className="table">
            <div className="table-row table-head">
              <div>Produto</div>
              <div>Categoria</div>
              <div>Preço</div>
              <div>Quantidade</div>
              <div>Status</div>
              <div>Ações</div>
            </div>
            {Array.isArray(items) &&
              items.map((p) => (
                <div key={p.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 0.9fr 0.8fr' }}>
                  <div className="cell-name">
                    <div>
                      <div className="name">{p.name}</div>
                      {p.code && <div className="muted small">{p.code}</div>}
                    </div>
                  </div>
                  <div>{p.categoryName ?? '—'}</div>
                  <div>{p.price != null ? `R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</div>
                  <div>{p.quantity ?? 0}</div>
                  <div>{renderStatus(p)}</div>
                  <div className="row-actions">
                    <button className="link" onClick={() => openEdit(p)}>
                      Editar
                    </button>
                    <button className="link danger" onClick={() => handleDelete(p.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            {Array.isArray(items) && items.length === 0 && (
              <div className="table-empty">Nenhum produto encontrado.</div>
            )}
          </div>
        )}
      </section>

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleSaved} product={editing} />
    </div>
  );
}

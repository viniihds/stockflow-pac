import { useEffect, useMemo, useState } from 'react';
import { api, Category } from '../api';
import CategoryFormModal from './CategoryFormModal';

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const load = useMemo(
    () =>
      async (q = query) => {
        try {
          setLoading(true);
          setError(null);
          const data = await api.listCategoriesSimple({ q });
          setItems(data);
        } catch (err: any) {
          setError(err?.message || 'Erro ao carregar categorias');
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
  function openEdit(cat: Category) {
    setEditing(cat);
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (!confirm('Confirma excluir esta categoria?')) return;
    await api.deleteCategory(id);
    await load();
  }

  async function handleSaved() {
    await load();
  }
  const total = items.length;

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cadastro</p>
          <h2>Gerenciamento de Categorias</h2>
        </div>

        <div className="topbar-actions">
          <label className="search-field">
            <span className="search-label">Buscar</span>
            <input
              type="search"
              placeholder="Buscar categoria..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && load()}
            />
          </label>

          <button type="button" className="button button-primary" onClick={openCreate}>
            + Nova Categoria
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h3>Lista de Categorias</h3>
          <span className="muted">Total: {total}</span>
        </div>

        {error && <div className="alert error">{error}</div>}
        {loading && <div className="skeleton" style={{ height: 120 }} />}

        {!loading && (
          <div className="table">
            <div className="table-row table-head">
              <div>Nome</div>
              <div>Produtos</div>
              <div>Última Atualização</div>
              <div>Ações</div>
            </div>
            {Array.isArray(items) && items.map((c) => (
              <div key={c.id} className="table-row">
                <div className="cell-name">
                  <span className="color-bullet" style={{ backgroundColor: c.color || '#94a3b8' }} />
                  <div>
                    <div className="name">{c.name}</div>
                    {c.description && <div className="muted small">{c.description}</div>}
                  </div>
                </div>
                <div>—</div>
                <div>—</div>
                <div className="row-actions">
                  <button className="link" onClick={() => openEdit(c)}>
                    Editar
                  </button>
                  <button className="link danger" onClick={() => handleDelete(c.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {Array.isArray(items) && items.length === 0 && (
              <div className="table-empty">Nenhuma categoria encontrada.</div>
            )}
          </div>
        )}
      </section>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        category={editing}
      />
    </div>
  );
}

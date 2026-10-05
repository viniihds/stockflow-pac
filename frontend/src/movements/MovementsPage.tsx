import { useEffect, useMemo, useState } from 'react';
import { api, StockMovement, StockMovementCreate, Product } from '../api';

function NewMovementChooser({ open, onClose, onChoose }: { open: boolean; onClose: () => void; onChoose: (type: 'ENTRY' | 'EXIT') => void }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>Nova Movimentação</h3>
        </header>
        <div className="modal-body" style={{ display: 'grid', gap: 12 }}>
          <button className="button" onClick={() => onChoose('ENTRY')}>Entrada de Estoque</button>
          <button className="button" onClick={() => onChoose('EXIT')}>Saída de Estoque</button>
          <footer className="modal-actions">
            <button className="button button-secondary" onClick={onClose}>Fechar</button>
          </footer>
        </div>
      </div>
    </div>
  );
}

function MovementFormModal({ open, type, onClose, onSaved }: { open: boolean; type: 'ENTRY' | 'EXIT' | null; onClose: () => void; onSaved: (m: StockMovement) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productId, setProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState('');
  const [actor, setActor] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // resetar campos quando abrir/trocar tipo
    setProductId('');
    setQuantity('');
    setActor('');
    setNote('');
    setError(null);
  }, [open, type]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingProducts(true);
        const list = await api.listProductsSimple();
        setProducts(list);
      } catch (e) {
        // mantém lista vazia em caso de erro
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, [open]);

  if (!open || !type) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId || !quantity) {
      setError('Produto e quantidade são obrigatórios.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      // O backend espera os campos: productId, movementType, quantity, destination (responsável), reason (observação)
      const payload = {
        productId: Number(productId),
        movementType: type,
        quantity: Number(quantity),
        destination: actor.trim() || undefined,
        reason: note.trim() || undefined,
      } as any as StockMovementCreate;
      const saved = await api.createMovement(payload);
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao registrar movimentação');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>{type === 'ENTRY' ? 'Entrada de Estoque' : 'Saída de Estoque'}</h3>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Produto</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
              required
              disabled={loadingProducts}
            >
              <option value="">Selecione...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="form-field">
              <span>Quantidade</span>
              <input type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>
            <label className="form-field">
              <span>Responsável</span>
              <input value={actor} onChange={(e) => setActor(e.target.value)} />
            </label>
          </div>

          <label className="form-field">
            <span>Observação</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </label>

          {error && <p className="form-error">{error}</p>}

          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Salvando...' : (type === 'ENTRY' ? 'Lançar entrada' : 'Lançar saída')}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function MovementsPage() {
  const [items, setItems] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [modalType, setModalType] = useState<'ENTRY' | 'EXIT' | null>(null);

  const load = useMemo(
    () => async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.listMovementsSimple();
        setItems(data);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar movimentações');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setChooserOpen(true);
  }
  function handleChoose(type: 'ENTRY' | 'EXIT') {
    setChooserOpen(false);
    setModalType(type);
  }

  const total = items.length;

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Estoque</p>
          <h2>Movimentações de Estoque</h2>
        </div>
        <div className="topbar-actions">
          <button className="button button-primary" onClick={openNew}>+ Nova Movimentação</button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h3>Histórico</h3>
          <span className="muted">Total: {total}</span>
        </div>
        {error && <div className="alert error">{error}</div>}
        {loading && <div className="skeleton" style={{ height: 160 }} />}
        {!loading && (
          <div className="table">
            <div className="table-row table-head" style={{ gridTemplateColumns: '1.4fr 0.9fr 0.7fr 1fr 1fr' }}>
              <div>Produto</div>
              <div>Tipo</div>
              <div>Qtd</div>
              <div>Responsável</div>
              <div>Data</div>
            </div>
            {items.map((m) => {
              const d = m.date ? new Date(m.date) : null;
              const dateStr = d && !isNaN(d.getTime()) ? d.toLocaleString('pt-BR') : '—';
              return (
              <div key={m.id} className="table-row" style={{ gridTemplateColumns: '1.4fr 0.9fr 0.7fr 1fr 1fr' }}>
                <div>{m.productName ?? (m.productId ? `#${m.productId}` : '—')}</div>
                <div>
                  <span className={`status-pill ${m.type === 'ENTRY' ? 'status-entry' : 'status-exit'}`}>
                    {m.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                  </span>
                </div>
                <div>{m.quantity}</div>
                <div>{m.actor ?? '—'}</div>
                <div>{dateStr}</div>
              </div>
            )})}
            {items.length === 0 && <div className="table-empty">Nenhuma movimentação encontrada.</div>}
          </div>
        )}
      </section>

      <NewMovementChooser open={chooserOpen} onClose={() => setChooserOpen(false)} onChoose={handleChoose} />
      <MovementFormModal
        open={modalType != null}
        type={modalType}
        onClose={() => setModalType(null)}
        onSaved={() => load()}
      />
    </div>
  );
}

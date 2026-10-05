import { useEffect, useMemo, useState } from 'react';
import { api, GenericReport, CreateGenericReport } from '../api';

function NewReportModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: (r: GenericReport) => void }) {
  const [title, setTitle] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [filters, setFilters] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setTitle('');
      setPeriodStart('');
      setPeriodEnd('');
      setFilters('');
      setError(null);
    }
  }, [open]);
  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const body: CreateGenericReport = {
        title: title || undefined,
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
        filters: filters || undefined,
      };
      const saved = await api.createReport(body);
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar relatório');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>Novo Relatório</h3>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <div className="form-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="form-field">
              <span>Período inicial</span>
              <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Período final</span>
              <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </label>
          </div>
          <label className="form-field">
            <span>Filtros</span>
            <input value={filters} onChange={(e) => setFilters(e.target.value)} placeholder="categoria: TI, status: ativo" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Salvando...' : 'Gerar'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [items, setItems] = useState<GenericReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useMemo(
    () => async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await api.listReports();
        setItems(list);
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar relatórios');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const total = items.length;

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Relatórios</p>
          <h2>Relatórios Operacionais</h2>
        </div>
        <div className="topbar-actions">
          <button className="button button-primary" onClick={() => setModalOpen(true)}>+ Novo Relatório</button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h3>Histórico de Relatórios</h3>
          <span className="muted">Total: {total}</span>
        </div>
        {error && <div className="alert error">{error}</div>}
        {loading && <div className="skeleton" style={{ height: 160 }} />}
        {!loading && (
          <div className="table">
            <div className="table-row table-head" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1fr' }}>
              <div>Título</div>
              <div>Período inicial</div>
              <div>Período final</div>
              <div>Criado em</div>
            </div>
            {items.map((r) => (
              <div key={r.id} className="table-row" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1fr' }}>
                <div>{r.title}</div>
                <div>{r.periodStart ? new Date(r.periodStart).toLocaleDateString('pt-BR') : '—'}</div>
                <div>{r.periodEnd ? new Date(r.periodEnd).toLocaleDateString('pt-BR') : '—'}</div>
                <div>{new Date(r.createdAt).toLocaleString('pt-BR')}</div>
              </div>
            ))}
            {items.length === 0 && <div className="table-empty">Nenhum relatório encontrado.</div>}
          </div>
        )}
      </section>

      <NewReportModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={() => load()} />
    </div>
  );
}

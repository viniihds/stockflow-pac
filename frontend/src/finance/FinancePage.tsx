import { useState } from 'react';
import { api, FinanceReport, FinanceReportRequest } from '../api';

function FinanceReportModal({ open, onClose, onGenerated }: { open: boolean; onClose: () => void; onGenerated: (r: FinanceReport) => void }) {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const body: FinanceReportRequest = {
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
        costCenter: costCenter || undefined,
        notes: notes || undefined,
      };
      const rep = await api.generateFinanceReport(body);
      onGenerated(rep);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao gerar relatório');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>Gerar Relatório Financeiro</h3>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
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
            <span>Centro de custo</span>
            <input value={costCenter} onChange={(e) => setCostCenter(e.target.value)} />
          </label>
          <label className="form-field">
            <span>Observações</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Gerando...' : 'Gerar PDF'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lastReport, setLastReport] = useState<FinanceReport | null>(null);

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Financeiro</p>
          <h2>Gestão Financeira</h2>
        </div>
        <div className="topbar-actions">
          <button className="button button-primary" onClick={() => setModalOpen(true)}>+ Gerar Relatório</button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h3>Resumo Financeiro</h3>
          {lastReport && <span className="muted">Último relatório: {new Date(lastReport.createdAt).toLocaleString('pt-BR')}</span>}
        </div>
        {!lastReport && (
          <div className="panel-empty" style={{ padding: 24 }}>
            <p className="muted">Nenhum relatório gerado ainda.</p>
            <p className="muted small">Clique em "+ Gerar Relatório" para criar o primeiro resumo financeiro.</p>
          </div>
        )}
        {lastReport && (
          <div className="table" style={{ marginTop: 8 }}>
            <div className="table-row table-head" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div>Período</div>
              <div>Totais</div>
              <div>Gerado em</div>
            </div>
            <div className="table-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div>
                <div>Início: {lastReport.periodStart ? new Date(lastReport.periodStart).toLocaleDateString('pt-BR') : '—'}</div>
                <div>Fim: {lastReport.periodEnd ? new Date(lastReport.periodEnd).toLocaleDateString('pt-BR') : '—'}</div>
              </div>
              <div>
                <div>Receitas: R$ {lastReport.totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div>Despesas: R$ {lastReport.totals.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div><strong>Saldo: R$ {lastReport.totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
              </div>
              <div>{new Date(lastReport.createdAt).toLocaleString('pt-BR')}</div>
            </div>
          </div>
        )}
      </section>

      <FinanceReportModal open={modalOpen} onClose={() => setModalOpen(false)} onGenerated={(r) => setLastReport(r)} />
    </div>
  );
}

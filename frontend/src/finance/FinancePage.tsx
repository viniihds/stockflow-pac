import { useEffect, useMemo, useState } from 'react';
import { api, Product, StockMovement } from '../api';

type Summary = {
  totalEntrada: number;
  totalSaida: number;
  saldo: number; // entrada - saida
};

export default function FinancePage() {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [movs, setMovs] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useMemo(
    () => async () => {
      try {
        setLoading(true);
        setError(null);
        const [m, p] = await Promise.all([api.listMovementsSimple(), api.listProductsSimple()]);
        setMovs(m);
        setProducts(p);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  function withinRange(dateIso?: string | null) {
    if (!dateIso) return false;
    const t = new Date(dateIso).getTime();
    if (Number.isNaN(t)) return false;
    const gte = from ? new Date(from).getTime() : undefined;
    const lte = to ? new Date(to).getTime() : undefined;
    if (gte != null && t < gte) return false;
    if (lte != null) {
      // incluir o dia final inteiro
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      if (t > end.getTime()) return false;
    }
    return true;
  }

  const summary: Summary = useMemo(() => {
    const byId = new Map<number, Product>();
    for (const p of products) byId.set(p.id, p);
    let entrada = 0;
    let saida = 0;
    for (const m of movs) {
      if (!withinRange(m.date)) continue;
      const price = byId.get(m.productId || -1)?.price || 0;
      const total = price * (m.quantity ?? 0);
      if (m.type === 'ENTRY') entrada += total;
      else saida += total;
    }
    return { totalEntrada: entrada, totalSaida: saida, saldo: entrada - saida };
  }, [movs, products, from, to]);

  const lucro = summary.saldo > 0 ? summary.saldo : 0;
  const prejuizo = summary.saldo < 0 ? Math.abs(summary.saldo) : 0;

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Financeiro</p>
          <h2>Gestão Financeira</h2>
        </div>
        <div className="topbar-actions" style={{ alignItems: 'end' }}>
          <div className="form-field" style={{ minWidth: 0, margin: 0 }}>
            <span>Período</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 120 }} />}

      {!loading && (
        <section className="kpi-grid">
          <div className="kpi-card kpi-emerald">
            <strong>R$ {summary.totalEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            <span>Entrada total</span>
          </div>
          <div className="kpi-card kpi-rose">
            <strong>R$ {summary.totalSaida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            <span>Saída total</span>
          </div>
          <div className="kpi-card kpi-sky">
            <strong>R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            <span>Lucro no período</span>
          </div>
          <div className="kpi-card kpi-amber">
            <strong>R$ {prejuizo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            <span>Prejuízo no período</span>
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-head">
          <h3>Transações consideradas</h3>
          <span className="muted">{movs.filter((m) => withinRange(m.date)).length} movimentações</span>
        </div>
        <div className="table">
          <div className="table-row table-head" style={{ gridTemplateColumns: '1.4fr 0.9fr 0.7fr 1fr 1fr' }}>
            <div>Produto</div>
            <div>Tipo</div>
            <div>Qtd</div>
            <div>Responsável</div>
            <div>Data</div>
          </div>
          {movs.filter((m) => withinRange(m.date)).map((m) => {
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
            );
          })}
          {movs.filter((m) => withinRange(m.date)).length === 0 && (
            <div className="table-empty">Nenhuma movimentação no período.</div>
          )}
        </div>
      </section>
    </div>
  );
}

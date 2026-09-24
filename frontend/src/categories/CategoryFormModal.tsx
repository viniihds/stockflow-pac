import { useEffect, useMemo, useState } from 'react';
import { api, Category, CategoryCreate, CategoryUpdate } from '../api';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (c: Category) => void;
  category?: Category | null;
};

const COLORS = ['#4f46e5', '#06b6d4', '#22c55e', '#eab308', '#ef4444', '#a855f7'];

export function CategoryFormModal({ open, onClose, onSaved, category }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string | undefined>(COLORS[0]);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name ?? '');
      setDescription(category.description ?? '');
      setColor(category.color ?? COLORS[0]);
      setActive(category.active ?? true);
    } else {
      setName('');
      setDescription('');
      setColor(COLORS[0]);
      setActive(true);
    }
    setError(null);
  }, [category, open]);

  const isEdit = useMemo(() => Boolean(category?.id), [category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      let saved: Category;
      if (isEdit && category) {
        const body: CategoryUpdate = { name: name.trim(), description: description.trim() || undefined, color, active };
        saved = await api.updateCategory(category.id, body);
      } else {
        const body: CategoryCreate = { name: name.trim(), description: description.trim() || undefined, color, active };
        saved = await api.createCategory(body);
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        </header>
        <form onSubmit={handleSubmit} className="modal-body">
          <label className="form-field">
            <span>Nome da Categoria</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
          </label>

          <label className="form-field">
            <span>Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={4} />
          </label>

          <div className="form-field">
            <span>Cor da Categoria</span>
            <div className="color-palette">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Selecionar cor ${c}`}
                />
              ))}
            </div>
          </div>

          <label className="checkbox">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Ativa
          </label>

          {error && <p className="form-error">{error}</p>}

          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CategoryFormModal;

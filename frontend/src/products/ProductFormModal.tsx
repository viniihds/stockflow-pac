import { useEffect, useMemo, useState } from 'react';
import { api, Category, Product, ProductCreate, ProductUpdate } from '../api';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (p: Product) => void;
  product?: Product | null;
};

export default function ProductFormModal({ open, onClose, onSaved, product }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [minimumStock, setMinimumStock] = useState<string>('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = useMemo(() => Boolean(product?.id), [product]);

  useEffect(() => {
    async function loadCats() {
      try {
        setLoadingCats(true);
        const list = await api.listCategoriesSimple();
        setCategories(list);
      } catch (e) {
        // mantém categorias vazias se erro
      } finally {
        setLoadingCats(false);
      }
    }
    loadCats();
  }, [open]);

  useEffect(() => {
    if (product) {
      setName(product.name ?? '');
      setCode(product.code ?? '');
      setPrice(product.price != null ? String(product.price) : '');
      setQuantity(product.quantity != null ? String(product.quantity) : '');
      setMinimumStock(product.minimumStock != null ? String(product.minimumStock) : '');
      setDescription(product.description ?? '');
      setActive(product.active ?? true);
      setCategoryId(product.categoryId ?? undefined);
    } else {
      setName('');
      setCode('');
      setPrice('');
      setQuantity('');
      setMinimumStock('');
      setDescription('');
      setActive(true);
      setCategoryId(undefined);
    }
    setError(null);
  }, [product, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    const bodyBase: ProductCreate = {
      name: name.trim(),
      code: code.trim() || undefined,
      price: price ? Number(price) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      minimumStock: minimumStock ? Number(minimumStock) : undefined,
      description: description.trim() || undefined,
      active,
      categoryId,
    };
    try {
      setSaving(true);
      setError(null);
      let saved: Product;
      if (isEdit && product) {
        const patch: ProductUpdate = bodyBase;
        saved = await api.updateProduct(product.id, patch);
      } else {
        saved = await api.createProduct(bodyBase);
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>{isEdit ? 'Editar Produto' : 'Novo Produto'}</h3>
        </header>
        <form onSubmit={handleSubmit} className="modal-body">
          <label className="form-field">
            <span>Nome do Produto</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={150} required />
          </label>

          <div className="form-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="form-field">
              <span>Categoria</span>
              <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)} disabled={loadingCats}>
                <option value="">Selecione...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Código</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={60} />
            </label>
          </div>

          <div className="form-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="form-field">
              <span>Preço</span>
              <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label className="form-field">
              <span>Quantidade</span>
              <input type="number" step="1" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </label>
          </div>

          <div className="form-field" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <label className="form-field">
              <span>Estoque mínimo</span>
              <input
                type="number"
                step="1"
                min="0"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="form-field">
            <span>Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>

          <label className="checkbox">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Ativo
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

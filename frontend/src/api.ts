export type Category = {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  active?: boolean | null;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number; // page size
};

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init && 'body' in init && (init as RequestInit).body != null;
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro na API (${res.status}): ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as unknown as T;

  // Parse JSON de forma segura: quando o corpo vier vazio ou não for JSON, evite quebra.
  const contentType = res.headers.get('Content-Type')?.toLowerCase() ?? '';
  const text = await res.text();
  if (!text) return undefined as unknown as T;
  if (contentType.includes('application/json')) {
    return JSON.parse(text) as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export type CategoryCreate = {
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
};

export type CategoryUpdate = Partial<CategoryCreate>;

export const api = {
  // Sem paginação: retorna lista simples de categorias. Para compatibilidade, há também o
  // utilitário toPage abaixo caso a tela precise de formato de página.
  listCategoriesSimple(params: { q?: string } = {}): Promise<Category[]> {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    const suffix = q.toString();
    return http<any>(`/categories${suffix ? `?${suffix}` : ''}`).then((data) => {
      if (Array.isArray(data)) return data as Category[];
      if (data && Array.isArray((data as any).content)) return (data as any).content as Category[];
      return [] as Category[];
    });
  },

  // Mantém a antiga assinatura opcionalmente, convertendo array -> Page para não quebrar quem usa Page.
  listCategories(params: { q?: string; page?: number; size?: number } = {}): Promise<Page<Category>> {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    const suffix = q.toString();
    return http<any>(`/categories${suffix ? `?${suffix}` : ''}`).then((data) => {
      if (Array.isArray(data)) {
        return {
          content: data as Category[],
          totalElements: data.length,
          totalPages: 1,
          number: 0,
          size: data.length,
        } as Page<Category>;
      }
      return data as Page<Category>;
    });
  },
  getCategory(id: number) {
    return http<Category>(`/categories/${id}`);
  },
  createCategory(body: CategoryCreate) {
    return http<Category>(`/categories`, { method: 'POST', body: JSON.stringify(body) });
  },
  updateCategory(id: number, body: CategoryUpdate) {
    return http<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  deleteCategory(id: number) {
    return http<void>(`/categories/${id}`, { method: 'DELETE' });
  },
};

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  active?: boolean | null;
};

// Produtos
export type Product = {
  id: number;
  name: string;
  code?: string | null;
  price?: number | null;
  // normalize do backend: backend usa stockQuantity; frontend usa quantity
  quantity?: number | null;
  minimumStock?: number | null;
  description?: string | null;
  active?: boolean | null;
  categoryId?: number | null;
  categoryName?: string | null; // caso o backend já traga resolvido
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

  // Produtos
  listProductsSimple(params: { q?: string } = {}): Promise<Product[]> {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    const suffix = q.toString();
    return http<any>(`/products${suffix ? `?${suffix}` : ''}`).then((data) => {
      const normalize = (p: any): Product => ({
        id: p.id,
        name: p.name,
        code: p.code,
        price: p.price,
        quantity: p.quantity ?? p.stockQuantity ?? null,
        minimumStock: p.minimumStock ?? null,
        description: p.description,
        active: p.active,
        categoryId: p.categoryId,
        categoryName: p.categoryName,
      });
      if (Array.isArray(data)) return data.map(normalize) as Product[];
      if (data && Array.isArray((data as any).content)) return (data as any).content.map(normalize) as Product[];
      return [] as Product[];
    });
  },
  getProduct(id: number) {
    return http<any>(`/products/${id}`).then((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      price: p.price,
      quantity: p.quantity ?? p.stockQuantity ?? null,
      minimumStock: p.minimumStock ?? null,
      description: p.description,
      active: p.active,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
    }) as Product);
  },
  createProduct(body: ProductCreate) {
    const payload: any = {
      name: body.name,
      code: body.code,
      price: body.price,
      stockQuantity: body.quantity, // mapeia para o nome esperado pelo backend
      minimumStock: body.minimumStock,
      description: body.description,
      active: body.active,
      categoryId: body.categoryId,
    };
    return http<Product>(`/products`, { method: 'POST', body: JSON.stringify(payload) });
  },
  updateProduct(id: number, body: ProductUpdate) {
    const payload: any = {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.code !== undefined ? { code: body.code } : {}),
      ...(body.price !== undefined ? { price: body.price } : {}),
      ...(body.quantity !== undefined ? { stockQuantity: body.quantity } : {}),
      ...(body.minimumStock !== undefined ? { minimumStock: body.minimumStock } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
      ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
    };
    return http<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  deleteProduct(id: number) {
    return http<void>(`/products/${id}`, { method: 'DELETE' });
  },
};

export type ProductCreate = {
  name: string;
  code?: string;
  price?: number;
  quantity?: number; // será enviado como stockQuantity para o backend
  minimumStock?: number;
  description?: string;
  active?: boolean;
  categoryId?: number;
};

export type ProductUpdate = Partial<ProductCreate>;

import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Le o token ja na inicializacao (e nao em um useEffect): senão o primeiro render
  // acontece sem token, o RequireAuth redireciona para /login e o usuario logado
  // "perde" a pagina ao dar F5.
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sf_token');
    } catch {
      return null;
    }
  });

  const setToken = (t: string | null) => {
    setTokenState(t);
    try {
      if (t) localStorage.setItem('sf_token', t);
      else localStorage.removeItem('sf_token');
    } catch {}
  };

  const logout = () => setToken(null);

  const value = useMemo<AuthState>(() => ({ token, setToken, logout, isAuthenticated: !!token }), [token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

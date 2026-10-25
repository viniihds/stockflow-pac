import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem('sf_token');
      if (t) setTokenState(t);
    } catch {}
  }, []);

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

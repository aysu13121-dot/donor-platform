'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

function displayName(user) {
  return user?.full_name || user?.email || 'Donor';
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // localStorage yalnız browser-də mövcuddur; server-side render zamanı
  // token bilinmir, ona görə "ready" olana qədər auth vəziyyəti qəti deyil.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    if (storedToken) {
      setToken(storedToken);
      setUser(storedName ? { full_name: storedName } : null);
    }
    setReady(true);
  }, []);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', displayName(newUser));
    setToken(newToken);
    setUser(newUser || null);
  }, []);

  const updateUser = useCallback((newUser) => {
    localStorage.setItem('userName', displayName(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, ready, isAuthenticated: Boolean(token), login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() yalnız <AuthProvider> daxilində istifadə oluna bilər.');
  return ctx;
}

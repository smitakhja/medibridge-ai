import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('medibridge_token'),
    isLoading: true,
    isAuthenticated: false,
  });

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('medibridge_token');
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }
    try {
      const { data } = await authApi.getMe();
      setState({ user: data.user, token, isLoading: false, isAuthenticated: true });
    } catch {
      localStorage.removeItem('medibridge_token');
      localStorage.removeItem('medibridge_user');
      setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('medibridge_token', data.token);
    localStorage.setItem('medibridge_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, isLoading: false, isAuthenticated: true });
  };

  const register = async (formData: Record<string, unknown>) => {
    const { data } = await authApi.register(formData);
    localStorage.setItem('medibridge_token', data.token);
    localStorage.setItem('medibridge_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, isLoading: false, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('medibridge_token');
    localStorage.removeItem('medibridge_user');
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

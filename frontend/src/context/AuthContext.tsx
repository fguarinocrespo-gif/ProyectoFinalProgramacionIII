import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Usuario } from '../types';
import { authService } from '../api/services';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInspector: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsuario = localStorage.getItem('usuario');
    if (storedToken && storedUsuario) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUsuario));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { token: newToken, usuario: newUsuario } = response.data;
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUsuario));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }, []);

  const value: AuthContextType = {
    usuario,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: usuario?.rol === 'administrativo',
    isInspector: usuario?.rol === 'inspector',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

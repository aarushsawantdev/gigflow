import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('gigflow_token');
    const userStr = localStorage.getItem('gigflow_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setAuth({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('gigflow_token');
        localStorage.removeItem('gigflow_user');
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('gigflow_token', token);
    localStorage.setItem('gigflow_user', JSON.stringify(user));
    setAuth({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    setAuth({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

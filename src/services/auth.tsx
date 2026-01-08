
import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types.ts';

const AuthContext = createContext<any>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, role: UserRole) => {
    const newUser = { id: 'u1', email, role, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('volt_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('volt_user');
  };

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

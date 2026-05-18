import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = useCallback((email, userRole = 'customer') => {
    setUser({ ...currentUser, email, role: userRole });
    setRole(userRole);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
  }, []);

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    isCustomer: role === 'customer',
    isSeller: role === 'seller',
    isAdmin: role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


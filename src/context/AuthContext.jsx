import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from '../lib/auth-storage';

const AuthContext = createContext(null);

function pickPrimaryRole(roles = []) {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('seller')) return 'seller';
  return 'customer';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [role, setRole] = useState(() => getStoredUser()?.role ?? null);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((apiUser) => {
    const primaryRole = pickPrimaryRole(apiUser.roles);
    const mapped = {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.full_name || apiUser.email,
      full_name: apiUser.full_name,
      phone: apiUser.phone,
      avatar_url: apiUser.avatar_url,
      role: primaryRole,
      roles: apiUser.roles,
      is_verified: apiUser.is_verified,
    };
    setUser(mapped);
    setRole(primaryRole);
    setStoredUser(mapped);
    return mapped;
  }, []);

  const bootstrap = useCallback(async () => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      applyUser(me);
    } catch {
      clearAuth();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [applyUser]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const loginWithTokens = useCallback(
    async (tokens, fallbackUser = null) => {
      setTokens(tokens);
      if (fallbackUser) {
        applyUser(fallbackUser);
        return fallbackUser;
      }
      const me = await authApi.me();
      return applyUser(me);
    },
    [applyUser],
  );

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login({ email, password });
      setTokens(data.tokens);
      return applyUser(data.user);
    },
    [applyUser],
  );

  const register = useCallback(
    async ({ email, password, full_name }) => {
      const data = await authApi.register({
        email,
        password,
        full_name,
        role: 'customer',
      });
      setTokens(data.tokens);
      return applyUser(data.user);
    },
    [applyUser],
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      /* ignore */
    }
    clearAuth();
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAuthenticated: !!user,
      isCustomer: role === 'customer',
      isSeller: role === 'seller',
      isAdmin: role === 'admin',
      login,
      register,
      logout,
      loginWithTokens,
      applyUser,
      refreshUser: bootstrap,
    }),
    [user, role, loading, login, register, logout, loginWithTokens, applyUser, bootstrap],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

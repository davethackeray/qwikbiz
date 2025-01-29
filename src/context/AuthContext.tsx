'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../lib/services/auth';
import { useRouter } from 'next/navigation';

// Export User and Session types from auth service
export type { User, Session } from '../lib/services/auth';

interface AuthContextType {
  user: import('../lib/services/auth').User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize auth state after hydration
  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      try {
        const session = await AuthService.getSession();
        setUser(session?.user || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check auth state'));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [mounted]);

  // Handle navigation after login/logout
  useEffect(() => {
    if (!mounted) return;

    if (!loading) {
      if (user && window.location.pathname === '/login') {
        router.push('/dashboard');
      } else if (!user && window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [user, loading, mounted, router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const session = await AuthService.login(email, password);
      setUser(session.user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to login');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.logout();
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to logout');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const session = await AuthService.signup(email, password, name);
      setUser(session.user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to signup');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

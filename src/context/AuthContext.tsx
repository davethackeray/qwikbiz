import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../lib/services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  authService: AuthService;
}

export function AuthProvider({ children, authService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize auth service and attempt to restore session
    const initializeAuth = async () => {
      try {
        await authService.initialize();
        setUser(authService.getCurrentUser());
      } catch (err) {
        setError(err as Error);
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    initializeAuth();

    // Cleanup subscription
    return () => unsubscribe();
  }, [authService]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // Replace with proper loading component
    }
    
    if (!user) {
      // Redirect to login or show unauthorized message
      return <div>Please sign in to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
}

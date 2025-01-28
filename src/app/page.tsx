'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { LoginForm } from '@/components/molecules/forms/LoginForm';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to BizSim</h1>
          <p className="text-gray-400">
            Sign in to access your business simulation dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

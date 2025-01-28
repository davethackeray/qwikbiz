'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code || !state) {
          throw new Error('Invalid callback parameters');
        }

        await signInWithGoogle();
        router.replace('/dashboard'); // Redirect to dashboard after successful login
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/login?error=auth_failed');
      }
    }

    handleCallback();
  }, [searchParams, signInWithGoogle, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-semibold text-gray-900">
          Completing sign in...
        </h2>
        <p className="text-sm text-gray-500">
          Please wait while we authenticate your account
        </p>
      </div>
    </div>
  );
}

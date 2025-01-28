import React from 'react';
import { GoogleButton } from '../../atoms/GoogleButton';
import { useAuth } from '../../../context/AuthContext';

export function LoginForm() {
  const { signInWithGoogle, loading, error } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error handling is managed by AuthContext
      console.error('Failed to sign in with Google:', err);
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to BizSim
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access your business simulation dashboard
        </p>
      </div>

      <div className="space-y-4">
        <GoogleButton
          onClick={handleGoogleSignIn}
          loading={loading}
        />

        {error && (
          <div
            role="alert"
            className="p-4 text-sm text-red-700 bg-red-100 rounded-md"
          >
            {error.message}
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">
              Protected by BizSim
            </span>
          </div>
        </div>

        <div className="text-xs text-center text-gray-500">
          By signing in, you agree to our{' '}
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          {' '}and{' '}
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

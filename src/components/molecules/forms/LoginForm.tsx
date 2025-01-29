'use client';

import React, { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/atoms/Button';

export function LoginForm() {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isRedirecting) return;

    try {
      console.log('Attempting login...');
      setIsRedirecting(true);
      
      // Login to get session and set cookie
      await login(email, password);
      
      console.log('Login successful, waiting for cookie...');
      
      // Allow time for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Navigating to dashboard...');
      // Force full page navigation to ensure cookie is used
      window.location.assign('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setIsRedirecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Login failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading || isRedirecting}>
        {loading || isRedirecting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

export default LoginForm;

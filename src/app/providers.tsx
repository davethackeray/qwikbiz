'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration issues by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during SSR, then render children once mounted client-side
  if (!mounted) {
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
}

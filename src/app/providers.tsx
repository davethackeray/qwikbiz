'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { configureAuthAlerts } from '@/lib/services/auth-alerts';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  // Configure auth monitoring on client-side mount
  React.useEffect(() => {
    setMounted(true);
    configureAuthAlerts();
  }, []);

  // Return null during SSR, then render children once mounted client-side
  if (!mounted) {
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
}

'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during SSR to avoid hydration mismatches
  if (!mounted) {
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
}

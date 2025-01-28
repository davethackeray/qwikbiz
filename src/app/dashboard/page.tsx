'use client';

import { withAuth } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { DashboardTemplate } from '@/components/templates/dashboard';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardTemplate
      user={{
        name: user?.name || 'User',
        email: user?.email || '',
        imageUrl: user?.imageUrl
      }}
    />
  );
}

// Wrap with auth HOC to protect the route
export default withAuth(DashboardPage);

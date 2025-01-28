import { LoginForm } from '@/components/molecules/forms/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - BizSim',
  description: 'Sign in to your BizSim account to access your business simulation dashboard',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}

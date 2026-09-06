import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - CloudVault',
  description: 'Sign in to access your secure CloudVault file storage.',
};

export default function LoginPage() {
  return <LoginForm />;
}

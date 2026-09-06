import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - CloudVault',
  description: 'Reset your CloudVault account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

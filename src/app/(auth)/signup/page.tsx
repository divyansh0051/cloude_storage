import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - CloudVault',
  description: 'Create a CloudVault account to start storing and sharing your files securely.',
};

export default function SignupPage() {
  return <SignupForm />;
}

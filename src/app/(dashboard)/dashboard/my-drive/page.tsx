import { Metadata } from 'next';
import { DriveView } from '@/components/dashboard/DriveView';

export const metadata: Metadata = {
  title: 'My Drive - CloudVault',
  description: 'Manage and access your cloud files and folders.',
};

export default function MyDrivePage() {
  return <DriveView folderId={null} />;
}

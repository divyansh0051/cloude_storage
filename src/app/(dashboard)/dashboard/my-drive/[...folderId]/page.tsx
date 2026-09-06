import { Metadata } from 'next';
import { DriveView } from '@/components/dashboard/DriveView';

export const metadata: Metadata = {
  title: 'Folder - CloudVault',
  description: 'View folder contents in CloudVault.',
};

export default async function SubfolderPage({ params }: { params: Promise<{ folderId: string[] }> }) {
  const resolvedParams = await params;
  const currentFolderId = resolvedParams.folderId[resolvedParams.folderId.length - 1];

  return <DriveView folderId={currentFolderId} />;
}

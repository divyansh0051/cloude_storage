'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { UploadProgressWidget } from '@/components/upload/UploadProgressWidget';
import { CreateFolderModal } from '@/components/folders/CreateFolderModal';
import { storage } from '@/lib/storage';
import { UploadProgressItem, UserProfile } from '@/types';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadProgressItem[]>([]);

  const handleFilesUpload = async (files: File[]) => {
    const newItems: UploadProgressItem[] = files.map((file, idx) => ({
      id: `up_${Date.now()}_${idx}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    }));

    setUploadItems((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      try {
        // Simulate uploading progress
        for (let p = 25; p <= 100; p += 25) {
          await new Promise((r) => setTimeout(r, 150));
          setUploadItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: p } : i))
          );
        }

        // Add file to storage
        await storage.addFile(item.file, null);

        setUploadItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'completed' } : i))
        );

        // Refresh user profile storage quota
        setUser(storage.getUser());
        toast.success(`Successfully uploaded ${item.name}`);
      } catch (err: any) {
        setUploadItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: err?.message } : i))
        );
        toast.error(`Failed to upload ${item.name}`);
      }
    }
  };

  const handleCreateFolder = (folderName: string) => {
    storage.createFolder(folderName, null);
    toast.success(`Folder "${folderName}" created successfully.`);
    // Trigger window custom event for reactive page refetching
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cloudvault_storage_changed'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar user={user} onNewClick={() => setIsCreateFolderOpen(true)} />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        user={user}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMobileMenuToggle={() => setIsMobileNavOpen(true)}
        />

        <UploadDropzone onFilesSelected={handleFilesUpload}>
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </UploadDropzone>

        {/* Global Modals & Widgets */}
        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          onClose={() => setIsCreateFolderOpen(false)}
          onCreateFolder={handleCreateFolder}
        />

        <UploadProgressWidget
          items={uploadItems}
          onDismiss={() => setUploadItems([])}
          onClearCompleted={() => setUploadItems((prev) => prev.filter((i) => i.status !== 'completed'))}
        />
      </div>
    </div>
  );
}

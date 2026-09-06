'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { FileItem, FolderItem } from '@/types';
import { FileGrid } from '@/components/files/FileGrid';
import { Star } from 'lucide-react';

export default function StarredPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  const loadData = () => {
    setFolders(storage.getFolders().filter((f) => f.is_starred));
    setFiles(storage.getFiles().filter((f) => f.is_starred));
  };

  useEffect(() => {
    loadData();
  }, []);

  const getItemHandlers = (item: any, isFolder: boolean) => ({
    onToggleStar: () => {
      if (isFolder) storage.toggleStarFolder(item.id);
      else storage.toggleStarFile(item.id);
      loadData();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
          <Star className="w-5 h-5 fill-amber-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Starred Items</h1>
          <p className="text-xs text-slate-500">Quickly access your important pinned files and folders</p>
        </div>
      </div>

      <FileGrid folders={folders} files={files} getItemHandlers={getItemHandlers} />
    </div>
  );
}

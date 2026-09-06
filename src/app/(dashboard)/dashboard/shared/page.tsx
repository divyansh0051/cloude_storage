'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { FileItem, FolderItem } from '@/types';
import { FileGrid } from '@/components/files/FileGrid';
import { Users } from 'lucide-react';

export default function SharedPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    // Files/folders shared with user
    setFolders(storage.getFolders().slice(0, 1));
    setFiles(storage.getFiles().filter((f) => f.id === 'file_architecture_doc'));
  }, []);

  const getItemHandlers = (item: any, isFolder: boolean) => ({
    onOpen: () => {},
    onDownload: () => {},
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Users className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Shared with me</h1>
          <p className="text-xs text-slate-500">Files and folders shared with you by teammates</p>
        </div>
      </div>

      <FileGrid folders={folders} files={files} getItemHandlers={getItemHandlers} />
    </div>
  );
}

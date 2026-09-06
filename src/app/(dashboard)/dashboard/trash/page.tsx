'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { FileItem, FolderItem } from '@/types';
import { FileGrid } from '@/components/files/FileGrid';
import { Trash2, AlertTriangle, RotateCcw, Flame } from 'lucide-react';
import { toast } from 'sonner';

export default function TrashPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  const loadData = () => {
    setFolders(storage.getFolders(true).filter((f) => f.is_deleted));
    setFiles(storage.getFiles(true).filter((f) => f.is_deleted));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEmptyTrash = () => {
    folders.forEach((f) => storage.permanentDeleteFolder(f.id));
    files.forEach((f) => storage.permanentDeleteFile(f.id));
    toast.success('Trash emptied completely.');
    loadData();
  };

  const getItemHandlers = (item: any, isFolder: boolean) => ({
    onRestore: () => {
      if (isFolder) storage.restoreFolder(item.id);
      else storage.restoreFile(item.id);
      toast.success(`Restored "${item.name}"`);
      loadData();
    },
    onDelete: () => {
      if (isFolder) storage.permanentDeleteFolder(item.id);
      else storage.permanentDeleteFile(item.id);
      toast.success(`Permanently deleted "${item.name}"`);
      loadData();
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Trash2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Trash</h1>
            <p className="text-xs text-slate-500">Soft-deleted items are retained for 30 days before permanent purging.</p>
          </div>
        </div>

        {folders.length > 0 || files.length > 0 ? (
          <button
            onClick={handleEmptyTrash}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Flame className="w-4 h-4" />
            <span>Empty Trash Now</span>
          </button>
        ) : null}
      </div>

      {/* Retention Alert Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>Items in trash will be automatically purged permanently after 30 days. You can restore them anytime before then.</span>
      </div>

      <FileGrid folders={folders} files={files} getItemHandlers={getItemHandlers} />
    </div>
  );
}

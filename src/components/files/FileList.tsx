'use client';

import React from 'react';
import { FolderItem, FileItem } from '@/types';
import { FolderRow } from '../folders/FolderRow';
import { FileRow } from './FileRow';
import { ActionHandlers } from './FileContextMenu';
import { EmptyState } from '../common/EmptyState';

interface FileListProps {
  folders: FolderItem[];
  files: FileItem[];
  getItemHandlers: (item: FolderItem | FileItem, isFolder: boolean) => ActionHandlers;
  onFileSelect?: (file: FileItem) => void;
}

export function FileList({ folders, files, getItemHandlers, onFileSelect }: FileListProps) {
  const isEmpty = folders.length === 0 && files.length === 0;

  if (isEmpty) {
    return <EmptyState title="No items found" description="This folder is empty. Upload files or create folders to get started." />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4 hidden md:table-cell">Owner</th>
              <th className="py-3 px-4 hidden sm:table-cell">Last Modified</th>
              <th className="py-3 px-4 hidden lg:table-cell">File Size</th>
              <th className="py-3 px-4 hidden xl:table-cell">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                handlers={getItemHandlers(folder, true)}
              />
            ))}
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                handlers={getItemHandlers(file, false)}
                onSelect={() => onFileSelect?.(file)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { FolderItem, FileItem } from '@/types';
import { FolderCard } from '../folders/FolderCard';
import { FileCard } from './FileCard';
import { ActionHandlers } from './FileContextMenu';
import { EmptyState } from '../common/EmptyState';

interface FileGridProps {
  folders: FolderItem[];
  files: FileItem[];
  getItemHandlers: (item: FolderItem | FileItem, isFolder: boolean) => ActionHandlers;
  onFileSelect?: (file: FileItem) => void;
}

export function FileGrid({ folders, files, getItemHandlers, onFileSelect }: FileGridProps) {
  const isEmpty = folders.length === 0 && files.length === 0;

  if (isEmpty) {
    return <EmptyState title="No items found" description="This folder is empty. Upload files or create folders to get started." />;
  }

  return (
    <div className="space-y-8">
      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Folders ({folders.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                handlers={getItemHandlers(folder, true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Files ({files.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                handlers={getItemHandlers(file, false)}
                onSelect={() => onFileSelect?.(file)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderItem } from '@/types';
import { FileTypeIcon } from '../files/FileTypeIcon';
import { FileContextMenu, ActionHandlers } from '../files/FileContextMenu';
import { Star } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FolderCardProps {
  folder: FolderItem;
  handlers: ActionHandlers;
}

export function FolderCard({ folder, handlers }: FolderCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleOpen = () => {
    if (handlers.onOpen) {
      handlers.onOpen();
    } else {
      router.push(`/dashboard/my-drive/${folder.id}`);
    }
  };

  return (
    <div
      onClick={handleOpen}
      className={`group relative bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer select-none flex flex-col justify-between ${
        isMenuOpen ? 'z-[60] shadow-2xl border-indigo-400 ring-2 ring-indigo-500/20' : 'z-10 hover:z-20'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileTypeIcon isFolder className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
              {folder.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {folder.item_count || 0} items {folder.size_bytes ? `• ${formatBytes(folder.size_bytes)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {folder.is_starred && (
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          )}
          <FileContextMenu
            isStarred={folder.is_starred}
            isDeleted={folder.is_deleted}
            handlers={{
              ...handlers,
              onOpen: handleOpen,
            }}
            onMenuToggle={setIsMenuOpen}
          />
        </div>
      </div>
    </div>
  );
}

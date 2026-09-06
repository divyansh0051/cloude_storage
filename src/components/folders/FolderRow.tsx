'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderItem } from '@/types';
import { FileTypeIcon } from '../files/FileTypeIcon';
import { FileContextMenu, ActionHandlers } from '../files/FileContextMenu';
import { formatDate, formatBytes } from '@/lib/utils';
import { Star } from 'lucide-react';

interface FolderRowProps {
  folder: FolderItem;
  handlers: ActionHandlers;
}

export function FolderRow({ folder, handlers }: FolderRowProps) {
  const router = useRouter();

  const handleOpen = () => {
    if (handlers.onOpen) {
      handlers.onOpen();
    } else {
      router.push(`/dashboard/my-drive/${folder.id}`);
    }
  };

  return (
    <tr
      onClick={handleOpen}
      className="group hover:bg-indigo-50/40 transition-colors border-b border-slate-100/80 cursor-pointer select-none"
    >
      {/* Name Column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <FileTypeIcon isFolder className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-xs sm:max-w-md">
            {folder.name}
          </span>
          {folder.is_starred && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          )}
        </div>
      </td>

      {/* Owner Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell font-medium">
        Me
      </td>

      {/* Modified Date Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell font-medium">
        {formatDate(folder.updated_at || folder.created_at)}
      </td>

      {/* Size Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden lg:table-cell font-medium">
        {folder.size_bytes ? formatBytes(folder.size_bytes) : '--'}
      </td>

      {/* Type Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden xl:table-cell font-medium">
        Folder
      </td>

      {/* Actions Column */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <FileContextMenu
          isStarred={folder.is_starred}
          isDeleted={folder.is_deleted}
          handlers={{
            ...handlers,
            onOpen: handleOpen,
          }}
        />
      </td>
    </tr>
  );
}

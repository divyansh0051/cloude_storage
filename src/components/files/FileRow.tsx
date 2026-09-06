'use client';

import React from 'react';
import { FileItem } from '@/types';
import { FileTypeIcon } from './FileTypeIcon';
import { FileContextMenu, ActionHandlers } from './FileContextMenu';
import { formatDate, formatBytes } from '@/lib/utils';
import { Star } from 'lucide-react';

interface FileRowProps {
  file: FileItem;
  handlers: ActionHandlers;
  onSelect?: () => void;
}

export function FileRow({ file, handlers, onSelect }: FileRowProps) {
  return (
    <tr
      onClick={onSelect || handlers.onDetails || handlers.onOpen}
      className="group hover:bg-indigo-50/40 transition-colors border-b border-slate-100/80 cursor-pointer select-none"
    >
      {/* Name Column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
            <FileTypeIcon mimeType={file.mime_type} filename={file.name} className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-xs sm:max-w-md">
            {file.name}
          </span>
          {file.is_starred && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          )}
        </div>
      </td>

      {/* Owner Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell font-medium">
        {file.owner_name || 'Me'}
      </td>

      {/* Modified Date Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden sm:table-cell font-medium">
        {formatDate(file.updated_at || file.created_at)}
      </td>

      {/* Size Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden lg:table-cell font-medium">
        {formatBytes(file.size_bytes)}
      </td>

      {/* Type Column */}
      <td className="py-3 px-4 text-xs text-slate-500 hidden xl:table-cell font-medium uppercase tracking-wider text-[10px]">
        {file.name.split('.').pop() || 'FILE'}
      </td>

      {/* Actions Column */}
      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <FileContextMenu
          isStarred={file.is_starred}
          isDeleted={file.is_deleted}
          handlers={handlers}
        />
      </td>
    </tr>
  );
}

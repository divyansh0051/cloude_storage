'use client';

import React from 'react';
import { FileItem } from '@/types';
import { FileTypeIcon } from './FileTypeIcon';
import { FileContextMenu, ActionHandlers } from './FileContextMenu';
import { Star, Eye } from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';

interface FileCardProps {
  file: FileItem;
  handlers: ActionHandlers;
  onSelect?: () => void;
}

export function FileCard({ file, handlers, onSelect }: FileCardProps) {
  const isImage = file.mime_type.startsWith('image/');
  const hasPreview = isImage && file.preview_url;

  return (
    <div
      onClick={onSelect || handlers.onDetails || handlers.onOpen}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer select-none flex flex-col hover:z-20"
    >
      {/* Thumbnail or Preview Area */}
      <div className="h-36 bg-slate-50 relative flex items-center justify-center border-b border-slate-100 rounded-t-2xl overflow-hidden group-hover:bg-slate-100/50 transition-colors">
        {hasPreview ? (
          <img
            src={file.preview_url}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileTypeIcon mimeType={file.mime_type} filename={file.name} className="w-7 h-7" />
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlers.onOpen?.();
            }}
            className="px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview</span>
          </button>
        </div>

        {/* Star Badge */}
        {file.is_starred && (
          <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
        )}
      </div>

      {/* File Metadata Header */}
      <div className="p-4 flex items-start justify-between gap-2 relative">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
            {file.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
            <span>{formatBytes(file.size_bytes)}</span>
            <span>•</span>
            <span>{formatDate(file.updated_at || file.created_at).split(',')[0]}</span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="relative z-30">
          <FileContextMenu
            isStarred={file.is_starred}
            isDeleted={file.is_deleted}
            handlers={handlers}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { FileItem, FolderItem } from '@/types';
import { X, Download, Share2, Star, Trash2, Eye, Calendar, HardDrive, User, Clock, FileText } from 'lucide-react';
import { FileTypeIcon } from './FileTypeIcon';
import { formatBytes, formatDate } from '@/lib/utils';
import { ActionHandlers } from './FileContextMenu';

interface FileDetailsPanelProps {
  item: FileItem | FolderItem | null;
  isFolder: boolean;
  onClose: () => void;
  handlers: ActionHandlers;
}

export function FileDetailsPanel({ item, isFolder, onClose, handlers }: FileDetailsPanelProps) {
  if (!item) return null;

  const file = isFolder ? null : (item as FileItem);
  const folder = isFolder ? (item as FolderItem) : null;

  const isImage = file?.mime_type.startsWith('image/');
  const isVideo = file?.mime_type.startsWith('video/');

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200/80 z-40 flex flex-col animate-scale-up">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Details & Metadata</h2>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Preview Container */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[160px]">
          {isImage && file?.preview_url ? (
            <img src={file.preview_url} alt={file.name} className="max-h-40 rounded-lg object-contain" />
          ) : isVideo && file?.preview_url ? (
            <video src={file.preview_url} controls className="max-h-40 rounded-lg w-full" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center mb-2">
              <FileTypeIcon isFolder={isFolder} mimeType={file?.mime_type} filename={item.name} className="w-9 h-9" />
            </div>
          )}

          <h3 className="text-sm font-bold text-slate-900 mt-2 truncate w-full px-2">{item.name}</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isFolder ? 'Folder' : formatBytes(file?.size_bytes || 0)}
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="grid grid-cols-4 gap-2">
          {handlers.onDownload && !isFolder && (
            <button
              onClick={handlers.onDownload}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-[11px] font-semibold"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Download</span>
            </button>
          )}

          {handlers.onShare && (
            <button
              onClick={handlers.onShare}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-[11px] font-semibold"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Share</span>
            </button>
          )}

          {handlers.onToggleStar && (
            <button
              onClick={handlers.onToggleStar}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-[11px] font-semibold"
            >
              <Star className={`w-4 h-4 ${item.is_starred ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>{item.is_starred ? 'Starred' : 'Star'}</span>
            </button>
          )}

          {handlers.onDelete && (
            <button
              onClick={handlers.onDelete}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-[11px] font-semibold"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Information Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">File Information</h4>
          <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-100 text-xs">
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                <FileText className="w-3.5 h-3.5" /> Type
              </span>
              <span className="font-semibold text-slate-800 uppercase">
                {isFolder ? 'Folder' : file?.name.split('.').pop() || 'File'}
              </span>
            </div>

            {!isFolder && (
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2 font-medium">
                  <HardDrive className="w-3.5 h-3.5" /> Size
                </span>
                <span className="font-semibold text-slate-800">{formatBytes(file?.size_bytes || 0)}</span>
              </div>
            )}

            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                <User className="w-3.5 h-3.5" /> Owner
              </span>
              <span className="font-semibold text-slate-800">{file?.owner_name || 'Me'}</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Created
              </span>
              <span className="font-semibold text-slate-800">{formatDate(item.created_at)}</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                <Clock className="w-3.5 h-3.5" /> Modified
              </span>
              <span className="font-semibold text-slate-800">{formatDate(item.updated_at || item.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

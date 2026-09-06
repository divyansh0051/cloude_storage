'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Download,
  Edit2,
  FolderInput,
  Star,
  Share2,
  Trash2,
  RotateCcw,
  Info,
  ExternalLink,
} from 'lucide-react';

export interface ActionHandlers {
  onOpen?: () => void;
  onDownload?: () => void;
  onRename?: () => void;
  onMove?: () => void;
  onToggleStar?: () => void;
  onShare?: () => void;
  onDetails?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

interface FileContextMenuProps {
  isStarred?: boolean;
  isDeleted?: boolean;
  handlers: ActionHandlers;
}

export function FileContextMenu({ isStarred, isDeleted, handlers }: FileContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        aria-label="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-[100] animate-scale-up text-xs font-medium"
        >
          {isDeleted ? (
            <>
              {handlers.onRestore && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onRestore?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-indigo-600 hover:bg-indigo-50 transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Item</span>
                </button>
              )}
              {handlers.onDelete && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onDelete?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </button>
              )}
            </>
          ) : (
            <>
              {handlers.onOpen && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onOpen?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Open</span>
                </button>
              )}

              {handlers.onDownload && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onDownload?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download</span>
                </button>
              )}

              {handlers.onShare && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onShare?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Share</span>
                </button>
              )}

              {handlers.onToggleStar && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onToggleStar?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  <span>{isStarred ? 'Unstar' : 'Add to Starred'}</span>
                </button>
              )}

              {handlers.onRename && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onRename?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Edit2 className="w-4 h-4 text-slate-400" />
                  <span>Rename</span>
                </button>
              )}

              {handlers.onMove && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onMove?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <FolderInput className="w-4 h-4 text-slate-400" />
                  <span>Move to...</span>
                </button>
              )}

              {handlers.onDetails && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onDetails?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left border-t border-slate-100 mt-1"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>View Details</span>
                </button>
              )}

              {handlers.onDelete && (
                <button
                  onClick={() => { setIsOpen(false); handlers.onDelete?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Move to Trash</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

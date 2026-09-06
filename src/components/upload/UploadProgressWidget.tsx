'use client';

import React from 'react';
import { UploadProgressItem } from '@/types';
import { CheckCircle2, AlertCircle, X, ChevronUp, ChevronDown, Loader2, FileUp } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface UploadProgressWidgetProps {
  items: UploadProgressItem[];
  onDismiss: () => void;
  onClearCompleted: () => void;
}

export function UploadProgressWidget({ items, onDismiss, onClearCompleted }: UploadProgressWidgetProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (items.length === 0) return null;

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const isAllCompleted = completedCount === items.length;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-scale-up">
      {/* Widget Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileUp className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold tracking-tight">
            {isAllCompleted ? `Uploaded ${items.length} file(s)` : `Uploading ${completedCount}/${items.length} file(s)`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Widget File List */}
      {!isCollapsed && (
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {items.map((item) => (
            <div key={item.id} className="p-2 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">{formatBytes(item.size)}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.status === 'completed'
                        ? 'bg-emerald-500'
                        : item.status === 'error'
                        ? 'bg-rose-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0">
                {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {item.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                {item.status === 'uploading' && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { HardDrive } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface StorageMeterProps {
  usedBytes: number;
  quotaBytes: number;
}

export function StorageMeter({ usedBytes, quotaBytes }: StorageMeterProps) {
  const percentage = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
          <HardDrive className="w-4 h-4 text-indigo-600" />
          <span>Storage</span>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatBytes(usedBytes)} used</span>
        <span>{formatBytes(quotaBytes)}</span>
      </div>
    </div>
  );
}

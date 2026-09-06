'use client';

import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Folder Skeletons */}
      <div className="space-y-3">
        <div className="h-4 w-28 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-200/70 rounded-2xl p-4" />
          ))}
        </div>
      </div>

      {/* File Skeletons */}
      <div className="space-y-3">
        <div className="h-4 w-20 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

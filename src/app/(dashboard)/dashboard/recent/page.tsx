'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { ActivityItem } from '@/types';
import { Clock, FileUp, FolderPlus, Share2, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function RecentPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setActivities(storage.getActivities());
  }, []);

  const getActionBadge = (action: ActivityItem['action']) => {
    switch (action) {
      case 'upload':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><FileUp className="w-3 h-3" /> Uploaded</span>;
      case 'create_folder':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"><FolderPlus className="w-3 h-3" /> Created Folder</span>;
      case 'share':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200"><Share2 className="w-3 h-3" /> Shared</span>;
      case 'rename':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"><Edit2 className="w-3 h-3" /> Renamed</span>;
      case 'delete':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"><Trash2 className="w-3 h-3" /> Soft Deleted</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Clock className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h1>
          <p className="text-xs text-slate-500">Timeline of recent file uploads, edits, and sharing events</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="relative pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{act.resource_name}</span>
                  {getActionBadge(act.action)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Action performed by <span className="font-semibold text-slate-700">{act.actor_name || storage.getUser().full_name || 'User'}</span>
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{formatDate(act.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

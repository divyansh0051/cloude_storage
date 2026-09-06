'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cloud, HardDrive, Users, Clock, Star, Trash2, Settings, LogOut, Plus } from 'lucide-react';
import { StorageMeter } from './StorageMeter';
import { UserProfile } from '@/types';

interface SidebarProps {
  user: UserProfile;
  onNewClick?: () => void;
}

export function Sidebar({ user, onNewClick }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'My Drive', href: '/dashboard/my-drive', icon: HardDrive },
    { name: 'Shared with me', href: '/dashboard/shared', icon: Users },
    { name: 'Recent', href: '/dashboard/recent', icon: Clock },
    { name: 'Starred', href: '/dashboard/starred', icon: Star },
    { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header - Matching Reference Screenshots */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link href="/dashboard/my-drive" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Cloud className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">CloudVault</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">Secure cloud storage</span>
          </div>
        </Link>
      </div>

      {/* Prominent Action Button */}
      {onNewClick && (
        <div className="px-4 py-2">
          <button
            onClick={onNewClick}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>New Action</span>
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm shadow-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 stroke-[2.2]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Storage & Status Widget */}
      <div className="p-4 border-t border-slate-100">
        <StorageMeter usedBytes={user.storage_used_bytes} quotaBytes={user.storage_quota_bytes} />
      </div>
    </aside>
  );
}

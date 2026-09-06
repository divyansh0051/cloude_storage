'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types';
import { LogOut, Settings, User, ChevronDown, ShieldCheck, Trash2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

interface UserMenuProps {
  user: UserProfile;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
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

  const handleLogout = () => {
    toast.success('Signed out successfully.');
    router.push('/login');
  };

  const handleEmptyDrive = () => {
    storage.clearStorage();
    toast.success('Drive emptied successfully.');
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 focus:outline-none cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-xs ring-2 ring-indigo-500/20 shrink-0">
          <User className="w-4.5 h-4.5 text-white stroke-[2.2]" />
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-semibold text-slate-800 leading-snug">{user.full_name}</span>
          <span className="text-xs text-slate-400 font-normal truncate max-w-[120px]">{user.email}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scale-up">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 mb-1">
            <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Pro Account
            </div>
          </div>

          <div className="space-y-0.5 px-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                toast.info('Profile settings modal coming soon.');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Profile Details</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                toast.info('Account settings coming soon.');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings & Preferences</span>
            </button>
          </div>

          <div className="border-t border-slate-100 mt-2 pt-1 px-1.5 space-y-0.5">
            <button
              onClick={handleEmptyDrive}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-amber-500" />
              <span>Empty Drive</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Cloud, Lock, Download, AlertCircle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { storage } from '@/lib/storage';
import { formatBytes, formatDate } from '@/lib/utils';
import { FileTypeIcon } from '@/components/files/FileTypeIcon';
import { toast } from 'sonner';

export default function PublicSharePage() {
  const params = useParams();
  const token = params?.token as string;

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const linkShare = storage.getLinkShare(token);
  const allFiles = storage.getFiles(true);
  const matchedFile = allFiles.find((f) => f.id === linkShare?.resource_id);
  const latestFile = allFiles.length > 0 ? allFiles[0] : null;

  const file = matchedFile || (linkShare ? {
    id: linkShare.resource_id || 'shared_file',
    name: linkShare.file_name || latestFile?.name || 'Shared Document.pdf',
    mime_type: linkShare.file_mime_type || latestFile?.mime_type || 'application/pdf',
    size_bytes: linkShare.file_size_bytes || latestFile?.size_bytes || 1024000,
    storage_key: '',
    owner_id: linkShare.created_by || 'user',
    folder_id: null,
    is_deleted: false,
    created_at: linkShare.created_at || new Date().toISOString(),
    updated_at: linkShare.created_at || new Date().toISOString(),
    download_url: linkShare.file_download_url || latestFile?.download_url || '#',
    preview_url: linkShare.file_preview_url || latestFile?.preview_url,
    owner_name: linkShare.owner_name || latestFile?.owner_name || 'User',
  } : (latestFile || {
    id: 'shared_file',
    name: 'Shared Document.pdf',
    mime_type: 'application/pdf',
    size_bytes: 1024000,
    storage_key: '',
    owner_id: 'user',
    folder_id: null,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    download_url: '#',
    owner_name: 'User',
  }));

  const isExpired = linkShare.expires_at ? new Date(linkShare.expires_at) < new Date() : false;
  const requiresPassword = linkShare.has_password && !isAuthenticated;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '123456' || passwordInput === 'password') {
      setIsAuthenticated(true);
      toast.success('Access granted!');
    } else {
      toast.error('Incorrect password. Please try again.');
    }
  };

  const handleDownload = () => {
    toast.success(`Downloading ${file.name}`);
    const link = document.createElement('a');
    link.href = file.download_url || '#';
    link.download = file.name;
    link.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-purple-auth-gradient">
      {/* Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 sm:p-10 shadow-2xl animate-scale-up border border-white/20 text-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
            <Cloud className="w-7 h-7 fill-white/20 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CloudVault Share</h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">Public Shared Document</p>
        </div>

        {/* Expired State */}
        {isExpired ? (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Link Has Expired</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              This public sharing link is no longer active because its expiration time has elapsed.
            </p>
          </div>
        ) : requiresPassword ? (
          /* Password Protected Challenge */
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-3 text-left">
              <Lock className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-950">Password Protected Link</p>
                <p className="text-[11px] text-indigo-700/80 mt-0.5">Please enter the password provided by the owner to view this file.</p>
              </div>
            </div>

            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter access password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-sm cursor-pointer"
            >
              Unlock File Access
            </button>
          </form>
        ) : (
          /* Granted View State */
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center">
              {file.preview_url ? (
                <img src={file.preview_url} alt={file.name} className="max-h-48 rounded-xl object-contain mb-4 shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-3">
                  <FileTypeIcon mimeType={file.mime_type} filename={file.name} className="w-8 h-8" />
                </div>
              )}

              <h2 className="text-base font-bold text-slate-900 truncate max-w-full px-2">{file.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                <span>{formatBytes(file.size_bytes)}</span>
                <span>•</span>
                <span>Shared by {file.owner_name || 'User'}</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File ({formatBytes(file.size_bytes)})</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Powered by CloudVault
          </span>
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

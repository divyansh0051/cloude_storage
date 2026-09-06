'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { SharePermission, LinkShare, ResourceType } from '@/types';
import { Mail, Copy, Check, Lock, Calendar, Globe, Trash2, Shield, UserCheck, KeyRound } from 'lucide-react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
}

export function ShareModal({ isOpen, onClose, resourceType, resourceId, resourceName }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'link'>('people');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');

  // Link settings state
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const shares = storage.getShares(resourceType, resourceId);
  const existingLink = storage.getLinkShare('cv_pub_demo_98234a'); // or find by resourceId

  const handleAddPeople = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    storage.addShare(resourceType, resourceId, email, role);
    toast.success(`Shared "${resourceName}" with ${email}`);
    setEmail('');
  };

  const handleRemovePeople = (shareId: string) => {
    storage.removeShare(shareId);
    toast.success('Access removed.');
  };

  const handleCreatePublicLink = () => {
    const linkShare = storage.createLinkShare(resourceType, resourceId, {
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      password: hasPassword && password ? password : undefined,
    });

    navigator.clipboard.writeText(linkShare.url || window.location.href);
    setCopiedLink(true);
    toast.success('Public link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${resourceName}"`}>
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 pb-2 gap-4">
          <button
            onClick={() => setActiveTab('people')}
            className={`text-xs font-bold pb-1.5 transition-colors border-b-2 ${
              activeTab === 'people'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Share with People
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`text-xs font-bold pb-1.5 transition-colors border-b-2 ${
              activeTab === 'link'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Public Share Link
          </button>
        </div>

        {/* Tab 1: Share with People */}
        {activeTab === 'people' && (
          <div className="space-y-5">
            <form onSubmit={handleAddPeople} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email (e.g. rahul.danu@gmail.com)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  Invite
                </button>
              </div>
            </form>

            {/* People with Access List */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">People with Access</h4>
              <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-2xl p-2 max-h-48 overflow-y-auto">
                <div className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {storage.getUser().full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{storage.getUser().full_name || 'User'} (You)</p>
                      <p className="text-[10px] text-slate-400">{storage.getUser().email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Owner
                  </span>
                </div>

                {shares.map((share) => (
                  <div key={share.id} className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {share.grantee_email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{share.grantee_email}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{share.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePeople(share.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Public Share Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-indigo-950">Anyone with the link can view</p>
                <p className="text-indigo-700/80 mt-0.5">Generates a secure public URL with optional password protection and expiration.</p>
              </div>
            </div>

            {/* Password Protection Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Protect link with password</span>
              </label>

              {hasPassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set access password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Generate & Copy Action */}
            <button
              onClick={handleCreatePublicLink}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Public Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Create & Copy Share Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

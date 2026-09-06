'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FolderItem } from '@/types';
import { Folder, HardDrive, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface FolderTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  currentItemId: string;
  onMove: (targetFolderId: string | null) => void;
}

export function FolderTreeModal({ isOpen, onClose, folders, currentItemId, onMove }: FolderTreeModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const availableFolders = folders.filter((f) => f.id !== currentItemId && !f.is_deleted);

  const handleConfirm = () => {
    onMove(selectedFolderId);
    toast.success('Item moved successfully.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Move Item">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 font-medium">Select a target folder location:</p>

        <div className="max-h-60 overflow-y-auto border border-slate-200/80 rounded-2xl p-2 divide-y divide-slate-100 bg-slate-50/50">
          {/* Root Location */}
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
              selectedFolderId === null
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span className="text-xs">My Drive (Root)</span>
            </div>
            {selectedFolderId === null && <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />}
          </div>

          {/* Folder Hierarchy List */}
          {availableFolders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 pl-2">
                  <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                  <span className="text-xs truncate">{folder.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Move Here
          </button>
        </div>
      </div>
    </Modal>
  );
}

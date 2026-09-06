'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { FolderItem, FileItem, ViewMode, SortOption } from '@/types';
import { FileGrid } from '../files/FileGrid';
import { FileList } from '../files/FileList';
import { Breadcrumbs, BreadcrumbItem } from '../common/Breadcrumbs';
import { FileDetailsPanel } from '../files/FileDetailsPanel';
import { CreateFolderModal } from '../folders/CreateFolderModal';
import { RenameModal } from '../common/RenameModal';
import { FolderTreeModal } from '../folders/FolderTreeModal';
import { ShareModal } from '../sharing/ShareModal';
import { LayoutGrid, List, ArrowUpDown, Plus, Upload, FolderPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface DriveViewProps {
  folderId?: string | null;
}

export function DriveView({ folderId = null }: DriveViewProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Modals state
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<{ id: string; name: string; isFolder: boolean } | null>(null);
  const [moveItem, setMoveItem] = useState<{ id: string; isFolder: boolean } | null>(null);
  const [shareItem, setShareItem] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<{ item: FileItem | FolderItem; isFolder: boolean } | null>(null);

  const loadData = () => {
    const allFolders = storage.getFolders().filter((f) => f.parent_id === folderId);
    const allFiles = storage.getFiles().filter((f) => f.folder_id === folderId);

    // Apply Sorting
    const sortFn = (a: any, b: any) => {
      switch (sortOption) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'date_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'size_desc': return (b.size_bytes || 0) - (a.size_bytes || 0);
        case 'size_asc': return (a.size_bytes || 0) - (b.size_bytes || 0);
        default: return 0;
      }
    };

    setFolders(allFolders.sort(sortFn));
    setFiles(allFiles.sort(sortFn));
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => loadData();
    window.addEventListener('cloudvault_storage_changed', handleStorageChange);
    return () => window.removeEventListener('cloudvault_storage_changed', handleStorageChange);
  }, [folderId, sortOption]);

  // Construct Breadcrumbs
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    if (!folderId) return [];
    const crumbs: BreadcrumbItem[] = [];
    let current: FolderItem | undefined = storage.getFolders(true).find((f) => f.id === folderId);
    while (current) {
      crumbs.unshift({
        id: current.id,
        name: current.name,
        href: `/dashboard/my-drive/${current.id}`,
      });
      current = current.parent_id ? storage.getFolders(true).find((f) => f.id === current?.parent_id) : undefined;
    }
    return crumbs;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      fileList.forEach(async (file) => {
        await storage.addFile(file, folderId);
      });
      toast.success(`Uploaded ${fileList.length} file(s)`);
      loadData();
    }
  };

  const getItemHandlers = (item: FolderItem | FileItem, isFolder: boolean) => ({
    onOpen: () => {
      if (isFolder) {
        router.push(`/dashboard/my-drive/${item.id}`);
      } else {
        const file = item as FileItem;
        if (file.download_url && file.download_url !== '#') {
          window.open(file.download_url, '_blank');
        } else {
          toast.info(`Opening preview for ${file.name}`);
        }
      }
    },
    onDownload: !isFolder ? () => {
      const file = item as FileItem;
      const link = document.createElement('a');
      link.href = file.download_url || '#';
      link.download = file.name;
      link.click();
      toast.success(`Downloading ${file.name}`);
    } : undefined,
    onRename: () => setRenameItem({ id: item.id, name: item.name, isFolder }),
    onMove: () => setMoveItem({ id: item.id, isFolder }),
    onToggleStar: () => {
      if (isFolder) storage.toggleStarFolder(item.id);
      else storage.toggleStarFile(item.id);
      toast.success(item.is_starred ? 'Removed from Starred' : 'Added to Starred');
      loadData();
    },
    onShare: () => setShareItem({ id: item.id, name: item.name, type: isFolder ? 'folder' : 'file' }),
    onDetails: () => setSelectedDetailsItem({ item, isFolder }),
    onDelete: () => {
      if (isFolder) storage.softDeleteFolder(item.id);
      else storage.softDeleteFile(item.id);
      toast.success('Moved item to Trash');
      loadData();
    },
  });

  return (
    <div className="space-y-6">
      {/* Main Action Header & Breadcrumb Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <Breadcrumbs items={buildBreadcrumbs()} />

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Create Folder button */}
          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span>New Folder</span>
          </button>

          {/* Upload File button */}
          <label className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
          </label>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="py-2 px-3 bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-semibold rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="size_desc">Size (Large)</option>
          </select>
        </div>
      </div>

      {/* Main Content View (Grid or List) */}
      {viewMode === 'grid' ? (
        <FileGrid
          folders={folders}
          files={files}
          getItemHandlers={getItemHandlers}
          onFileSelect={(f) => setSelectedDetailsItem({ item: f, isFolder: false })}
        />
      ) : (
        <FileList
          folders={folders}
          files={files}
          getItemHandlers={getItemHandlers}
          onFileSelect={(f) => setSelectedDetailsItem({ item: f, isFolder: false })}
        />
      )}

      {/* Modals & Slide-over details */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreateFolder={(name) => {
          storage.createFolder(name, folderId);
          toast.success(`Folder "${name}" created.`);
          loadData();
        }}
      />

      {renameItem && (
        <RenameModal
          isOpen={!!renameItem}
          onClose={() => setRenameItem(null)}
          currentName={renameItem.name}
          onRename={(newName) => {
            if (renameItem.isFolder) storage.renameFolder(renameItem.id, newName);
            else storage.renameFile(renameItem.id, newName);
            toast.success('Renamed item successfully.');
            loadData();
          }}
        />
      )}

      {moveItem && (
        <FolderTreeModal
          isOpen={!!moveItem}
          onClose={() => setMoveItem(null)}
          folders={storage.getFolders()}
          currentItemId={moveItem.id}
          onMove={(targetFolderId) => {
            if (moveItem.isFolder) storage.moveFolder(moveItem.id, targetFolderId);
            else storage.moveFile(moveItem.id, targetFolderId);
            loadData();
          }}
        />
      )}

      {shareItem && (
        <ShareModal
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
          resourceType={shareItem.type}
          resourceId={shareItem.id}
          resourceName={shareItem.name}
        />
      )}

      <FileDetailsPanel
        item={selectedDetailsItem?.item || null}
        isFolder={selectedDetailsItem?.isFolder || false}
        onClose={() => setSelectedDetailsItem(null)}
        handlers={
          selectedDetailsItem
            ? getItemHandlers(selectedDetailsItem.item, selectedDetailsItem.isFolder)
            : {}
        }
      />
    </div>
  );
}

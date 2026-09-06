'use client';

import { UserProfile, FolderItem, FileItem, SharePermission, LinkShare, ActivityItem } from '@/types';
import { initialUser, initialFolders, initialFiles, initialActivities, initialShares, initialLinkShares } from './mockData';
import { generateToken } from './utils';

const STORAGE_KEYS = {
  USER: 'cloudvault_user',
  FOLDERS: 'cloudvault_folders',
  FILES: 'cloudvault_files',
  ACTIVITIES: 'cloudvault_activities',
  SHARES: 'cloudvault_shares',
  LINK_SHARES: 'cloudvault_link_shares',
  PURGED: 'cloudvault_mock_purged_v3',
};

const LEGACY_MOCK_IDS = new Set([
  'folder_design_assets',
  'folder_product_docs',
  'folder_financials',
  'folder_branding_sub',
  'folder_trash_sample',
  'file_cloudvault_hero',
  'file_architecture_doc',
  'file_financial_sheet',
  'file_demo_video',
  'file_trash_sample'
]);

class StorageManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private ensureClearedMock(): void {
    if (!this.isBrowser()) return;
    if (localStorage.getItem(STORAGE_KEYS.PURGED) !== 'true') {
      this.clearStorage();
      localStorage.setItem(STORAGE_KEYS.PURGED, 'true');
    }
  }

  clearStorage(): void {
    if (!this.isBrowser()) return;
    const resetUser = { ...initialUser, storage_used_bytes: 0 };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resetUser));
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LINK_SHARES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PURGED, 'true');
  }

  // --- USER PROFILE ---
  getUser(): UserProfile {
    this.ensureClearedMock();
    if (!this.isBrowser()) return { ...initialUser, storage_used_bytes: 0 };
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) {
      const u = { ...initialUser, storage_used_bytes: 0 };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      return u;
    }
    try {
      const user = JSON.parse(stored);
      // Ensure storage_used_bytes is correctly calculated from remaining non-mock files
      const validFiles = this.getFiles(true);
      if (validFiles.length === 0) {
        user.storage_used_bytes = 0;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      return user;
    } catch {
      return { ...initialUser, storage_used_bytes: 0 };
    }
  }

  setUser(user: UserProfile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // --- FOLDERS ---
  getFolders(includeDeleted = false): FolderItem[] {
    this.ensureClearedMock();
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    let folders: FolderItem[] = [];
    if (!stored) {
      folders = [];
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify([]));
    } else {
      try {
        folders = JSON.parse(stored);
      } catch {
        folders = [];
      }
    }
    folders = folders.filter(f => !LEGACY_MOCK_IDS.has(f.id));
    return includeDeleted ? folders : folders.filter(f => !f.is_deleted);
  }

  createFolder(name: string, parentId: string | null = null): FolderItem {
    const user = this.getUser();
    const newFolder: FolderItem = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      owner_id: user.id,
      parent_id: parentId,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_starred: false,
      item_count: 0,
      size_bytes: 0,
    };

    const folders = this.getFolders(true);
    folders.push(newFolder);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }

    this.logActivity('create_folder', 'folder', newFolder.id, newFolder.name);
    return newFolder;
  }

  renameFolder(id: string, name: string): FolderItem | null {
    const folders = this.getFolders(true);
    const idx = folders.findIndex(f => f.id === id);
    if (idx === -1) return null;

    folders[idx].name = name;
    folders[idx].updated_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    this.logActivity('rename', 'folder', id, name);
    return folders[idx];
  }

  moveFolder(id: string, newParentId: string | null): FolderItem | null {
    const folders = this.getFolders(true);
    const idx = folders.findIndex(f => f.id === id);
    if (idx === -1) return null;

    // Prevent circular parent relationship
    if (newParentId === id) return null;

    folders[idx].parent_id = newParentId;
    folders[idx].updated_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    this.logActivity('move', 'folder', id, folders[idx].name);
    return folders[idx];
  }

  toggleStarFolder(id: string): FolderItem | null {
    const folders = this.getFolders(true);
    const idx = folders.findIndex(f => f.id === id);
    if (idx === -1) return null;

    folders[idx].is_starred = !folders[idx].is_starred;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    return folders[idx];
  }

  softDeleteFolder(id: string): boolean {
    const folders = this.getFolders(true);
    const idx = folders.findIndex(f => f.id === id);
    if (idx === -1) return false;

    folders[idx].is_deleted = true;
    folders[idx].deleted_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    this.logActivity('delete', 'folder', id, folders[idx].name);
    return true;
  }

  restoreFolder(id: string): boolean {
    const folders = this.getFolders(true);
    const idx = folders.findIndex(f => f.id === id);
    if (idx === -1) return false;

    folders[idx].is_deleted = false;
    folders[idx].deleted_at = null;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    this.logActivity('restore', 'folder', id, folders[idx].name);
    return true;
  }

  permanentDeleteFolder(id: string): boolean {
    let folders = this.getFolders(true);
    const target = folders.find(f => f.id === id);
    folders = folders.filter(f => f.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
    return !!target;
  }

  // --- FILES ---
  getFiles(includeDeleted = false): FileItem[] {
    this.ensureClearedMock();
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.FILES);
    let files: FileItem[] = [];
    if (!stored) {
      files = [];
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify([]));
    } else {
      try {
        files = JSON.parse(stored);
      } catch {
        files = [];
      }
    }
    files = files.filter(f => !LEGACY_MOCK_IDS.has(f.id));
    return includeDeleted ? files : files.filter(f => !f.is_deleted);
  }

  addFile(file: File, folderId: string | null = null): Promise<FileItem> {
    return new Promise((resolve) => {
      const user = this.getUser();
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isImage = file.type.startsWith('image/');
      
      const createAndSaveFile = (downloadUrl?: string) => {
        const newFile: FileItem = {
          id: fileId,
          name: file.name,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
          storage_key: `tenants/${user.id}/folders/${folderId || 'root'}/files/${fileId}-${file.name}`,
          owner_id: user.id,
          folder_id: folderId,
          is_deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_starred: false,
          download_url: downloadUrl || '#',
          preview_url: downloadUrl,
          owner_name: user.full_name,
          owner_email: user.email,
        };

        const files = this.getFiles(true);
        files.unshift(newFile);
        if (this.isBrowser()) {
          localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
        }

        // Update user storage
        user.storage_used_bytes += file.size;
        this.setUser(user);

        this.logActivity('upload', 'file', newFile.id, newFile.name);
        resolve(newFile);
      };

      if (isImage && this.isBrowser()) {
        const reader = new FileReader();
        reader.onload = (e) => createAndSaveFile(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        createAndSaveFile();
      }
    });
  }

  renameFile(id: string, name: string): FileItem | null {
    const files = this.getFiles(true);
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return null;

    files[idx].name = name;
    files[idx].updated_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    this.logActivity('rename', 'file', id, name);
    return files[idx];
  }

  moveFile(id: string, newFolderId: string | null): FileItem | null {
    const files = this.getFiles(true);
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return null;

    files[idx].folder_id = newFolderId;
    files[idx].updated_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    this.logActivity('move', 'file', id, files[idx].name);
    return files[idx];
  }

  toggleStarFile(id: string): FileItem | null {
    const files = this.getFiles(true);
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return null;

    files[idx].is_starred = !files[idx].is_starred;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    return files[idx];
  }

  softDeleteFile(id: string): boolean {
    const files = this.getFiles(true);
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return false;

    files[idx].is_deleted = true;
    files[idx].deleted_at = new Date().toISOString();
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    this.logActivity('delete', 'file', id, files[idx].name);
    return true;
  }

  restoreFile(id: string): boolean {
    const files = this.getFiles(true);
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return false;

    files[idx].is_deleted = false;
    files[idx].deleted_at = null;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    this.logActivity('restore', 'file', id, files[idx].name);
    return true;
  }

  permanentDeleteFile(id: string): boolean {
    let files = this.getFiles(true);
    const target = files.find(f => f.id === id);
    files = files.filter(f => f.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
    if (target) {
      const user = this.getUser();
      user.storage_used_bytes = Math.max(0, user.storage_used_bytes - target.size_bytes);
      this.setUser(user);
    }
    return !!target;
  }

  // --- SHARING ---
  getShares(resourceType: 'file' | 'folder', resourceId: string): SharePermission[] {
    this.ensureClearedMock();
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.SHARES);
    const shares: SharePermission[] = stored ? JSON.parse(stored) : [];
    return shares.filter(s => s.resource_type === resourceType && s.resource_id === resourceId);
  }

  addShare(resourceType: 'file' | 'folder', resourceId: string, email: string, role: 'viewer' | 'editor'): SharePermission {
    const user = this.getUser();
    const newShare: SharePermission = {
      id: `share_${Date.now()}`,
      resource_type: resourceType,
      resource_id: resourceId,
      grantee_email: email,
      role,
      created_by: user.id,
      created_at: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEYS.SHARES);
    const shares: SharePermission[] = stored ? JSON.parse(stored) : [];
    shares.push(newShare);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(shares));
    }

    const name = resourceType === 'file' 
      ? this.getFiles(true).find(f => f.id === resourceId)?.name || 'item'
      : this.getFolders(true).find(f => f.id === resourceId)?.name || 'item';

    this.logActivity('share', resourceType, resourceId, name, { grantee_email: email, role });
    return newShare;
  }

  removeShare(shareId: string): boolean {
    const stored = localStorage.getItem(STORAGE_KEYS.SHARES);
    let shares: SharePermission[] = stored ? JSON.parse(stored) : [];
    shares = shares.filter(s => s.id !== shareId);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(shares));
    }
    return true;
  }

  // --- PUBLIC SHARES ---
  getLinkShare(token: string): LinkShare | null {
    this.ensureClearedMock();
    const stored = localStorage.getItem(STORAGE_KEYS.LINK_SHARES);
    const linkShares: LinkShare[] = stored ? JSON.parse(stored) : [];
    return linkShares.find(l => l.token === token) || null;
  }

  createLinkShare(resourceType: 'file' | 'folder', resourceId: string, options?: { expiresAt?: string; password?: string }): LinkShare {
    const user = this.getUser();
    const token = `cv_pub_${generateToken(16)}`;

    const targetFile = resourceType === 'file' ? this.getFiles(true).find(f => f.id === resourceId) : null;
    const targetFolder = resourceType === 'folder' ? this.getFolders(true).find(f => f.id === resourceId) : null;

    const newLink: LinkShare = {
      id: `link_${Date.now()}`,
      resource_type: resourceType,
      resource_id: resourceId,
      token,
      role: 'viewer',
      has_password: !!options?.password,
      password_hash: options?.password ? btoa(options.password) : null,
      expires_at: options?.expiresAt || null,
      created_by: user.id,
      created_at: new Date().toISOString(),
      url: typeof window !== 'undefined' ? `${window.location.origin}/share/${token}` : `http://localhost:3000/share/${token}`,
      file_name: targetFile?.name || targetFolder?.name || 'Shared Item',
      file_size_bytes: targetFile?.size_bytes || 0,
      file_mime_type: targetFile?.mime_type || (resourceType === 'folder' ? 'folder' : 'application/pdf'),
      file_download_url: targetFile?.download_url || '#',
      file_preview_url: targetFile?.preview_url || targetFile?.download_url,
      owner_name: user.full_name || 'User',
    };

    const stored = localStorage.getItem(STORAGE_KEYS.LINK_SHARES);
    const linkShares: LinkShare[] = stored ? JSON.parse(stored) : [];
    linkShares.push(newLink);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.LINK_SHARES, JSON.stringify(linkShares));
    }

    return newLink;
  }

  // --- ACTIVITIES ---
  getActivities(): ActivityItem[] {
    this.ensureClearedMock();
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  }

  private logActivity(
    action: ActivityItem['action'],
    resourceType: 'file' | 'folder',
    resourceId: string,
    resourceName: string,
    context?: Record<string, any>
  ): void {
    const user = this.getUser();
    const activity: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      actor_id: user.id,
      actor_name: user.full_name,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      resource_name: resourceName,
      context,
      created_at: new Date().toISOString(),
    };

    const activities = this.getActivities();
    activities.unshift(activity);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
    }
  }
}

export const storage = new StorageManager();

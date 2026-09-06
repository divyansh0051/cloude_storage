import { UserProfile, FolderItem, FileItem, SharePermission, LinkShare, ActivityItem, StarItem } from '@/types';

export const initialUser: UserProfile = {
  id: 'user_1234567890',
  email: 'user@example.com',
  full_name: 'User',
  storage_used_bytes: 0,
  storage_quota_bytes: 16106127360, // 15 GB
  created_at: new Date().toISOString(),
};

export const initialFolders: FolderItem[] = [];

export const initialFiles: FileItem[] = [];

export const initialActivities: ActivityItem[] = [];

export const initialShares: SharePermission[] = [];

export const initialLinkShares: LinkShare[] = [];


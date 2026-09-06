export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  storage_used_bytes: number;
  storage_quota_bytes: number;
  created_at: string;
}

export type ResourceType = 'file' | 'folder';

export interface FolderItem {
  id: string;
  name: string;
  owner_id: string;
  parent_id: string | null;
  is_deleted: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  is_starred?: boolean;
  item_count?: number;
  size_bytes?: number;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version_number: number;
  storage_key: string;
  size_bytes: number;
  checksum?: string;
  created_by?: string;
  created_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  mime_type: string;
  size_bytes: number;
  storage_key: string;
  owner_id: string;
  folder_id: string | null;
  version_id?: string | null;
  checksum?: string;
  is_deleted: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  is_starred?: boolean;
  download_url?: string;
  preview_url?: string;
  owner_name?: string;
  owner_email?: string;
}

export interface SharePermission {
  id: string;
  resource_type: ResourceType;
  resource_id: string;
  grantee_user_id?: string;
  grantee_email: string;
  role: 'viewer' | 'editor';
  created_by: string;
  created_at: string;
}

export interface LinkShare {
  id: string;
  resource_type: ResourceType;
  resource_id: string;
  token: string;
  role: 'viewer' | 'editor';
  has_password?: boolean;
  password_hash?: string | null;
  expires_at?: string | null;
  created_by: string;
  created_at: string;
  url?: string;
}

export interface StarItem {
  id: string;
  user_id: string;
  resource_type: ResourceType;
  resource_id: string;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: 'upload' | 'rename' | 'delete' | 'restore' | 'move' | 'share' | 'download' | 'create_folder';
  resource_type: ResourceType;
  resource_id: string;
  resource_name: string;
  context?: Record<string, any>;
  created_at: string;
}

export interface UploadProgressItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name_asc' | 'name_desc' | 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc';

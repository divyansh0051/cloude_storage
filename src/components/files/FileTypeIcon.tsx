'use client';

import React from 'react';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
  Presentation,
} from 'lucide-react';
import { getFileCategory } from '@/lib/utils';

interface FileTypeIconProps {
  isFolder?: boolean;
  mimeType?: string;
  filename?: string;
  className?: string;
}

export function FileTypeIcon({ isFolder, mimeType = '', filename = '', className = 'w-6 h-6' }: FileTypeIconProps) {
  if (isFolder) {
    return <Folder className={`${className} text-amber-500 fill-amber-500/20`} />;
  }

  const category = getFileCategory(mimeType, filename);

  switch (category) {
    case 'image':
      return <FileImage className={`${className} text-indigo-500 fill-indigo-500/10`} />;
    case 'pdf':
      return <FileText className={`${className} text-rose-500 fill-rose-500/10`} />;
    case 'video':
      return <FileVideo className={`${className} text-purple-500 fill-purple-500/10`} />;
    case 'audio':
      return <FileAudio className={`${className} text-amber-500 fill-amber-500/10`} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={`${className} text-emerald-600 fill-emerald-500/10`} />;
    case 'presentation':
      return <Presentation className={`${className} text-orange-500 fill-orange-500/10`} />;
    case 'code':
      return <FileCode className={`${className} text-cyan-600 fill-cyan-500/10`} />;
    case 'archive':
      return <FileArchive className={`${className} text-yellow-600 fill-yellow-500/10`} />;
    case 'document':
      return <FileText className={`${className} text-blue-600 fill-blue-500/10`} />;
    default:
      return <File className={`${className} text-slate-400`} />;
  }
}

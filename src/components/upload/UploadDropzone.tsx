'use client';

import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  children: React.ReactNode;
}

export function UploadDropzone({ onFilesSelected, children }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      onFilesSelected(fileList);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative min-h-[calc(100vh-4rem)] flex-1 flex flex-col"
    >
      {children}

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fade-in border-4 border-dashed border-white/60 m-4 rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-bounce">
            <UploadCloud className="w-10 h-10 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Drop your files here</h2>
          <p className="text-sm text-indigo-100 mt-1 font-medium">Upload instantly to CloudVault</p>
        </div>
      )}
    </div>
  );
}

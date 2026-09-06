'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  id: string | null;
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 overflow-x-auto py-1 no-scrollbar">
      <Link
        href="/dashboard/my-drive"
        className="flex items-center gap-1 hover:text-slate-900 transition-colors font-medium hover:bg-slate-100 px-2 py-1 rounded-lg"
      >
        <Home className="w-4 h-4 text-slate-400" />
        <span>My Drive</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.id || index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg truncate max-w-[200px]">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-slate-900 transition-colors font-medium hover:bg-slate-100 px-2 py-1 rounded-lg truncate max-w-[160px]"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

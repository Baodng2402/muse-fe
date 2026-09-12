'use client';

import React from 'react';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';

interface AccountTabHeaderProps {
  title: string;
  count?: number;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function AccountTabHeader({
  title,
  count,
  description,
  action,
}: AccountTabHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/40">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>
          {count !== undefined && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <PlusIcon weight="bold" className="size-3.5" />
            <span>{action.label}</span>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={action.onClick}
            className="rounded-xl bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer shrink-0 h-8 px-3 text-xs"
          >
            <PlusIcon weight="bold" className="size-3.5 mr-1" />
            <span>{action.label}</span>
          </Button>
        )
      )}
    </div>
  );
}

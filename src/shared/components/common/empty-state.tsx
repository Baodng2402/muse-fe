'use client';

import React from 'react';
import Link from 'next/link';
import { TrayIcon } from '@phosphor-icons/react/dist/ssr';
import { buttonVariants } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/utils';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = TrayIcon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-border/70 bg-card/40 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground shadow-sm mb-4">
        <Icon className="h-7 w-7 text-primary/80" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action.href ? (
            <Link
              href={action.href}
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

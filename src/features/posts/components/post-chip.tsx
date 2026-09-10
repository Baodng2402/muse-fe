import React from 'react';
import { cn } from '@/src/shared/utils';

interface PostChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function PostChip({ active, onClick, children }: PostChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold transition-all select-none',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-xs shadow-primary/20 scale-[1.02]'
          : 'border-border/80 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40'
      )}
    >
      {children}
    </button>
  );
}

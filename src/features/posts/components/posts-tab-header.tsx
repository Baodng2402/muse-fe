'use client';

import React from 'react';
import { GridFourIcon, ListDashesIcon } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/src/shared/utils';

export type ViewMode = '2-col' | '1-col';
export type ActiveTab = 'tim-mau' | 'nhan-booking';

interface PostsTabHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  modelCount: number;
  proCount: number;
}

export function PostsTabHeader({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  modelCount,
  proCount,
}: PostsTabHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 1. Header & View Mode Switcher */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
            {activeTab === 'tim-mau' ? 'Kèo Tuyển Mẫu Thực Hành' : 'Thợ Làm Đẹp & Nhiếp Ảnh'}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block sm:text-sm">
            Kết nối trực tiếp thợ makeup, nail, nhiếp ảnh gia với mẫu & khách hàng tại Việt Nam.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange('2-col')}
            title="Xem dạng lưới 2 cột"
            className={cn(
              'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
              viewMode === '2-col'
                ? 'bg-background text-foreground shadow-sm shadow-black/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <GridFourIcon weight={viewMode === '2-col' ? 'fill' : 'regular'} className="size-4" />
            <span className="hidden xs:inline text-[11px]">2 cột</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('1-col')}
            title="Xem dạng danh sách 1 cột"
            className={cn(
              'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
              viewMode === '1-col'
                ? 'bg-background text-foreground shadow-sm shadow-black/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <ListDashesIcon weight={viewMode === '1-col' ? 'bold' : 'regular'} className="size-4" />
            <span className="hidden xs:inline text-[11px]">1 cột</span>
          </button>
        </div>
      </div>

      {/* 2. Segmented Tab Switcher */}
      <div className="flex w-full rounded-xl border border-border/70 bg-muted/50 p-1 shadow-xs">
        <button
          type="button"
          onClick={() => onTabChange('tim-mau')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all sm:text-sm',
            activeTab === 'tim-mau'
              ? 'bg-background text-foreground shadow-xs shadow-black/5'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="truncate">Tìm mẫu thực hành</span>
          <span
            className={cn(
              'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
              activeTab === 'tim-mau'
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {modelCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('nhan-booking')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all sm:text-sm',
            activeTab === 'nhan-booking'
              ? 'bg-background text-foreground shadow-xs shadow-black/5'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="truncate">Thợ chuyên nghiệp</span>
          <span
            className={cn(
              'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
              activeTab === 'nhan-booking'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {proCount}
          </span>
        </button>
      </div>
    </div>
  );
}

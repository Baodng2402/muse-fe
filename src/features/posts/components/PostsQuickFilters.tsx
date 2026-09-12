'use client';

import React from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FadersHorizontalIcon,
  CaretUpIcon,
  CaretDownIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/src/shared/utils';
import { PostChip } from './post-chip';
import type { PostType } from '../types';

export type BenefitFilter = 'all' | 'free' | 'stipend';

export interface FilterOption {
  id: string;
  name: string;
}

interface PostsQuickFiltersProps {
  activeTab: PostType;
  specialties: FilterOption[];
  activeSpecialtyId: string;
  onSpecialtyChange: (id: string) => void;
  regions: FilterOption[];
  activeRegionId: string;
  onRegionChange: (id: string) => void;
  activeBenefit: BenefitFilter;
  onBenefitChange: (benefit: BenefitFilter) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  activeFiltersCount: number;
  onResetFilters: () => void;
}

export function PostsQuickFilters({
  activeTab,
  specialties,
  activeSpecialtyId,
  onSpecialtyChange,
  regions,
  activeRegionId,
  onRegionChange,
  activeBenefit,
  onBenefitChange,
  isFilterOpen,
  onToggleFilter,
  activeFiltersCount,
  onResetFilters,
}: PostsQuickFiltersProps) {
  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      {/* Quick Search Shortcut + Button mở bộ lọc nâng cao */}
      <div className="flex items-center gap-2 w-full min-w-0">
        <Link
          href="/search"
          className="flex flex-1 min-w-0 items-center gap-2 rounded-xl border border-input bg-card py-2 px-3 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground shadow-2xs"
        >
          <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {activeTab === 'tim-mau'
              ? 'Tìm kiếm kèo theo layout, tone makeup, quận huyện...'
              : 'Tìm kiếm thợ makeup, nail, nhiếp ảnh gia...'}
          </span>
        </Link>

        <button
          type="button"
          onClick={onToggleFilter}
          title="Mở bộ lọc chi tiết"
          className={cn(
            'flex h-8.5 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold transition-colors',
            isFilterOpen || activeFiltersCount > 0
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input bg-card text-foreground hover:bg-muted/50'
          )}
        >
          <FadersHorizontalIcon className="size-4 shrink-0" />
          <span className="hidden sm:inline">Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
          {isFilterOpen ? (
            <CaretUpIcon className="size-3 shrink-0" />
          ) : (
            <CaretDownIcon className="size-3 shrink-0" />
          )}
        </button>
      </div>

      {/* Thanh Chip Cuộn Ngang */}
      <div className="w-full max-w-full min-w-0 overflow-x-auto py-1 no-scrollbar [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]">
        <div className="flex items-center gap-1.5 w-max">
          <PostChip
            active={activeSpecialtyId === 'all' && activeBenefit === 'all' && activeRegionId === 'all'}
            onClick={onResetFilters}
          >
            Tất cả
          </PostChip>

          {activeTab === 'tim-mau' && (
            <>
              <PostChip
                active={activeBenefit === 'free'}
                onClick={() => onBenefitChange(activeBenefit === 'free' ? 'all' : 'free')}
              >
                Miễn phí
              </PostChip>
              <PostChip
                active={activeBenefit === 'stipend'}
                onClick={() => onBenefitChange(activeBenefit === 'stipend' ? 'all' : 'stipend')}
              >
                Có thù lao
              </PostChip>
            </>
          )}

          {specialties.map((s) => (
            <PostChip
              key={s.id}
              active={activeSpecialtyId === s.id}
              onClick={() => onSpecialtyChange(activeSpecialtyId === s.id ? 'all' : s.id)}
            >
              {s.name}
            </PostChip>
          ))}

          {regions.map((r) => (
            <PostChip
              key={r.id}
              active={activeRegionId === r.id}
              onClick={() => onRegionChange(activeRegionId === r.id ? 'all' : r.id)}
            >
              {r.name}
            </PostChip>
          ))}
        </div>
      </div>
    </div>
  );
}

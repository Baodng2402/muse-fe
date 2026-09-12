'use client';

import React from 'react';
import { cn } from '@/src/shared/utils';
import { CATEGORIES, CITIES, type CategoryId, type CityId, type PostType } from '../types';
import type { BenefitFilter } from './posts-quick-filters';

interface PostsFilterDrawerProps {
  isOpen: boolean;
  activeTab: PostType;
  activeCategory: 'all' | CategoryId;
  onCategoryChange: (category: 'all' | CategoryId) => void;
  activeCity: 'all' | CityId;
  onCityChange: (city: 'all' | CityId) => void;
  activeBenefit: BenefitFilter;
  onBenefitChange: (benefit: BenefitFilter) => void;
  activeFiltersCount: number;
  onResetFilters: () => void;
}

export function PostsFilterDrawer({
  isOpen,
  activeTab,
  activeCategory,
  onCategoryChange,
  activeCity,
  onCityChange,
  activeBenefit,
  onBenefitChange,
  activeFiltersCount,
  onResetFilters,
}: PostsFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tùy chọn lọc chi tiết
        </span>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Filter: Dịch vụ */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Dịch vụ
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              Tất cả dịch vụ
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategoryChange(c.id)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  activeCategory === c.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter: Khu vực */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Khu vực
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCityChange('all')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                activeCity === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              Tất cả khu vực
            </button>
            {CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onCityChange(c.id)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  activeCity === c.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter: Quyền lợi (nếu tab tìm mẫu) */}
        {activeTab === 'tim-mau' && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quyền lợi mẫu
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onBenefitChange('all')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  activeBenefit === 'all'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                Tất cả quyền lợi
              </button>
              <button
                type="button"
                onClick={() => onBenefitChange('free')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  activeBenefit === 'free'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                Miễn phí 100%
              </button>
              <button
                type="button"
                onClick={() => onBenefitChange('stipend')}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  activeBenefit === 'stipend'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                Có thù lao
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { cn } from '@/src/shared/utils';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/src/shared/components/ui/Modal';
import { Button } from '@/src/shared/components/ui/Button';
import type { PostType } from '../types';
import type { BenefitFilter, FilterOption } from './PostsQuickFilters';

interface PostsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PostType;
  specialties: FilterOption[];
  activeSpecialtyId: string;
  onSpecialtyChange: (id: string) => void;
  regions: FilterOption[];
  activeRegionId: string;
  onRegionChange: (id: string) => void;
  activeBenefit: BenefitFilter;
  onBenefitChange: (benefit: BenefitFilter) => void;
  activeFiltersCount: number;
  onResetFilters: () => void;
}

export function PostsFilterDrawer({
  isOpen,
  onClose,
  activeTab,
  specialties,
  activeSpecialtyId,
  onSpecialtyChange,
  regions,
  activeRegionId,
  onRegionChange,
  activeBenefit,
  onBenefitChange,
  activeFiltersCount,
  onResetFilters,
}: PostsFilterDrawerProps) {
  const filterContent = (
    <div className="flex flex-col gap-4">
      {/* Filter: Dịch vụ */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dịch vụ
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSpecialtyChange('all')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
              activeSpecialtyId === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            )}
          >
            Tất cả dịch vụ
          </button>
          {specialties.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSpecialtyChange(s.id)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                activeSpecialtyId === s.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {s.name}
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
            onClick={() => onRegionChange('all')}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
              activeRegionId === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            )}
          >
            Tất cả khu vực
          </button>
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRegionChange(r.id)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                activeRegionId === r.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {r.name}
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

      {activeFiltersCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="self-start"
        >
          Xóa bộ lọc ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Bottom Sheet via Modal */}
      <div className="sm:hidden">
        <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Tùy chọn lọc chi tiết</ModalTitle>
            </ModalHeader>
            {filterContent}
          </ModalContent>
        </Modal>
      </div>

      {/* Desktop: Inline collapsible panel */}
      {isOpen && (
        <div className="hidden sm:block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
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
          <div className="mt-4">
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}

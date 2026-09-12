'use client';

import { useMemo } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { cn } from '@/src/shared/utils';

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalRecords?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
}

/**
 * Generates an array of page numbers and ellipsis strings.
 * e.g., [1, '...', 4, 5, 6, '...', 10]
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show page 1
  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  totalRecords,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className,
  showPageSizeSelector = true,
}: PaginationProps) {
  const pageNumbers = useMemo(() => generatePageNumbers(page, totalPages), [page, totalPages]);

  if (totalPages <= 1 && (!totalRecords || totalRecords <= (pageSize || 10))) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 select-none',
        className
      )}
    >
      {/* Records counter */}
      {totalRecords !== undefined && (
        <div className="text-xs text-muted-foreground">
          Tổng cộng <span className="font-semibold text-foreground">{totalRecords}</span> bài đăng
          {totalPages > 1 && (
            <span>
              {' '}
              · Trang <span className="font-semibold text-foreground">{page}</span>/{totalPages}
            </span>
          )}
        </div>
      )}

      {/* Page navigation controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Trang trước"
          className="h-8 px-2.5 rounded-xl text-xs gap-1"
        >
          <CaretLeftIcon size={14} weight="bold" />
          <span className="hidden sm:inline">Trước</span>
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-xs text-muted-foreground">
                •••
              </span>
            );
          }

          const isCurrent = item === page;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'min-w-8 h-8 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                isCurrent
                  ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20 scale-105'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item}
            </button>
          );
        })}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Trang sau"
          className="h-8 px-2.5 rounded-xl text-xs gap-1"
        >
          <span className="hidden sm:inline">Sau</span>
          <CaretRightIcon size={14} weight="bold" />
        </Button>
      </div>

      {/* Page Size Selector */}
      {showPageSizeSelector && onPageSizeChange && pageSize && (
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8.5 rounded-xl border border-input bg-background py-1 px-2.5 text-xs sm:text-sm font-medium text-foreground outline-none focus-visible:border-primary cursor-pointer shadow-2xs"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt} className="py-1 text-xs sm:text-sm">
                {opt} / trang
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

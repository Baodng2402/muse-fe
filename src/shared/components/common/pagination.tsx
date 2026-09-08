"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
        className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <CaretLeftIcon className="size-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-xs font-medium transition-colors tabular-nums",
            p === page
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Trang sau"
        className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <CaretRightIcon className="size-4" />
      </button>
    </nav>
  );
}

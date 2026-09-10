'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WarningCircleIcon, ArrowClockwiseIcon, HouseIcon } from '@phosphor-icons/react';
import { Button, buttonVariants } from '@/src/shared/components/ui/button';
import { ROUTES } from '@/src/core/config/routes';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level Error Boundary Page for Next.js App Router.
 * Catches unhandled errors within the current route segment and its children.
 */
export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Route Segment Error]:', error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-5 shadow-inner">
          <WarningCircleIcon size={36} weight="fill" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Có sự cố ngoài ý muốn
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Chúng mình đã ghi nhận sự cố này. Vui lòng thử tải lại trang hoặc quay lại trang chủ.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-left overflow-x-auto text-xs font-mono text-rose-600 dark:text-rose-400">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <ArrowClockwiseIcon size={16} weight="bold" />
            Thử lại
          </Button>

          <Link
            href={ROUTES.home}
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto inline-flex items-center justify-center gap-2",
            })}
          >
            <HouseIcon size={16} weight="bold" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

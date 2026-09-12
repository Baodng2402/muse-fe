import Link from 'next/link';
import { MagnifyingGlassIcon, HouseIcon } from '@phosphor-icons/react/dist/ssr';
import { buttonVariants } from '@/src/shared/components/ui/Button';
import { ROUTES } from '@/src/core/config/routes';

export default function NotFoundPage() {
  return (
    <div className="flex-1 min-h-[65vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8">
        <div className="text-7xl font-extrabold tracking-tighter text-slate-200 dark:text-slate-800 select-none">
          404
        </div>
        <div className="w-16 h-16 -mt-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800 shadow-sm">
          <MagnifyingGlassIcon size={32} weight="bold" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Không tìm thấy trang này
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={ROUTES.home}
            className={buttonVariants({
              className: "inline-flex items-center gap-2",
            })}
          >
            <HouseIcon size={16} weight="bold" />
            Về trang chủ
          </Link>

          <Link
            href={ROUTES.posts.list}
            className={buttonVariants({
              variant: "outline",
              className: "inline-flex items-center gap-2",
            })}
          >
            Khám phá tin đăng
          </Link>
        </div>
      </div>
    </div>
  );
}

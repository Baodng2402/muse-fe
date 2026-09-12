'use client';

import { useEffect, useState } from 'react';
import {
  CalendarBlankIcon,
  BookmarkSimpleIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { cn } from '@/src/shared/utils';
import type { Post } from '../types';

interface MobileStickyBookingBarProps {
  post: Post;
  onOpenBookingModal: () => void;
  onOpenShareModal: () => void;
  onToggleBookmark: () => void;
}

/**
 * Thanh CTA cố định đáy màn hình trên mobile.
 * Hiển thị giá/quyền lợi + nút Đặt lịch + Lưu + Chia sẻ.
 * Chỉ hiện trên viewport < 1024px (lg breakpoint), ẩn trên desktop vì đã có Sidebar.
 * Tự động trượt lên sau khi cuộn qua 300px (tránh che Hero ở đầu trang).
 */
export function MobileStickyBookingBar({
  post,
  onOpenBookingModal,
  onOpenShareModal,
  onToggleBookmark,
}: MobileStickyBookingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isModel = post.type === 'tim-mau';
  const priceLabel = isModel
    ? post.benefitTag || post.offer || 'Miễn phí'
    : post.priceDisplay || post.offer || 'Liên hệ';

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-t border-border/80 bg-background/95 backdrop-blur-xl shadow-[0_-2px_20px_rgba(0,0,0,0.08)]',
        'px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex items-center gap-2">
        {/* Price / Benefit label */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-muted-foreground leading-none">
            {isModel ? 'Quyền lợi mẫu' : 'Mức giá'}
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-foreground">
            {priceLabel}
          </p>
        </div>

        {/* Quick action icons */}
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label="Lưu tin"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 cursor-pointer shrink-0"
        >
          <BookmarkSimpleIcon className="size-[18px]" />
        </button>

        <button
          type="button"
          onClick={onOpenShareModal}
          aria-label="Chia sẻ"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 cursor-pointer shrink-0"
        >
          <ShareNetworkIcon className="size-[18px]" />
        </button>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={onOpenBookingModal}
          className="shrink-0 rounded-xl px-5 font-bold shadow-md shadow-primary/20"
        >
          <CalendarBlankIcon className="size-4 mr-1" />
          {isModel ? 'Ứng tuyển' : 'Đặt lịch'}
        </Button>
      </div>
    </div>
  );
}

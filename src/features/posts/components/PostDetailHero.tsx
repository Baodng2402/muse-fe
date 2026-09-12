'use client';

import React from 'react';
import Image from 'next/image';
import {
  CalendarBlankIcon,
  MapPinIcon,
  TagIcon,
  WarningCircleIcon,
  BookmarkSimpleIcon,
  ShareNetworkIcon,
  FlagIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/utils';
import { CATEGORIES, type Post } from '../types';

interface PostDetailHeroProps {
  post: Post;
  onOpenShareModal: () => void;
  onOpenReportModal: () => void;
  onToggleBookmark: () => void;
}

export function PostDetailHero({
  post,
  onOpenShareModal,
  onOpenReportModal,
  onToggleBookmark,
}: PostDetailHeroProps) {
  const category = CATEGORIES.find((item) => item.id === post.category);
  const CategoryIcon = category?.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Main image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={
            (post as { imageUrl?: string }).imageUrl ||
            (post.imageId
              ? `https://images.unsplash.com/${post.imageId}?w=1200&h=900&fit=crop&q=80&auto=format`
              : 'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=1200&h=900&fit=crop&q=80')
          }
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            post.type === 'tim-mau'
              ? 'bg-primary text-primary-foreground'
              : 'bg-foreground text-background'
          )}
        >
          {post.type === 'tim-mau' ? 'Tuyển mẫu thực hành' : 'Thợ chuyên nghiệp'}
        </span>
        {post.benefitTag && (
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {post.benefitTag}
          </span>
        )}
        {category && CategoryIcon && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CategoryIcon className="size-3.5" />
            {category.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {post.title}
      </h1>

      {/* Quick specs box */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border/80 bg-muted/30 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-2.5">
          <MapPinIcon className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-[11px] text-muted-foreground">Địa điểm</p>
            <p className="text-xs font-semibold text-foreground">{post.area}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <CalendarBlankIcon className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-[11px] text-muted-foreground">Thời gian hẹn</p>
            <p className="text-xs font-semibold text-foreground">{post.timeSlot || post.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <TagIcon className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-[11px] text-muted-foreground">
              {post.type === 'tim-mau' ? 'Quyền lợi mẫu' : 'Mức giá'}
            </p>
            <p className="text-xs font-semibold text-foreground">
              {post.priceDisplay || post.offer}
            </p>
          </div>
        </div>
      </div>

      {/* Slot availability for model recruitment */}
      {post.type === 'tim-mau' && post.slotsAvailable !== undefined && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
          <span className="font-semibold flex items-center gap-1.5">Tình trạng slot:</span>
          <span className="rounded-full bg-amber-500 text-white font-bold px-2.5 py-0.5 text-[11px]">
            Còn {post.slotsAvailable}/{post.slotsTotal || 2} suất đăng ký
          </span>
        </div>
      )}

      {/* Requirements for models */}
      {post.requirements && (
        <div className="rounded-2xl border border-border/80 bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Yêu cầu đối với mẫu
          </h2>
          <p className="mt-1.5 text-sm font-medium text-foreground">{post.requirements}</p>
        </div>
      )}

      {/* Description */}
      <div>
        <h2 className="text-sm font-bold text-foreground">Mô tả chi tiết</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground whitespace-pre-line">
          {post.description}
        </p>
      </div>

      {/* Action row — mobile only */}
      <div className="flex items-center gap-2 lg:hidden">
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleBookmark}
          className="flex-1"
        >
          <BookmarkSimpleIcon className="size-4 mr-1" />
          Lưu tin
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenShareModal}
          className="flex-1"
        >
          <ShareNetworkIcon className="size-4 mr-1" />
          Chia sẻ
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenReportModal}
          className="text-muted-foreground hover:text-destructive"
        >
          <FlagIcon className="size-4" />
        </Button>
      </div>

      {/* Safety note */}
      <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-4">
        <WarningCircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-5 text-muted-foreground">
          Muse khuyến khích bạn trao đổi rõ địa chỉ và nội dung buổi làm mẫu/chụp ảnh trước khi đến.
          Nếu phát hiện tin đăng có dấu hiệu không an toàn, vui lòng báo cáo ngay cho ban quản trị.
        </p>
      </div>
    </div>
  );
}

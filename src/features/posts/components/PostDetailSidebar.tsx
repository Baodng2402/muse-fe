'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  FlagIcon,
  PhoneIcon,
  ShareNetworkIcon,
  StarIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button, buttonVariants } from '@/src/shared/components/ui/button';
import { formatPhone, maskPhone } from '../utils/phone';
import type { Post } from '../types';

interface PostDetailSidebarProps {
  post: Post;
  authorUsername: string;
  isLoggedIn: boolean;
  onOpenBookingModal: () => void;
  onOpenShareModal: () => void;
  onOpenReportModal: () => void;
  onToggleBookmark: () => void;
}

export function PostDetailSidebar({
  post,
  authorUsername,
  isLoggedIn,
  onOpenBookingModal,
  onOpenShareModal,
  onOpenReportModal,
  onToggleBookmark,
}: PostDetailSidebarProps) {
  return (
    <aside className="sticky top-20 flex flex-col gap-5">
      {/* Author card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-full border border-border">
            <Image
              src={
                post.author.avatarId
                  ? `https://images.unsplash.com/${post.author.avatarId}?w=96&h=96&fit=crop&q=80&auto=format&crop=face`
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face'
              }
              alt={post.author.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">{post.author.name}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <StarIcon weight="fill" className="size-3 text-amber-500" />
              {post.author.rating} · {post.author.reviewCount} đánh giá
            </span>
          </div>
        </div>
        <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-3">
          <span className="inline-flex rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {post.author.level}
          </span>
          <Link
            href={`/profile/${authorUsername}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Xem portfolio →
          </Link>
        </div>
      </div>

      {/* Booking & Contact card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col gap-3.5">
        {isLoggedIn ? (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Số điện thoại liên hệ</p>
              <p className="text-lg font-bold tabular-nums text-foreground mt-0.5">
                {formatPhone(post.phone)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                onClick={onOpenBookingModal}
                className="w-full font-semibold shadow-md shadow-primary/15"
              >
                <CalendarBlankIcon className="size-4 mr-1.5" />
                {post.type === 'tim-mau' ? 'Đặt lịch làm mẫu ngay' : 'Đặt lịch hẹn ngay'}
              </Button>

              <a
                href={`tel:${post.phone}`}
                className={buttonVariants({ variant: 'outline', size: 'default' })}
              >
                <PhoneIcon className="size-4 mr-1.5" />
                Gọi trực tiếp
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Đăng nhập để xem số điện thoại và đặt lịch trực tiếp.
            </p>
            <p className="text-center text-sm tabular-nums text-muted-foreground font-mono bg-muted/50 py-1.5 rounded-lg">
              {maskPhone(post.phone)}
            </p>
            <Link
              href={`/auth?redirect=/posts/${post.id}`}
              className={buttonVariants({ variant: 'default', size: 'default' })}
            >
              Đăng nhập để liên hệ
            </Link>
          </div>
        )}
      </div>

      {/* Action buttons (desktop) */}
      <div className="flex items-center gap-2">
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
          title="Báo cáo vi phạm"
          className="text-muted-foreground hover:text-destructive"
        >
          <FlagIcon className="size-4" />
        </Button>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookmarkSimpleIcon,
  ClockIcon,
  CrownIcon,
  FireIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/src/shared/utils';
import { CATEGORIES, type Post } from '../types';

export function DetailedModelCard({
  post,
  onToggleBookmark,
}: {
  post: Post;
  onToggleBookmark?: (postId: string) => void;
}) {
  const category = CATEGORIES.find((item) => item.id === post.category);
  const categoryLabel = category?.label || 'Dịch vụ';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 1. Ảnh với badges gom gọn */}
      <Link href={`/posts/${post.id}`} className="relative aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={
            (post as { imageUrl?: string }).imageUrl ||
            (post.imageId
              ? `https://images.unsplash.com/${post.imageId}?w=640&h=360&fit=crop&q=80&auto=format`
              : 'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=640&h=360&fit=crop&q=80')
          }
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

        {/* Top: Gom Benefit Tag và Urgent Tag thành 1 cụm thống nhất */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-0.8 text-[11px] font-bold shadow-xs backdrop-blur-md',
              post.benefitType === 'stipend'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            )}
          >
            {post.isUrgent && <FireIcon weight="fill" className="size-3" />}
            {post.benefitTag || post.offer}
          </span>
          {post.isUrgent && (
            <span className="rounded-full bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
              Kèo gấp
            </span>
          )}
        </div>

        {/* Bottom bar gom giờ hẹn + slot thành 1 thanh mỏng */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] backdrop-blur-md">
            <ClockIcon weight="bold" className="size-3.5 text-primary-foreground" />
            {post.timeSlot || post.date}
          </span>
          {post.slotsAvailable !== undefined && (
            <span className="rounded-lg bg-black/60 px-2 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
              Còn {post.slotsAvailable}/{post.slotsTotal || 2} slot
            </span>
          )}
        </div>
      </Link>

      {/* 2. Thân Card */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-full border border-border">
              <Image
                src={
                  post.author.avatarId
                    ? `https://images.unsplash.com/${post.author.avatarId}?w=48&h=48&fit=crop&q=80&auto=format&crop=face`
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face'
                }
                alt={post.author.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-foreground">
              {post.author.name}
            </span>
            <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
              {post.author.level}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
            <StarIcon weight="fill" className="size-3 text-amber-500" />
            {post.author.rating}
          </span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h3 className="mt-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Requirements */}
        {post.requirements && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            <span className="font-semibold text-foreground/80">Yêu cầu:</span>{' '}
            {post.requirements}
          </p>
        )}

        {/* 3. Footer Row: Địa điểm + Action Pair (Bookmark + Ứng tuyển) */}
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-2.5">
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPinIcon className="size-3 text-primary shrink-0" />
              {post.area}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-medium">
              {categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleBookmark?.(post.id);
              }}
              title="Lưu tin này"
              className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <BookmarkSimpleIcon className="size-4" />
            </button>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
            >
              Ứng tuyển
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DetailedProCard({
  post,
  onToggleBookmark,
}: {
  post: Post;
  onToggleBookmark?: (postId: string) => void;
}) {
  const category = CATEGORIES.find((item) => item.id === post.category);
  const categoryLabel = category?.label || 'Dịch vụ';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="relative aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={
            (post as { imageUrl?: string }).imageUrl ||
            (post.imageId
              ? `https://images.unsplash.com/${post.imageId}?w=640&h=360&fit=crop&q=80&auto=format`
              : 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=640&h=360&fit=crop&q=80')
          }
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-foreground/90 px-2.5 py-0.8 text-[11px] font-bold text-background shadow-md">
          <CrownIcon weight="fill" className="size-3.5 text-amber-400" />
          Thợ Pro
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold text-white">
          <span className="rounded-lg bg-primary/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            {post.priceDisplay || post.offer}
          </span>
          <span className="rounded-lg bg-black/60 px-2 py-0.8 text-[10px] backdrop-blur-md">
            {categoryLabel}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-2">
          <div className="relative size-6 overflow-hidden rounded-full border border-border">
            <Image
              src={
                post.author.avatarId
                  ? `https://images.unsplash.com/${post.author.avatarId}?w=48&h=48&fit=crop&q=80&auto=format&crop=face`
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face'
              }
              alt={post.author.name}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-foreground">
                {post.author.name}
              </span>
              <CheckCircleIcon weight="fill" className="size-3 text-blue-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">{post.author.level}</p>
          </div>
          <span className="ml-auto flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
            <StarIcon weight="fill" className="size-3 text-amber-500" />
            {post.author.rating} ({post.author.reviewCount})
          </span>
        </div>

        <Link href={`/posts/${post.id}`}>
          <h3 className="mt-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Footer Row: Địa điểm + CỤM 2 NÚT HÀI HÒA (Bookmark + Đặt lịch) */}
        <div className="mt-auto border-t border-border/50 pt-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPinIcon className="size-3 text-primary shrink-0" />
            {post.area}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleBookmark?.(post.id);
              }}
              title="Lưu thợ này"
              className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <BookmarkSimpleIcon className="size-4" />
            </button>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
            >
              Đặt lịch
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

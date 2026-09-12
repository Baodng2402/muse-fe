'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ClockIcon,
  FireIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn, getInitials } from '@/src/shared/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/Avatar';
import type { Post } from '../types';

interface CompactPostCardProps {
  post: Post;
  onToggleBookmark?: (postId: string) => void;
}

export function CompactPostCard({ post, onToggleBookmark }: CompactPostCardProps) {
  const isModel = post.type === 'tim-mau';
  const [justSaved, setJustSaved] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleBookmark?.(post.id);
    if (!post.isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 700);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
        {/* Visual image container — tỉ lệ chuẩn 4:5 cho card feed (xem quy tắc ở globals.css) */}
        <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
          <Image
            src={post.imageUrl!}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Top: Combined Benefit & Urgent Tag */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md',
                isModel
                  ? post.benefitType === 'stipend'
                    ? 'bg-amber-500/95 text-white'
                    : 'bg-emerald-600/95 text-white'
                  : 'bg-primary/95 text-white'
              )}
            >
              {isModel && post.isUrgent && <FireIcon weight="fill" className="size-2.5" />}
              {isModel ? post.benefitTag || post.offer : post.priceDisplay || post.offer}
            </span>

            <div className="flex items-center gap-1">
              {!isModel && post.author.rating != null && (
                <span className="flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  <StarIcon weight="fill" className="size-2.5 text-amber-400" />
                  {post.author.rating}
                </span>
              )}

              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  aria-label={post.isSaved ? 'Bỏ lưu tin' : 'Lưu tin này'}
                  className="relative flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-90 cursor-pointer"
                >
                  <HeartIcon
                    weight={post.isSaved ? 'fill' : 'regular'}
                    className={cn('size-4', post.isSaved && 'text-rose-400')}
                  />
                  <AnimatePresence>
                    {justSaved && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0.9 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <HeartIcon weight="fill" className="size-5 text-rose-400" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}
            </div>
          </div>

          {/* Bottom on-image: Single sleek row */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-medium text-white">
            <span className="truncate flex items-center gap-1.5 drop-shadow-sm">
              <ClockIcon weight="bold" className="size-3.5 shrink-0 text-white" />
              {post.timeSlot ? post.timeSlot.split(',')[0] : post.date}
            </span>
            {isModel && post.slotsAvailable !== undefined && (
              <span className="shrink-0 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
                {post.slotsAvailable} slot
              </span>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
          {/* Author row */}
          <div className="flex items-center gap-2">
            <Avatar className="size-5 sm:size-6 border border-border shrink-0">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback className="text-[10px]">{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs font-medium text-foreground">
              {post.author.name}
            </span>
            {isModel ? (
              post.author.rating != null && (
                <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                  <StarIcon weight="fill" className="size-3 text-amber-500" />
                  {post.author.rating}
                </span>
              )
            ) : (
              <CheckCircleIcon weight="fill" className="size-3.5 text-blue-500 ml-auto shrink-0" />
            )}
          </div>

          {/* Title with guaranteed min-height for uniform baseline */}
          <h3 className="mt-2 text-[13px] sm:text-sm font-semibold leading-snug text-foreground line-clamp-2 min-h-[2.5rem]">
            {post.title}
          </h3>

          {/* Footer row: Location + Compact CTA pinned at bottom */}
          <div className="mt-auto pt-3 flex items-center justify-between text-xs border-t border-border/50">
            <span className="truncate text-muted-foreground flex items-center gap-1">
              <MapPinIcon className="size-3.5 text-primary shrink-0" />
              {post.area ? post.area.split(',')[0] : 'Toàn quốc'}
            </span>
            <span className="font-bold text-primary group-hover:underline text-[11px] sm:text-xs">
              {isModel ? 'Ứng tuyển' : 'Xem thợ'} →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClockIcon,
  FireIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/src/shared/utils';
import type { Post } from '../types';

export function CompactPostCard({ post }: { post: Post }) {
  const isModel = post.type === 'tim-mau';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
        {/* Visual image container — tỉ lệ 3:4 */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
          <Image
            src={
              (post as { imageUrl?: string }).imageUrl ||
              (post.imageId
                ? `https://images.unsplash.com/${post.imageId}?w=400&h=533&fit=crop&q=80&auto=format`
                : 'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=400&h=533&fit=crop&q=80')
            }
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

            {!isModel && (
              <span className="flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <StarIcon weight="fill" className="size-2.5 text-amber-400" />
                {post.author.rating}
              </span>
            )}
          </div>

          {/* Bottom on-image: Single sleek row */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-medium text-white/95">
            <span className="truncate flex items-center gap-1">
              <ClockIcon weight="bold" className="size-3 shrink-0 text-white" />
              {post.timeSlot ? post.timeSlot.split(',')[0] : post.date}
            </span>
            {isModel && post.slotsAvailable !== undefined && (
              <span className="shrink-0 rounded-md bg-black/50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                {post.slotsAvailable} slot
              </span>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex flex-1 flex-col p-2.5">
          {/* Author row */}
          <div className="flex items-center gap-1.5">
            <div className="relative size-4.5 overflow-hidden rounded-full border border-border shrink-0">
              <Image
                src={
                  post.author.avatarId
                    ? `https://images.unsplash.com/${post.author.avatarId}?w=36&h=36&fit=crop&q=80&auto=format&crop=face`
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=36&h=36&fit=crop&crop=face'
                }
                alt={post.author.name}
                fill
                sizes="18px"
                className="object-cover"
              />
            </div>
            <span className="truncate text-[11px] font-medium text-foreground">
              {post.author.name}
            </span>
            {isModel ? (
              <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
                <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                {post.author.rating}
              </span>
            ) : (
              <CheckCircleIcon weight="fill" className="size-3 text-blue-500 ml-auto shrink-0" />
            )}
          </div>

          {/* Title */}
          <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground line-clamp-2">
            {post.title}
          </h3>

          {/* Footer row: Location + Compact CTA */}
          <div className="mt-auto pt-2 flex items-center justify-between text-[10px] border-t border-border/40">
            <span className="truncate text-muted-foreground flex items-center gap-0.5">
              <MapPinIcon className="size-3 text-primary shrink-0" />
              {post.area ? post.area.split(',')[0] : 'Toàn quốc'}
            </span>
            <span className="font-bold text-primary group-hover:underline">
              {isModel ? 'Ứng tuyển' : 'Xem thợ'} →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

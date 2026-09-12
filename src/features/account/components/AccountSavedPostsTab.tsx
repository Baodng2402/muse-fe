'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookmarkSimpleIcon, MapPinIcon } from '@phosphor-icons/react/dist/ssr';
import { EmptyState } from '@/src/shared/components/common/empty-state';
import type { Post } from '@/src/features/posts/types';

interface AccountSavedPostsTabProps {
  savedPosts: Post[];
  isLoading: boolean;
  onRemoveSaved: (postId: string) => void;
}

export function AccountSavedPostsTab({
  savedPosts,
  isLoading,
  onRemoveSaved,
}: AccountSavedPostsTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <EmptyState
        title="Chưa có bài đăng nào được lưu"
        description="Nhấn biểu tượng bookmark trên các bài đăng bạn quan tâm để lưu và xem lại tại đây bất cứ lúc nào."
        action={{
          label: 'Khám phá bài đăng ngay',
          href: '/posts',
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {savedPosts.map((post) => (
        <div
          key={post.id}
          className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <Link href={`/posts/${post.id}`} className="flex flex-1 items-center gap-3 min-w-0">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={
                  (post as { imageUrl?: string }).imageUrl ||
                  (post.imageId
                    ? `https://images.unsplash.com/${post.imageId}?w=120&h=120&fit=crop&q=80`
                    : 'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=120&h=120&fit=crop&q=80')
                }
                alt={post.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[9px] font-bold text-primary">
                  {post.type === 'tim-mau' ? 'Tuyển mẫu' : 'Thợ pro'}
                </span>
                <span className="text-[10px] text-muted-foreground">{post.author.name}</span>
              </div>
              <h3 className="mt-0.5 truncate text-xs font-bold text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground truncate mt-0.5">
                <MapPinIcon className="size-3 text-primary shrink-0" />
                {post.area}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => onRemoveSaved(post.id)}
            title="Bỏ lưu bài này"
            className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer"
          >
            <BookmarkSimpleIcon weight="fill" className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

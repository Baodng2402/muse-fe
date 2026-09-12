'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon, TrashIcon, MapPinIcon } from '@phosphor-icons/react/dist/ssr';
import { EmptyState } from '@/src/shared/components/common/empty-state';
import { useDeletePostMutation } from '@/src/features/posts/hooks/use-posts';
import type { Post } from '@/src/features/posts/types';

interface AccountMyPostsTabProps {
  myPosts: Post[];
  isLoading?: boolean;
}

export function AccountMyPostsTab({ myPosts, isLoading }: AccountMyPostsTabProps) {
  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation();

  const handleDelete = (postId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) {
      deletePost(postId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (myPosts.length === 0) {
    return (
      <EmptyState
        title="Bạn chưa có bài đăng nào"
        description="Đăng tin tuyển mẫu thực hành makeup, nail hoặc quảng bá dịch vụ làm đẹp / chụp ảnh ngay hôm nay!"
        action={{
          label: 'Tạo bài đăng mới',
          href: '/posts/new',
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end pb-1">
        <Link
          href="/posts/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <PlusIcon weight="bold" className="size-3.5" />
          Đăng tin mới
        </Link>
      </div>

      {myPosts.map((post) => (
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
                <span className="text-[10px] text-muted-foreground">{post.offer}</span>
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
            onClick={() => handleDelete(post.id)}
            disabled={isDeleting}
            title="Xóa bài đăng"
            className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

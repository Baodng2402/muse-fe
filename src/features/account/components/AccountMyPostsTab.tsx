'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon, TrashIcon, MapPinIcon } from '@phosphor-icons/react/dist/ssr';
import { AccountTabHeader } from './AccountTabHeader';
import { EmptyState } from '@/src/shared/components/common/EmptyState';
import { useDeletePostMutation } from '@/src/features/posts/hooks/usePosts';
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

  return (
    <div className="flex flex-col gap-4">
      <AccountTabHeader
        title="Bài đăng của bạn"
        count={myPosts.length}
        description="Quản lý tin tuyển mẫu và tin cung cấp dịch vụ của bạn trên Muse."
        action={{
          label: 'Đăng tin mới',
          href: '/posts/new',
        }}
      />

      {myPosts.length === 0 ? (
        <EmptyState
          title="Bạn chưa có bài đăng nào"
          description="Đăng tin tuyển mẫu thực hành makeup, nail hoặc quảng bá dịch vụ làm đẹp / chụp ảnh ngay hôm nay!"
          action={{
            label: 'Tạo bài đăng mới ngay',
            href: '/posts/new',
          }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {myPosts.map((post) => (
        <div
          key={post.id}
          className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <Link href={`/posts/${post.id}`} className="flex flex-1 items-center gap-3 min-w-0">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={post.imageUrl!}
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
  )}
</div>
);
}

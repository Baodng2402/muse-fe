'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery } from '@/src/features/posts/hooks/usePosts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { EmptyState } from '@/src/shared/components/common/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/Avatar';
import { getInitials } from '@/src/shared/utils';

export function UrgentModelFeed() {
  const { data: postsData, isLoading } = usePostsQuery({
    type: 'find_model',
    page: 1,
    page_size: 4,
  });

  const posts = useMemo(() => {
    const rawList = Array.isArray(postsData) ? postsData : postsData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.slice(0, 4).map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [postsData]);

  return (
    <section>
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Tuyển mẫu hôm nay
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
            Kèo thực hành hot cần slot
          </h2>
        </div>

        <Link
          href="/posts"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Xem tất cả
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-60 rounded-2xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Chưa có kèo tuyển mẫu nào"
          description="Hãy là người đầu tiên đăng tin tuyển mẫu thực hành makeup hoặc nail hôm nay!"
          action={{
            label: 'Đăng tin tuyển mẫu ngay',
            href: '/posts/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => {
            return (
              <article
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
                  {/* Media Container — tỉ lệ chuẩn 4:5 cho card feed */}
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
                    <Image
                      src={post.imageUrl!}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Top: Benefit Tag */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md ${
                          post.benefitType === 'stipend' ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                      >
                        {post.benefitTag || post.offer}
                      </span>

                      {post.isUrgent && (
                        <span className="rounded-full bg-rose-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                          Gấp
                        </span>
                      )}
                    </div>

                    {/* Bottom on-image: Time & Slot */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-medium text-white/95">
                      <span className="truncate flex items-center gap-1">
                        <ClockIcon weight="bold" className="size-3 shrink-0 text-white" />
                        {post.timeSlot ? post.timeSlot.split(',')[0] : post.date}
                      </span>
                      {post.slotsAvailable !== undefined && (
                        <span className="shrink-0 rounded-md bg-black/50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                          {post.slotsAvailable} slot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-2.5">
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs" className="border border-border shrink-0">
                        <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                        <AvatarFallback className="text-[8px]">{getInitials(post.author.name)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate text-[11px] font-medium text-foreground">
                        {post.author.name}
                      </span>
                      {post.author.rating != null && (
                        <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                          {post.author.rating}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="mt-auto pt-2 flex items-center justify-between text-[10px] border-t border-border/40">
                      <span className="truncate text-muted-foreground flex items-center gap-0.5">
                        <MapPinIcon className="size-3 text-primary shrink-0" />
                        {post.area ? post.area.split(',')[0] : 'Toàn quốc'}
                      </span>
                      <span className="font-bold text-primary group-hover:underline">
                        Ứng tuyển →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

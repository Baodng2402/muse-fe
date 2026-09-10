'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CrownIcon,
  CheckCircleIcon,
  MapPinIcon,
  StarIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery } from '@/src/features/posts/hooks/use-posts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';

export function FeaturedArtistsSection() {
  const { data: bookingData, isLoading } = usePostsQuery({
    type: 'booking',
    page: 1,
    page_size: 4,
  });

  const pros = useMemo(() => {
    const rawList = Array.isArray(bookingData) ? bookingData : bookingData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.slice(0, 2).map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [bookingData]);

  if (!isLoading && pros.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border/80 bg-muted/20 p-4 sm:p-6">
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <CrownIcon weight="fill" className="size-3.5" />
            Dịch vụ chuyên nghiệp
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
            Thợ Pro có portfolio nổi bật
          </h2>
        </div>

        <Link href="/posts" className="text-xs font-bold text-primary hover:underline">
          Tất cả thợ →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pros.map((pro) => {
          const proImageSrc =
            pro.imageUrl ||
            (pro.imageId
              ? `https://images.unsplash.com/${pro.imageId}?w=160&h=160&fit=crop&q=80&auto=format`
              : 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=160&h=160&fit=crop&q=80');

          return (
            <Link
              key={pro.id}
              href={`/posts/${pro.id}`}
              className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={proImageSrc}
                  alt={pro.title}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs font-bold text-foreground">
                    {pro.author.name}
                  </span>
                  <CheckCircleIcon weight="fill" className="size-3 text-blue-500 shrink-0" />
                  <span className="ml-auto text-[10px] font-semibold text-amber-500 flex items-center gap-0.5">
                    <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                    {pro.author.rating}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-xs font-medium text-foreground/90">
                  {pro.title}
                </p>

                <p className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                  <MapPinIcon className="size-3 text-primary shrink-0" />
                  {pro.area}
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">
                    {pro.priceDisplay || pro.offer}
                  </span>
                  <span className="text-[10px] font-bold text-primary group-hover:underline">
                    Đặt lịch →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

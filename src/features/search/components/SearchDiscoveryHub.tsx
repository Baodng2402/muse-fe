'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClockCounterClockwiseIcon,
  CrownIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery, useSpecialtiesQuery } from '@/src/features/posts/hooks/usePosts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { SpecialtyIcon } from '@/src/features/posts/components/SpecialtyIcon';
import { EmptyState } from '@/src/shared/components/common/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/Avatar';
import { cn, getInitials } from '@/src/shared/utils';
import type { Specialty } from '@/src/core/api/types';

/** Ảnh nền trang trí theo tên chuyên ngành THẬT — chỉ để hiển thị, không phải dữ liệu. */
const SPECIALTY_TILE_IMAGES: Record<string, string> = {
  'Trang điểm': 'photo-1512496015851-a90fb38ba796',
  Nail: 'photo-1632345031435-8727f6897d53',
  'Chụp ảnh': 'photo-1643217427489-5a58ebbce99e',
};
const DEFAULT_TILE_IMAGE = 'photo-1522337360788-8b13dee7a37e';

interface SearchDiscoveryHubProps {
  recentSearches: string[];
  onSelectKeyword: (kw: string) => void;
  onRemoveRecent: (item: string) => void;
  onClearAllRecent: () => void;
}

export function SearchDiscoveryHub({
  recentSearches,
  onSelectKeyword,
  onRemoveRecent,
  onClearAllRecent,
}: SearchDiscoveryHubProps) {
  const { data: bookingData, isLoading: isLoadingArtists } = usePostsQuery({
    type: 'booking',
    page: 1,
    page_size: 3,
  });
  const { data: rawSpecialties = [] } = useSpecialtiesQuery();

  const featuredArtists = useMemo(() => {
    const rawList = Array.isArray(bookingData) ? bookingData : bookingData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.slice(0, 3).map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [bookingData]);

  const specialtyTiles = useMemo(
    () =>
      (rawSpecialties as Specialty[]).map((s) => {
        const id = s.id || s.ID;
        const name = s.name || s.Name || 'Khác';
        return {
          id,
          name,
          href: `/posts?specialty=${id}`,
          imageId: SPECIALTY_TILE_IMAGES[name] || DEFAULT_TILE_IMAGE,
        };
      }),
    [rawSpecialties]
  );

  return (
    <div className="mt-5 flex flex-col gap-6 sm:gap-8">
      {/* A. Lịch sử tìm kiếm gần đây — thật, do người dùng tự tìm, không có sẵn dữ liệu mẫu */}
      {recentSearches.length > 0 && (
        <section>
          <div className="flex items-center justify-between pb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ClockCounterClockwiseIcon className="size-3.5" />
              Tìm kiếm gần đây
            </span>
            <button
              type="button"
              onClick={onClearAllRecent}
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {recentSearches.map((item) => (
              <div
                key={item}
                className="group flex items-center gap-1 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => onSelectKeyword(item)}
                  className="text-left cursor-pointer"
                >
                  {item}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveRecent(item)}
                  aria-label={`Xóa ${item}`}
                  className="ml-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* B. Khám phá theo chuyên ngành — lấy thật từ /specialties, không phải danh mục cứng trong code */}
      <section>
        <h2 className="pb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Khám phá theo chuyên ngành
        </h2>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {specialtyTiles.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-stone-900 p-3 text-white shadow-xs transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <Image
                src={`https://images.unsplash.com/${tile.imageId}?w=400&h=300&fit=crop&q=80&auto=format`}
                alt={tile.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover filter brightness-[0.72] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 flex items-center gap-1.5">
                <SpecialtyIcon specialtyName={tile.name} weight="fill" className="size-3.5 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold leading-tight">{tile.name}</h3>
              </div>
            </Link>
          ))}

          <Link
            href="/posts?tab=nhan-booking"
            className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-stone-900 p-3 text-white shadow-xs transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image
              src={`https://images.unsplash.com/${DEFAULT_TILE_IMAGE}?w=400&h=300&fit=crop&q=80&auto=format`}
              alt="Thợ Pro & Dịch vụ"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover filter brightness-[0.6] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 flex items-center gap-1.5">
              <CrownIcon weight="fill" className="size-3.5 shrink-0 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold leading-tight">Thợ Pro & Dịch vụ</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* C. Gợi ý tìm kiếm — từ khóa gợi ý biên tập sẵn, KHÔNG gắn nhãn "xu hướng/trending" vì
          chưa có dữ liệu phân tích thật để chứng minh điều đó. */}
      <section>
        <div className="flex items-center gap-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <MagnifyingGlassIcon className="size-3.5 text-primary" />
          Gợi ý tìm kiếm
        </div>

        <div className="flex flex-wrap gap-2">
          {['Makeup tone Thái', 'Kèo Free 100%', 'Nail móng úp', 'Chụp lookbook', 'Makeup Douyin', 'Mẫu nail Katun'].map(
            (label) => (
              <button
                key={label}
                type="button"
                onClick={() => onSelectKeyword(label)}
                className={cn(
                  'rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-muted/30 active:scale-98 shadow-2xs cursor-pointer'
                )}
              >
                {label}
              </button>
            )
          )}
        </div>
      </section>

      {/* D. Nghệ nhân & Thợ nổi bật */}
      <section>
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Thợ & Studio nổi bật
            </h2>
            <p className="text-xs text-muted-foreground">
              Xem portfolio tác phẩm thực tế và liên hệ đặt lịch
            </p>
          </div>
          <Link href="/posts" className="text-xs font-semibold text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {isLoadingArtists ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : featuredArtists.length === 0 ? (
          <EmptyState
            title="Chưa có thợ Pro nào"
            description="Danh sách thợ chuyên nghiệp có portfolio sẽ hiển thị ở đây khi có dữ liệu."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {featuredArtists.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border border-border shrink-0">
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-xs font-bold text-foreground">
                        {post.author.name}
                      </span>
                      <CheckCircleIcon weight="fill" className="size-3 text-blue-500 shrink-0" />
                    </div>
                    <p className="text-[10px] font-medium text-primary truncate">
                      {post.author.level}
                    </p>
                    {post.author.rating != null && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                        <span className="font-semibold text-foreground">{post.author.rating}</span>
                        {post.author.reviewCount != null && <span>({post.author.reviewCount} đánh giá)</span>}
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.title}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
                  <span className="truncate text-muted-foreground flex items-center gap-0.5">
                    <MapPinIcon className="size-3 text-primary shrink-0" />
                    {post.area.split(',')[0]}
                  </span>
                  <Link
                    href={`/posts/${post.id}`}
                    className="font-bold text-primary hover:underline"
                  >
                    Xem portfolio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

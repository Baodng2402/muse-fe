import Image from 'next/image';
import Link from 'next/link';
import {
  ClockCounterClockwiseIcon,
  TrendUpIcon,
  CheckCircleIcon,
  MapPinIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/src/shared/utils';

export const TRENDING_KEYWORDS = [
  { id: '1', label: 'Makeup tone Thái', tag: 'makeup' },
  { id: '2', label: 'Kèo Free 100%', tag: 'free' },
  { id: '3', label: 'Nail móng úp', tag: 'nail' },
  { id: '4', label: 'Chụp lookbook hè', tag: 'photo' },
  { id: '5', label: 'Makeup Douyin', tag: 'makeup' },
  { id: '6', label: 'Mẫu nail Katun', tag: 'nail' },
];

export const EXPLORE_TILES = [
  {
    id: 'makeup',
    title: 'Makeup & Trang điểm',
    sub: 'Tone Thái, Douyin, Kỷ yếu, Cô dâu',
    imageId: 'photo-1512496015851-a90fb38ba796',
    href: '/posts?category=makeup',
  },
  {
    id: 'nail',
    title: 'Nail & Chăm sóc mi',
    sub: 'Nail box, Đắp gel, Nối mi Katun',
    imageId: 'photo-1632345031435-8727f6897d53',
    href: '/posts?category=nail',
  },
  {
    id: 'photo',
    title: 'Nhiếp ảnh & Lookbook',
    sub: 'Chân dung nghệ thuật, Ngoại cảnh',
    imageId: 'photo-1643217427489-5a58ebbce99e',
    href: '/posts?category=photo',
  },
  {
    id: 'pro',
    title: 'Thợ Pro & Dịch vụ',
    sub: 'Nghệ nhân có portfolio uy tín',
    imageId: 'photo-1730486559425-45221a85d6dd',
    href: '/posts',
  },
];

export const FEATURED_ARTISTS = [
  {
    name: 'Thanh Hương',
    username: 'thanhhuong.pro',
    category: 'Makeup Chuyên Nghiệp',
    area: 'TP. Thủ Đức, TP.HCM',
    rating: 5.0,
    reviews: 96,
    avatarId: 'photo-1544005313-94ddf0286df2',
    bio: 'Hơn 5 năm kinh nghiệm makeup cô dâu & sự kiện cao cấp.',
  },
  {
    name: 'Quang Đức',
    username: 'quangduc.photo',
    category: 'Nhiếp Ảnh Gia',
    area: 'Quận 3, TP.HCM',
    rating: 4.9,
    reviews: 67,
    avatarId: 'photo-1507003211169-0a1dd7228f2d',
    bio: 'Chuyên lookbook thời trang & ảnh chân dung nghệ thuật.',
  },
  {
    name: 'Minh Châu',
    username: 'minhchau.nails',
    category: 'Nail Artist',
    area: 'Bình Thạnh, TP.HCM',
    rating: 4.9,
    reviews: 42,
    avatarId: 'photo-1438761681033-6461ffad8d80',
    bio: 'Vẽ móng nghệ thuật phong cách Hàn - Nhật đính đá.',
  },
];

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
  return (
    <div className="mt-5 flex flex-col gap-6 sm:gap-8">
      {/* A. Lịch sử tìm kiếm gần đây */}
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

      {/* B. Xu hướng tìm kiếm hôm nay */}
      <section>
        <div className="flex items-center gap-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <TrendUpIcon weight="bold" className="size-3.5 text-primary" />
          Xu hướng thịnh hành
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TRENDING_KEYWORDS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectKeyword(item.label)}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2.5 text-left transition-all hover:border-primary/40 hover:bg-muted/30 active:scale-98 shadow-2xs cursor-pointer"
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold',
                  idx < 3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}
              >
                {idx + 1}
              </span>
              <span className="truncate text-xs font-semibold text-foreground">
                #{item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* C. Khám phá danh mục */}
      <section>
        <h2 className="pb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Khám phá theo danh mục
        </h2>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {EXPLORE_TILES.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-stone-900 p-3 text-white shadow-xs transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <Image
                src={`https://images.unsplash.com/${tile.imageId}?w=400&h=300&fit=crop&q=80&auto=format`}
                alt={tile.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover filter brightness-[0.72] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-xs sm:text-sm font-bold leading-tight">{tile.title}</h3>
                <p className="mt-0.5 text-[10px] text-white/80 line-clamp-1">{tile.sub}</p>
              </div>
            </Link>
          ))}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FEATURED_ARTISTS.map((artist) => (
            <div
              key={artist.username}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border">
                  <Image
                    src={`https://images.unsplash.com/${artist.avatarId}?w=100&h=100&fit=crop&q=80&auto=format&crop=face`}
                    alt={artist.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-bold text-foreground">
                      {artist.name}
                    </span>
                    <CheckCircleIcon weight="fill" className="size-3 text-blue-500 shrink-0" />
                  </div>
                  <p className="text-[10px] font-medium text-primary truncate">
                    {artist.category}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                    <span className="font-semibold text-foreground">{artist.rating}</span>
                    <span>({artist.reviews} đánh giá)</span>
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {artist.bio}
              </p>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
                <span className="truncate text-muted-foreground flex items-center gap-0.5">
                  <MapPinIcon className="size-3 text-primary shrink-0" />
                  {artist.area.split(',')[0]}
                </span>
                <Link
                  href={`/profile/${artist.username}`}
                  className="font-bold text-primary hover:underline"
                >
                  Xem portfolio →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

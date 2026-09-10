'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  ShareNetworkIcon,
  StarIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery } from '@/src/features/posts/hooks/use-posts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { PortfolioGallery, type GalleryItem } from '@/src/features/portfolio/components/portfolio-gallery';
import { useUserPortfolioQuery } from '@/src/features/portfolio/hooks/use-portfolio';
import { useAuthStore } from '@/src/shared/store/use-auth-store';
import { cn } from '@/src/shared/utils';

// Static profile metadata for artist showcase
const ARTIST_METADATA: Record<string, {
  name: string;
  username: string;
  title: string;
  area: string;
  bio: string;
  rating: number;
  reviewCount: number;
  avatarId: string;
  coverImageId: string;
  level: string;
  specialties: string[];
  phone: string;
  zaloPhone: string;
  instagram?: string;
  portfolio: GalleryItem[];
}> = {
  'thanhhuong.pro': {
    name: 'Thanh Hương',
    username: 'thanhhuong.pro',
    title: 'Makeup Artist Chuyên Nghiệp',
    area: 'TP. Thủ Đức, TP.HCM',
    bio: 'Hơn 5 năm kinh nghiệm trang điểm cô dâu, lookbook và tiệc cao cấp. Thường xuyên tuyển mẫu layout Douyin, Thái để làm mới portfolio.',
    rating: 5.0,
    reviewCount: 96,
    avatarId: 'photo-1544005313-94ddf0286df2',
    coverImageId: 'photo-1522337360788-8b13dee7a37e',
    level: 'Chuyên nghiệp',
    specialties: ['Makeup cô dâu', 'Layout Douyin', 'Makeup kỷ yếu'],
    phone: '0901234567',
    zaloPhone: '0901234567',
    instagram: 'thanhhuong.makeup',
    portfolio: [
      {
        id: '1',
        title: 'Tone Tây sắc sảo',
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=625&fit=crop&q=80',
        likes: 142,
      },
      {
        id: '2',
        title: 'Layout Douyin trong trẻo',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=625&fit=crop&q=80',
        likes: 98,
      },
      {
        id: '3',
        title: 'Makeup Cô dâu cổ điển',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=625&fit=crop&q=80',
        likes: 215,
      },
    ],
  },
  'quangduc.photo': {
    name: 'Quang Đức',
    username: 'quangduc.photo',
    title: 'Nhiếp Ảnh Gia & Retoucher',
    area: 'Quận 3, TP.HCM',
    bio: 'Chuyên chụp ảnh lookbook thời trang, chân dung nghệ thuật và phong cách đường phố.',
    rating: 4.9,
    reviewCount: 67,
    avatarId: 'photo-1507003211169-0a1dd7228f2d',
    coverImageId: 'photo-1643217427489-5a58ebbce99e',
    level: 'Chuyên nghiệp',
    specialties: ['Lookbook thời trang', 'Chân dung nghệ thuật', 'Ảnh phim'],
    phone: '0912345678',
    zaloPhone: '0912345678',
    instagram: 'quangduc.visual',
    portfolio: [
      {
        id: '4',
        title: 'Lookbook Hè 2026',
        imageUrl: 'https://images.unsplash.com/photo-1643217427489-5a58ebbce99e?w=500&h=625&fit=crop&q=80',
        likes: 88,
      },
    ],
  },
};

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export function ProfilePage({ username }: { username: string }) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'posts'>('portfolio');
  const [copied, setCopied] = useState(false);

  const profile = ARTIST_METADATA[username] || ARTIST_METADATA['thanhhuong.pro'];
  const isOwner = currentUser?.id === username || currentUser?.email?.includes(username);

  const targetUserId = currentUser?.id === username ? currentUser.id : isUUID(username) ? username : undefined;
  const { data: rawPortfolio } = useUserPortfolioQuery(targetUserId);

  const apiPortfolioItems = useMemo<GalleryItem[]>(() => {
    const list = Array.isArray(rawPortfolio) ? rawPortfolio : (rawPortfolio as any)?.data;
    if (!list || !Array.isArray(list)) return [];

    return list.map((item: any) => {
      const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
      const imageUrl =
        firstImage?.image_url ||
        firstImage?.ImageUrl ||
        item.image_url ||
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=625&fit=crop&q=80';

      return {
        id: item.id || item.ID,
        title: item.title || item.Title || 'Tác phẩm',
        imageUrl,
        likes: item.like_count ?? item.LikeCount ?? 0,
        isLiked: item.is_liked ?? false,
      };
    });
  }, [rawPortfolio]);

  const portfolioItems = apiPortfolioItems.length > 0 ? apiPortfolioItems : profile.portfolio;

  // Fetch real posts by this author if available
  const { data: postsData } = usePostsQuery({ search: profile.name });
  const artistPosts = useMemo(() => {
    const rawList = Array.isArray(postsData) ? postsData : postsData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [postsData, profile.name]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/posts');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between pb-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon className="size-4" />
          Quay lại
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 shadow-2xs cursor-pointer"
        >
          <ShareNetworkIcon className="size-3.5" />
          {copied ? 'Đã sao chép link!' : 'Chia sẻ Profile'}
        </button>
      </div>

      {/* 2. Cover Banner & Avatar */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 shadow-sm">
        <div className="relative aspect-21/9 sm:aspect-4/1 w-full overflow-hidden bg-muted">
          <Image
            src={`https://images.unsplash.com/${profile.coverImageId}?w=1200&h=400&fit=crop&q=80&auto=format`}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative -mt-10 sm:-mt-12 flex flex-col items-center px-4 pb-5 text-center sm:flex-row sm:items-end sm:text-left sm:gap-4 sm:px-6 sm:pb-6">
          <div className="relative size-20 sm:size-24 overflow-hidden rounded-full border-4 border-background bg-card shadow-md shrink-0">
            <Image
              src={`https://images.unsplash.com/${profile.avatarId}?w=160&h=160&fit=crop&q=80&auto=format&crop=face`}
              alt={profile.name}
              fill
              priority
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="mt-2.5 sm:mt-0 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              <CheckCircleIcon weight="fill" className="size-4 text-blue-400 shrink-0" />
              <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur-md">
                {profile.level}
              </span>
            </div>

            <p className="text-xs text-stone-200 mt-0.5">
              @{profile.username} · {profile.title}
            </p>

            <p className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-stone-300 mt-1">
              <MapPinIcon className="size-3 text-rose-400 shrink-0" />
              {profile.area}
            </p>
          </div>

          <div className="mt-3.5 sm:mt-0 flex items-center gap-2">
            <a
              href={`https://zalo.me/${profile.zaloPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <ChatCircleDotsIcon weight="fill" className="size-4" />
              Nhắn Zalo
            </a>

            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <PhoneIcon weight="fill" className="size-4" />
              Gọi
            </a>

            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              >
                <InstagramLogoIcon weight="bold" className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bio & Stats */}
      <div className="mt-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col gap-3">
        <div className="grid grid-cols-3 divide-x divide-border/60 text-center py-1">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-foreground">
              {portfolioItems.length}
            </div>
            <div className="text-[11px] text-muted-foreground">Tác phẩm</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-extrabold text-amber-500 flex items-center justify-center gap-0.5">
              <StarIcon weight="fill" className="size-3.5 text-amber-500" />
              {profile.rating}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {profile.reviewCount} đánh giá
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-extrabold text-foreground">
              {artistPosts.length}
            </div>
            <div className="text-[11px] text-muted-foreground">Bài đăng</div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed border-t border-border/50 pt-2.5">
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.specialties.map((spec) => (
            <span
              key={spec}
              className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground/90"
            >
              #{spec}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Tabs */}
      <div className="mt-6 flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer',
            activeTab === 'portfolio'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Tác phẩm ({portfolioItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer',
            activeTab === 'posts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Kèo đang tuyển ({artistPosts.length})
        </button>
      </div>

      {/* 5. Tab Content */}
      <div className="mt-4">
        {activeTab === 'portfolio' && (
          <PortfolioGallery items={portfolioItems} isOwner={isOwner} />
        )}

        {activeTab === 'posts' && (
          <div className="flex flex-col gap-3">
            {artistPosts.length > 0 ? (
              artistPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-emerald-600 px-2 py-0.2 text-[10px] font-bold text-white">
                        {post.benefitTag || post.offer}
                      </span>
                      {post.slotsAvailable !== undefined && (
                        <span className="text-[10px] text-amber-600 font-bold">
                          Còn {post.slotsAvailable} slot
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-xs sm:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {post.timeSlot || post.date} · {post.area}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs group-hover:bg-primary/90">
                    Ứng tuyển ngay →
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Nghệ nhân hiện chưa có bài tuyển mẫu nào.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

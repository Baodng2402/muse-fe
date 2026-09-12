'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  MapPinIcon,
  PhoneIcon,
  ShareNetworkIcon,
  StarIcon,
  UserCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery } from '@/src/features/posts/hooks/usePosts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { PortfolioGallery, type GalleryItem } from '@/src/features/portfolio/components/PortfolioGallery';
import { useUserPortfolioQuery } from '@/src/features/portfolio/hooks/usePortfolio';
import { useUserDetailQuery } from '@/src/features/account/hooks/useUser';
import { useAuthStore } from '@/src/shared/store/store.auth';
import { cn } from '@/src/shared/utils';
import { isAdmin, isProvider } from '@/src/shared/utils/user-roles';
import { ProfileHero } from '@/src/shared/components/common/ProfileHero';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=400&fit=crop&q=80&auto=format';

interface ProfilePageProps {
  username: string;
}

export function ProfilePage({ username }: ProfilePageProps) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'posts'>('portfolio');
  const [copied, setCopied] = useState(false);

  // Resolve target user ID
  const isMe = username === 'me' || (currentUser?.id && currentUser.id === username);
  const targetUserId = isMe ? currentUser?.id : isUUID(username) ? username : undefined;

  // Real backend queries
  const { data: userDetail, isLoading: isUserLoading, isError: isUserError } = useUserDetailQuery(
    targetUserId
  );
  const { data: rawPortfolio, isLoading: isPortfolioLoading } = useUserPortfolioQuery(targetUserId);

  const isOwner = Boolean(currentUser?.id && targetUserId && currentUser.id === targetUserId);

  // Parse portfolio items from backend response
  const portfolioItems = useMemo<GalleryItem[]>(() => {
    const list = Array.isArray(rawPortfolio) ? rawPortfolio : (rawPortfolio as any)?.data;
    if (!list || !Array.isArray(list)) return [];

    return list.map((item: any) => {
      const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
      const imageUrl =
        firstImage?.image_url ||
        firstImage?.ImageUrl ||
        item.image_url ||
        DEFAULT_COVER;

      return {
        id: item.id || item.ID,
        title: item.title || item.Title || 'Tác phẩm',
        description: item.description || item.Description,
        imageUrl,
        likes: item.like_count ?? item.LikeCount ?? 0,
        isLiked: item.is_liked ?? false,
      };
    });
  }, [rawPortfolio]);

  // Profile fields resolution
  const profileUser = userDetail || (isMe ? currentUser : null);

  const displayName =
    profileUser?.display_name ||
    profileUser?.email?.split('@')[0] ||
    (isUUID(username) ? 'Nghệ nhân' : username);

  const avatarUrl = profileUser?.avatar_url;
  const coverUrl = profileUser?.cover_url;
  const bio = profileUser?.bio || 'Nghệ nhân chưa cập nhật tiểu sử giới thiệu.';
  const phone = profileUser?.phone;
  const roleBadge = isAdmin(profileUser)
    ? 'Quản trị viên'
    : isProvider(profileUser)
    ? 'Nghệ nhân / Thợ'
    : 'Thành viên';
  const levelBadge = profileUser?.level || 'Chuyên nghiệp';

  // Fetch real posts by this author if available
  const { data: postsData } = usePostsQuery({ search: displayName });
  const artistPosts = useMemo(() => {
    const rawList = Array.isArray(postsData) ? postsData : postsData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [postsData, displayName]);

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

  // Loading Skeleton
  if (isUserLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8 animate-pulse">
        <div className="h-6 w-24 bg-muted rounded-md mb-4" />
        <div className="aspect-21/9 sm:aspect-4/1 w-full bg-muted rounded-3xl mb-4" />
        <div className="h-32 w-full bg-muted rounded-2xl mb-6" />
        <div className="h-10 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  // Not Found State when lookup fails and not current user
  if (targetUserId && isUserError && !profileUser) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          <UserCircleIcon className="size-8" />
        </div>
        <h2 className="text-base font-bold text-foreground">Không tìm thấy người dùng</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Tài khoản không tồn tại hoặc đã ngừng hoạt động.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

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

      {/* 2. Hero hồ sơ: cover + avatar + stats — dùng chung với account/page (my profile) */}
      <ProfileHero
        displayName={displayName}
        coverUrl={coverUrl}
        avatarUrl={avatarUrl}
        verified
        roleBadge={roleBadge}
        levelBadge={levelBadge}
        meta={
          <>
            {profileUser?.email && <p>{profileUser.email}</p>}
            {profileUser?.region_id && (
              <p className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPinIcon className="size-3 text-rose-400 shrink-0" />
                Khu vực hoạt động
              </p>
            )}
          </>
        }
        stats={[
          { label: 'Tác phẩm', value: portfolioItems.length },
          {
            label: 'Đánh giá',
            value: (
              <span className="flex items-center justify-center gap-0.5 text-amber-500">
                <StarIcon weight="fill" className="size-3.5" />
                5.0
              </span>
            ),
          },
          { label: 'Bài đăng', value: artistPosts.length },
        ]}
        actions={
          phone ? (
            <>
              <a
                href={`https://zalo.me/${phone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                <ChatCircleDotsIcon weight="fill" className="size-4" />
                Nhắn Zalo
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              >
                <PhoneIcon weight="fill" className="size-4" />
                Gọi
              </a>
            </>
          ) : undefined
        }
        bio={bio}
      />

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

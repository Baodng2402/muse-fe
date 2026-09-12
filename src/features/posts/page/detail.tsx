'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { useAuthStore } from '@/src/shared/store/store.auth';
import { useToggleSavePostMutation } from '../hooks/usePosts';
import { PostDetailHero } from '../components/PostDetailHero';
import { PostDetailSidebar } from '../components/PostDetailSidebar';
import { PostShareModal } from '../components/PostShareModal';
import { CreateBookingModal } from '@/src/features/bookings/components/CreateBookingModal';
import { CreateReportModal } from '@/src/features/reports/components/CreateReportModal';
import { MobileStickyBookingBar } from '../components/MobileStickyBookingBar';
import type { Post } from '../types';

export function PostDetailPage({ post }: { post: Post }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isLoggedIn = hasHydrated && isAuthenticated;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { mutate: toggleSavePost } = useToggleSavePostMutation();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/posts');
    }
  };

  const authorUsername =
    post.author.username ||
    post.author.name?.toLowerCase().replace(/\s+/g, '') ||
    'muse.user';

  const handleToggleBookmark = () => {
    toggleSavePost({
      postId: post.id,
      isCurrentlySaved: Boolean(post.isSaved),
    });
  };

  const currentUser = useAuthStore((s) => s.user);
  const isAuthor = Boolean(currentUser?.id && post.author?.id && currentUser.id === post.author.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 pb-24 lg:pb-10">
      {/* Header action bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon className="size-4" />
          Quay lại
        </button>

        {isAuthor && (
          <button
            type="button"
            onClick={() => router.push(`/posts/${post.id}/edit`)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-98 cursor-pointer"
          >
            Chỉnh sửa bài đăng
          </button>
        )}
      </div>

      {/* 2-column layout */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main Content */}
        <PostDetailHero
          post={post}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* Sticky Sidebar */}
        <PostDetailSidebar
          post={post}
          authorUsername={authorUsername}
          isLoggedIn={isLoggedIn}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>

      {/* Modals */}
      <PostShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
        authorUsername={authorUsername}
      />

      <CreateBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerProfileId={post.author.id || '00000000-0000-0000-0000-000000000001'}
        providerName={post.author.name}
      />

      <CreateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={post.id}
        targetType="post"
        targetTitle={post.title}
      />

      {/* Mobile Sticky Bottom Booking Bar */}
      <MobileStickyBookingBar
        post={post}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}

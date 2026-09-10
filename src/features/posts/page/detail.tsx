'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { useAuthStore } from '@/src/shared/store/use-auth-store';
import { useToggleSavePostMutation } from '../hooks/use-posts';
import { PostDetailHero } from '../components/post-detail-hero';
import { PostDetailSidebar } from '../components/post-detail-sidebar';
import { PostShareModal } from '../components/post-share-modal';
import { CreateBookingModal } from '@/src/features/bookings/components/create-booking-modal';
import { CreateReportModal } from '@/src/features/reports/components/create-report-modal';
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
    post.author.name === 'Thanh Hương'
      ? 'thanhhuong.pro'
      : post.author.name === 'Quang Đức'
      ? 'quangduc.photo'
      : post.author.name === 'Minh Châu'
      ? 'minhchau.nails'
      : 'ngoctrinh.makeup';

  const handleToggleBookmark = () => {
    toggleSavePost({
      postId: post.id,
      isCurrentlySaved: Boolean(post.isSaved),
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeftIcon className="size-4" />
        Quay lại
      </button>

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
    </div>
  );
}

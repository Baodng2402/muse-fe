'use client';

import { EditorialHeroBanner } from '../components/editorial-hero-banner';
import { StoryCategoriesBar } from '../components/story-categories-bar';
import { UrgentModelFeed } from '../components/urgent-model-feed';
import { FeaturedArtistsSection } from '../components/featured-artists-section';
import { WhyMuseBento } from '../components/why-muse-bento';

export function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 flex flex-col gap-6 sm:gap-10">
      {/* 1. Editorial Magazine Hero Banner */}
      <EditorialHeroBanner />

      {/* 2. Dải Story Categories (Instagram Stories / Xiaohongshu Style) */}
      <StoryCategoriesBar />

      {/* 3. Kèo Tuyển Mẫu Mới Nhất (Real API data) */}
      <UrgentModelFeed />

      {/* 4. Showcase Nghệ Nhân Chuyên Nghiệp */}
      <FeaturedArtistsSection />

      {/* 5. Tại sao chọn Muse (Bento cards) */}
      <WhyMuseBento />
    </div>
  );
}

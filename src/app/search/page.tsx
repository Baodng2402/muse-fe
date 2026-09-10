import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchPage } from '@/src/features/search/page';

export const metadata: Metadata = {
  title: 'Tìm kiếm & Khám phá | Muse',
  description: 'Khám phá các layout makeup, mẫu nail, studio nhiếp ảnh và thợ làm đẹp chuyên nghiệp tại Việt Nam.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-4xl px-4 py-8 animate-pulse">
          <div className="h-10 w-full bg-muted rounded-2xl mb-6" />
          <div className="h-32 w-full bg-muted rounded-3xl" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}

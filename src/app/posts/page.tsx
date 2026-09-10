import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PostsPage } from '@/src/features/posts/page';

export const metadata: Metadata = {
  title: 'Danh sách bài đăng | Muse',
  description: 'Khám phá các bài tuyển mẫu thực hành và thợ làm đẹp chuyên nghiệp trên Muse.',
};

export default function Posts() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded-xl mb-4" />
          <div className="h-12 w-full bg-muted rounded-2xl mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <PostsPage />
    </Suspense>
  );
}

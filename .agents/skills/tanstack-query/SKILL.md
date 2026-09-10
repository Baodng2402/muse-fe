---
name: tanstack-query
description: >-
  Standard patterns, Query Key Factories, Next.js 16 App Router SSR Hydration, Mutations, and Cache Management using TanStack Query v5. Use when writing, refactoring, or integrating server state fetching and mutations.
---

# TanStack Query v5 Best Practices & Architecture Guideline

Tài liệu chuẩn hóa việc sử dụng `@tanstack/react-query` v5 trong dự án Next.js 16 App Router + React 19.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Server State vs Client State**:
   - **TanStack Query** quản lý DUY NHẤT Server State (dữ liệu bất đồng bộ từ backend Go, cache, sync, refetch, mutations).
   - KHÔNG lưu trữ dữ liệu trả về từ server vào Zustand hay React Context. Hãy để React Query làm Single Source of Truth cho cache.
2. **Không Hardcode Query Keys**:
   - Mọi query key PHẢI được định nghĩa thông qua **Query Key Factory**.
   - Cấu trúc query key theo dạng Tuple: `[entity, scope, ...params]`.
3. **Không Hardcode Endpoint Paths**:
   - Các API request phải sử dụng hằng số từ `src/core/config/endpoints.ts`.
4. **Tách biệt 3 tầng rõ ràng**:
   - **Tầng API (Pure Functions)**: `src/features/<feature>/api/*.api.ts` (nhận params, gọi HTTP client, trả về Promise có typed).
   - **Tầng Hook (React Query)**: `src/features/<feature>/hooks/use-*.ts` (bọc `useQuery`, `useMutation`, xử lý key, cache invalidation, options).
   - **Tầng UI Component**: Chỉ gọi hook, xử lý trạng thái `isLoading`, `isError`, `data`.

---

## 2. Query Key Factory Pattern

Định nghĩa keys tập trung theo từng feature để đảm bảo type-safety và invalidation chính xác:

```typescript
// src/features/posts/api/posts.keys.ts
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  saved: () => [...postKeys.all, 'saved'] as const,
};
```

---

## 3. Query Hook Chuẩn

```typescript
// src/features/posts/hooks/use-posts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '../api/posts.keys';
import { postsApi } from '../api/posts.api';
import type { PostFilterParams, CreatePostDTO } from '@/src/core/api/types';

export function usePostsQuery(params: PostFilterParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.getPosts(params),
    staleTime: 60 * 1000, // 1 phút
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đổi filter/page (tránh giật UI)
  });
}

export function usePostDetailQuery(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: Boolean(id),
  });
}
```

---

## 4. Mutation & Cache Invalidation Pattern

Sau khi tạo, sửa, xóa, hoặc thao tác dữ liệu, bắt buộc phải invalidate đúng key để refresh cache tự động:

```typescript
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePostDTO) => postsApi.createPost(dto),
    onSuccess: (newPost) => {
      // Invalidate toàn bộ danh sách posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      // Hoặc set trực tiếp vào cache detail
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost);
    },
    onError: (error) => {
      // Xử lý thông báo lỗi (Toast/Alert)
    },
  });
}
```

---

## 5. Next.js App Router Server Component Prefetching (SSR Hydration)

Khi cần SEO hoặc First Paint nhanh cho trang tin tức/danh sách:

```tsx
// app/posts/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/src/core/providers/get-query-client';
import { postKeys } from '@/src/features/posts/api/posts.keys';
import { postsApi } from '@/src/features/posts/api/posts.api';
import { PostsList } from '@/src/features/posts/components/posts-list';

export default async function PostsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: postKeys.list({}),
    queryFn: () => postsApi.getPosts({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsList />
    </HydrationBoundary>
  );
}
```

---

## 6. Checklist Khi Viết Code React Query
- [ ] Query key có dùng `QueryKeyFactory` không?
- [ ] Không fetch API trực tiếp trong component; đã bọc qua Custom Hook chưa?
- [ ] Có đặt `staleTime` hợp lý không (tránh refetch liên tục khi chuyển tab nếu dữ liệu ít thay đổi)?
- [ ] Mutation có `onSuccess` invalidate cache liên quan không?
- [ ] Có xử lý các trạng thái `isPending`/`isLoading`, `isError`, và empty data trên UI chưa?

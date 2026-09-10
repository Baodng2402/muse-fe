---
name: frontend-conventions
description: >-
  Senior frontend coding conventions, architecture patterns, zero-hardcoding rules, error boundaries, and URL state management for Muse Frontend.
---

# Senior Frontend Engineering Conventions & Guidelines

Bộ quy chuẩn kiến trúc và code convention cho dự án `muse-fe` (Next.js 16 App Router + React 19 + TypeScript).

---

## 1. Không Hardcode (Zero Hardcoding Rule)

Mọi đường dẫn, hằng số, key phải được định nghĩa tập trung:
- **API Endpoints**: Tập trung tại `src/core/config/endpoints.ts`. Không viết string endpoint (như `"/api/v1/posts"`) trong bất kỳ file nào khác.
- **Route Paths**: Tập trung tại `src/core/config/routes.ts` (ví dụ `ROUTES.posts.detail(id)`).
- **Query Keys**: Dùng Query Key Factory tại `*.keys.ts`.
- **Storage Keys**: Tập trung tại `src/core/config/storage-keys.ts`.
- **Environment Variables**: Xác thực và export qua `src/core/config/env.ts`.

---

## 2. Quản Lý URL State & Debounce (`useUrlParams`, `useDebounce`)

- **`useDebounce`**:
  - Dùng cho các ô tìm kiếm, auto-save, slider filter nhằm tối ưu hiệu năng và giảm số lượng request không cần thiết tới server.
- **`useUrlParams`**:
  - Đồng bộ trạng thái tìm kiếm, lọc danh mục, phân trang trực tiếp lên URL search params (`window.location.search` qua Next.js router).
  - Đảm bảo người dùng có thể copy link chia sẻ, bookmark hoặc reload mà không mất trạng thái lọc.
  - Cập nhật URL sử dụng `router.replace` với `scroll: false` để tránh giật cuộn trang.

---

## 3. Quản Lý Lỗi & Error Boundary (`ErrorBoundary`, `error.tsx`)

Hệ thống bắt lỗi phân tầng theo chuẩn Senior:
1. **API Error Layer**:
   - Mọi response lỗi từ Go backend (`APIResponse{success: false, error, code}`) được map sang class `AppError`.
   - Lưu trữ `statusCode`, `errorCode`, và `userMessage` thân thiện.
2. **Component Isolation Layer (`ErrorBoundary`)**:
   - Bọc các thành phần UI phức tạp (Feed, Widget, Chart, Form) bằng `ErrorBoundary` để nếu một widget bị lỗi runtime, toàn bộ trang vẫn hoạt động bình thường thay vì hiển thị màn hình trắng.
3. **App Router Route Layer (`error.tsx`, `not-found.tsx`, `global-error.tsx`)**:
   - `error.tsx`: Bắt lỗi tại từng segment route của Next.js, cung cấp nút "Thử lại" (`reset()`) và thông báo trực quan.
   - `not-found.tsx`: Giao diện 404 nhất quán, điều hướng về trang chủ.
   - `global-error.tsx`: Fallback cứu cánh cấp độ root layout.

---

## 4. Cấu Trúc Thư Mục Chuẩn Senior

```text
src/
├── app/                  # Next.js App Router (Chỉ routing, layout, page wrapper, metadata)
│   ├── (auth)/...
│   ├── posts/...
│   ├── error.tsx         # Route-level error handling
│   ├── not-found.tsx     # 404 page
│   └── global-error.tsx  # Root error fallback
├── core/                 # Nền tảng cốt lõi của ứng dụng
│   ├── api/              # HTTP client, interceptors, type definitions, AppError
│   ├── config/           # Endpoints, env, routes, storage-keys
│   └── providers/        # React Query Provider, Theme Provider, Toast Provider
├── features/             # Feature-driven Modules
│   ├── <feature_name>/
│   │   ├── api/          # Pure API caller + Query Key factory
│   │   ├── components/   # UI components nội bộ của feature
│   │   ├── hooks/        # React Query custom hooks & local hooks
│   │   └── types/        # Type definitions riêng của feature
└── shared/               # Thành phần dùng chung toàn app
    ├── components/
    │   ├── common/       # Header, Footer, ErrorBoundary, ...
    │   └── ui/           # Base UI primitives (Button, Input, Modal, ...)
    ├── hooks/            # useDebounce, useUrlParams, useMediaQuery, ...
    ├── store/            # Global Zustand stores (useAuthStore)
    └── utils/            # formatters, validators, cn
```

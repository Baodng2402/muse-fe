---
name: zustand
description: >-
  Architectural patterns, Atomic Selectors, Slice pattern, Next.js App Router Hydration-Safe Persistence, and conventions for Zustand v5. Use when managing client-side state, auth sessions, and UI preferences.
---

# Zustand v5 Best Practices & Architecture Guideline

Tài liệu chuẩn hóa việc sử dụng `zustand` v5 trong dự án Next.js 16 App Router + React 19.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Phạm vi sử dụng**:
   - Chỉ dùng Zustand cho **Client-side Global State**: Auth token & user session, theme, UI modaling/drawer, bộ lọc filter tạm thời trên client.
   - **Tuyệt đối không** dùng Zustand để cache dữ liệu API từ server (dùng TanStack Query).
2. **Atomic Selectors (Bắt buộc)**:
   - **Tuyệt đối không** gọi `const { user, token } = useAuthStore();` trực tiếp vì sẽ làm component re-render mỗi khi BẤT KỲ thuộc tính nào trong store thay đổi.
   - **Luôn luôn** dùng atomic selector: `const token = useAuthStore((s) => s.token);` hoặc custom selector hook.
3. **An toàn Hydration trong Next.js App Router**:
   - Khi sử dụng `persist` middleware với `localStorage`, server render không có `window.localStorage` nên có nguy cơ gây Hydration Mismatch warning.
   - Phải cung cấp cờ `_hasHydrated` hoặc bọc qua hook `useHydratedStore` để component UI chờ tới khi client đồng bộ xong.

---

## 2. Cấu Trúc Store Mẫu (Type-safe + Persist + Hydration-safe)

```typescript
// src/shared/store/use-auth-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserDTO } from '@/src/core/api/types';

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
}

interface AuthActions {
  setAuth: (payload: { user: UserDTO; accessToken: string; refreshToken: string }) => void;
  updateUser: (user: Partial<UserDTO>) => void;
  clearAuth: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: 'muse.auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist những trường cần lưu, bỏ qua cờ nội bộ
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
```

---

## 3. Cách Sử Dụng Trong Component (Senior Pattern)

### A. Sử dụng Atomic Selector
```tsx
export function UserBadge() {
  // Chỉ re-render khi user?.displayName thay đổi
  const displayName = useAuthStore((s) => s.user?.display_name);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return <Skeleton className="h-8 w-24" />;
  }

  if (!isAuthenticated) {
    return <Link href="/auth/login">Đăng nhập</Link>;
  }

  return <span>{displayName}</span>;
}
```

### B. Sử dụng Action không gây re-render
```tsx
export function LogoutButton() {
  // Actions là function tham chiếu tĩnh, không gây re-render
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return <button onClick={clearAuth}>Đăng xuất</button>;
}
```

---

## 4. Checklist Khi Viết Code Zustand
- [ ] State và Actions có kiểu dữ liệu TypeScript tường minh không?
- [ ] Có tách selector nhỏ nhất có thể không (tránh subscribe toàn bộ store)?
- [ ] Nếu có `persist`, đã xử lý `_hasHydrated` để tránh Next.js Hydration Mismatch chưa?
- [ ] Store có chứa dữ liệu server không? (Nếu có -> Chuyển sang TanStack Query).

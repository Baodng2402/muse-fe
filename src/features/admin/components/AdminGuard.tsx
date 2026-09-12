'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldWarningIcon } from '@phosphor-icons/react/dist/ssr';
import { useAuthStore } from '@/src/shared/store/store.auth';
import { isAdmin } from '@/src/shared/utils/user-roles';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-xl mb-4" />
        <div className="h-64 w-full bg-muted rounded-3xl" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin(currentUser)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-3xl border border-destructive/20 bg-card p-8 shadow-sm">
          <ShieldWarningIcon className="mx-auto size-14 text-destructive mb-3" />
          <h2 className="text-xl font-bold text-foreground">Khu vực dành riêng cho Quản trị viên</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Bạn cần đăng nhập bằng tài khoản có vai trò Quản trị viên (Admin) để truy cập trang quản lý này.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-4 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Về trang chủ
            </Link>
            <Link
              href="/auth?redirect=/admin/reports"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/20 hover:bg-primary/90"
            >
              Đăng nhập Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

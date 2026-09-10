'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookmarkSimpleIcon,
  CheckCircleIcon,
  GearSixIcon,
  ListDashesIcon,
  SparkleIcon,
  UserCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useAuthStore } from '@/src/shared/store/use-auth-store';
import { useLogout, useLoginMutation } from '@/src/features/auth/hooks/use-auth';
import { useSavedPostsQuery, usePostsQuery, useToggleSavePostMutation } from '@/src/features/posts/hooks/use-posts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { useUrlParams } from '@/src/shared/hooks/use-url-params';
import { AccountProfileHeader } from '../components/account-profile-header';
import { AccountSavedPostsTab } from '../components/account-saved-posts-tab';
import { AccountMyPostsTab } from '../components/account-my-posts-tab';
import { AccountPortfolioTab } from '../components/account-portfolio-tab';
import { AccountSettingsTab } from '../components/account-settings-tab';
import { useCurrentUserQuery } from '../hooks/use-user';
import { cn } from '@/src/shared/utils';

export type AccountTab = 'saved' | 'my-posts' | 'portfolio' | 'settings';

export function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  useCurrentUserQuery();
  const logout = useLogout();
  const loginMutation = useLoginMutation();
  const toggleSaveMutation = useToggleSavePostMutation();

  // Synced with URL search params ?tab=saved | ?tab=my-posts | ?tab=portfolio | ?tab=settings
  const { getParam, setParam } = useUrlParams();
  const tabParam = getParam<AccountTab>('tab');
  const activeTab: AccountTab =
    tabParam === 'my-posts' || tabParam === 'portfolio' || tabParam === 'settings' ? tabParam : 'saved';

  const handleTabChange = (tab: AccountTab) => {
    setParam('tab', tab === 'saved' ? null : tab, { replace: false });
  };

  // Login form for unauthenticated guests
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Real user's saved bookmarks from API (Zero mock fallback)
  const { data: apiSavedPosts, isLoading: isLoadingSaved } = useSavedPostsQuery();
  const savedPosts = useMemo(() => {
    if (apiSavedPosts && Array.isArray(apiSavedPosts)) {
      return apiSavedPosts.map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [apiSavedPosts]);

  // Real user's authored posts from API
  const { data: apiAllPosts, isLoading: isLoadingMyPosts } = usePostsQuery();
  const myPosts = useMemo(() => {
    const rawList = Array.isArray(apiAllPosts) ? apiAllPosts : apiAllPosts?.data;
    if (!rawList || !Array.isArray(rawList) || !user?.id) return [];
    return rawList
      .filter((p: any) => (p.user_id || p.UserID) === user.id)
      .map((p: any, idx: number) => normalizePost(p, idx));
  }, [apiAllPosts, user?.id]);

  const handleRemoveSaved = (postId: string) => {
    toggleSaveMutation.mutate({ postId, isCurrentlySaved: true });
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onError: (err) => {
          setError(err.message || 'Email hoặc mật khẩu không chính xác.');
        },
      }
    );
  };

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Guest view
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
            <UserCircleIcon weight="fill" className="size-8" />
          </div>

          <h1 className="mt-4 text-center text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Tài Khoản Muse
          </h1>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Đăng nhập để xem tin đã lưu, quản lý bài đăng tuyển mẫu và kết nối trực tiếp với nghệ nhân.
          </p>

          <Link
            href="/auth"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-98"
          >
            <CheckCircleIcon weight="bold" className="size-4" />
            Đăng nhập / Đăng ký tài khoản
          </Link>

          <div className="relative my-5 text-center text-[11px] text-muted-foreground">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <span className="relative bg-card px-2 font-medium">hoặc dùng email</span>
          </div>

          {/* Quick Login Form */}
          <form onSubmit={handleCustomLogin} className="flex flex-col gap-3">
            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-2.5 text-center text-xs text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:border-primary"
                placeholder="demo@muse.com"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:border-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-2 w-full rounded-xl border border-border bg-foreground py-2.5 text-xs font-bold text-background transition-all hover:opacity-90 active:scale-98 cursor-pointer"
            >
              {loginMutation.isPending ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Member View
  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8 flex flex-col gap-5">
      <AccountProfileHeader user={user} onLogout={logout} />

      {/* Tabs */}
      <div className="flex rounded-2xl border border-border/70 bg-muted/50 p-1 shadow-xs">
        <button
          type="button"
          onClick={() => handleTabChange('saved')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
            activeTab === 'saved'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <BookmarkSimpleIcon className="size-4" />
          <span>Tin đã lưu</span>
          <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] text-primary">
            {savedPosts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('my-posts')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
            activeTab === 'my-posts'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ListDashesIcon className="size-4" />
          <span>Bài đăng của tôi</span>
          {myPosts.length > 0 && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] text-primary">
              {myPosts.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('portfolio')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
            activeTab === 'portfolio'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <SparkleIcon className="size-4" />
          <span>Portfolio</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('settings')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
            activeTab === 'settings'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <GearSixIcon className="size-4" />
          <span>Cài đặt</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'saved' && (
        <AccountSavedPostsTab
          savedPosts={savedPosts}
          isLoading={isLoadingSaved}
          onRemoveSaved={handleRemoveSaved}
        />
      )}

      {activeTab === 'my-posts' && (
        <AccountMyPostsTab myPosts={myPosts} isLoading={isLoadingMyPosts} />
      )}

      {activeTab === 'portfolio' && (
        <AccountPortfolioTab userId={user.id} />
      )}

      {activeTab === 'settings' && <AccountSettingsTab user={user} />}
    </div>
  );
}

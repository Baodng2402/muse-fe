"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CheckCircleIcon,
  ClockIcon,
  GearSixIcon,
  LockSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  SignOutIcon,
  StarIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { POSTS, type Post } from "@/src/features/posts/mock/posts";
import { useMockSession } from "@/src/shared/store/mock-session";
import { cn } from "@/src/shared/utils";

export function AccountPage() {
  const { session, hydrated, login, logout } = useMockSession();
  const [activeTab, setActiveTab] = useState<"saved" | "my-posts" | "settings">("saved");

  // Form login states for guests
  const [email, setEmail] = useState("demo@muse.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);

  // Mock user's saved bookmarks (lấy 2 bài mẫu)
  const [savedPosts, setSavedPosts] = useState(POSTS.slice(0, 2));

  // Mock user's own recruitment posts
  const [myPosts, setMyPosts] = useState(POSTS.filter((p) => p.id === "1"));

  const handleRemoveSaved = (postId: string) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleToggleSlot = (postId: string) => {
    setMyPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              slotsAvailable: (p.slotsAvailable || 1) > 0 ? 0 : 1,
            }
          : p
      )
    );
  };

  const handleDemoLogin = () => {
    const ok = login("demo@muse.com", "123456");
    if (!ok) {
      setError("Email hoặc mật khẩu không đúng.");
    } else {
      setError(null);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng dùng demo@muse.com / 123456");
    } else {
      setError(null);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP
  if (!session) {
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
            Đăng nhập để xem tin đã lưu, quản lý bài đăng tuyển mẫu và kết nối Zalo trực tiếp với nghệ nhân.
          </p>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-98"
          >
            <CheckCircleIcon weight="bold" className="size-4" />
            Đăng nhập nhanh (Tài khoản Demo)
          </button>

          <div className="relative my-5 text-center text-[11px] text-muted-foreground">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <span className="relative bg-card px-2 font-medium">hoặc dùng email</span>
          </div>

          {/* Login Form */}
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
                placeholder="123456"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl border border-input bg-background py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Đăng nhập bằng mật khẩu
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP
  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* Profile Header */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left">
            <div className="relative size-20 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&q=80&auto=format&crop=face"
                alt="Avatar của bạn"
                fill
                priority
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  Minh Anh (Bạn)
                </h1>
                <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-bold text-primary">
                  Thành viên Muse
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{session.email}</p>
              <p className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-muted-foreground mt-1">
                <MapPinIcon className="size-3 text-primary shrink-0" />
                Quận 1, TP. Hồ Chí Minh · Mẫu ảnh & Học viên
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              <PlusIcon weight="bold" className="size-3.5" />
              Đăng tin tuyển
            </Link>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive active:scale-95"
            >
              <SignOutIcon className="size-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 pt-4 text-center">
          <div>
            <div className="text-base sm:text-lg font-bold text-foreground">
              {savedPosts.length}
            </div>
            <div className="text-[11px] text-muted-foreground">Tin đã lưu</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-foreground">
              {myPosts.length}
            </div>
            <div className="text-[11px] text-muted-foreground">Tin đã đăng</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-amber-500 flex items-center justify-center gap-0.5">
              <StarIcon weight="fill" className="size-3.5 text-amber-500" />
              5.0
            </div>
            <div className="text-[11px] text-muted-foreground">Độ uy tín</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="mt-6 flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "saved"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <BookmarkSimpleIcon weight={activeTab === "saved" ? "fill" : "regular"} className="size-4" />
          Tin đã lưu ({savedPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("my-posts")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "my-posts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Tin của tôi ({myPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <GearSixIcon weight={activeTab === "settings" ? "fill" : "regular"} className="size-4" />
          Cài đặt tài khoản
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-4">
        {/* TAB 1: TIN ĐÃ LƯU */}
        {activeTab === "saved" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
              >
                {/* Header: Thumbnail + Main Content */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={`https://images.unsplash.com/${post.imageId}?w=160&h=160&fit=crop&q=80&auto=format`}
                      alt={post.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">
                        {post.benefitTag || post.offer}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground truncate">
                        {post.category === "makeup" ? "Makeup" : post.category === "nail" ? "Nail" : "Nhiếp ảnh"}
                      </span>
                    </div>

                    <Link href={`/posts/${post.id}`}>
                      <h3 className="mt-1 text-xs sm:text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="mt-0.5 text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                      <MapPinIcon className="size-3 text-primary shrink-0" />
                      {post.area.split(",")[0]} · {post.timeSlot ? post.timeSlot.split(",")[0] : post.date}
                    </p>
                  </div>
                </div>

                {/* Footer Action Row: Đồng nhất hoàn toàn với Tab Tin của tôi */}
                <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-border/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="relative size-5 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image
                        src={`https://images.unsplash.com/${post.author.avatarId}?w=40&h=40&fit=crop&q=80&auto=format&crop=face`}
                        alt={post.author.name}
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[100px] sm:max-w-[120px]">
                      {post.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(post.id)}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive active:scale-95"
                    >
                      <BookmarkSimpleIcon weight="fill" className="size-3.5 text-primary" />
                      <span>Bỏ lưu</span>
                    </button>
                    <Link
                      href={`/posts/${post.id}`}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
                    >
                      Xem bài
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {savedPosts.length === 0 && (
              <div className="col-span-full py-10 text-center text-xs text-muted-foreground rounded-2xl border border-dashed border-border p-6">
                Chưa có tin nào được lưu. Hãy khám phá và lưu lại những kèo phù hợp!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TIN ĐÃ ĐĂNG */}
        {activeTab === "my-posts" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {myPosts.map((post) => {
              const isOpen = (post.slotsAvailable || 0) > 0;
              return (
                <div
                  key={post.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  {/* Header: Thumbnail + Main Content */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={`https://images.unsplash.com/${post.imageId}?w=160&h=160&fit=crop&q=80&auto=format`}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-bold text-white",
                            isOpen ? "bg-emerald-600" : "bg-muted-foreground"
                          )}
                        >
                          {isOpen ? "Đang mở tuyển" : "Đã đủ slot"}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold",
                            isOpen ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                          )}
                        >
                          {isOpen ? `Còn ${post.slotsAvailable} slot` : "0 slot"}
                        </span>
                      </div>

                      <Link href={`/posts/${post.id}`}>
                        <h3 className="mt-1 text-xs sm:text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="mt-0.5 text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                        <ClockIcon className="size-3 text-muted-foreground shrink-0" />
                        Đăng lúc 09:30 · 14 lượt xem · 3 ứng tuyển
                      </p>
                    </div>
                  </div>

                  {/* Footer Action Row: Tương thích hoàn toàn với Tab Tin đã lưu */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-border/60">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-medium text-muted-foreground truncate">
                        Tin của bạn
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSlot(post.id)}
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors active:scale-95",
                          isOpen
                            ? "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        )}
                      >
                        {isOpen ? "Đóng slot" : "Mở lại"}
                      </button>
                      <Link
                        href={`/posts/${post.id}`}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
                      >
                        Xem bài
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {myPosts.length === 0 && (
              <div className="col-span-full py-10 text-center text-xs text-muted-foreground rounded-2xl border border-dashed border-border p-6">
                Bạn chưa đăng bài nào. Hãy bấm đăng bài tuyển mẫu ngay!
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CÀI ĐẶT TÀI KHOẢN */}
        {activeTab === "settings" && (
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Thông tin cá nhân & Liên hệ
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Họ và tên</label>
                <input
                  type="text"
                  defaultValue="Minh Anh"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Số điện thoại Zalo</label>
                <input
                  type="text"
                  defaultValue="0901234567"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Khu vực hoạt động</label>
                <input
                  type="text"
                  defaultValue="Quận 1, TP. Hồ Chí Minh"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Vai trò chính</label>
                <select
                  defaultValue="model"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none"
                >
                  <option value="model">Mẫu ảnh / Mẫu thực hành</option>
                  <option value="student">Học viên trang điểm / nail / photo</option>
                  <option value="pro">Thợ chuyên nghiệp / Chủ studio</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

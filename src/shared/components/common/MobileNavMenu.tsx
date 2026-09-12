"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookmarkSimpleIcon,
  CalendarCheckIcon,
  CompassIcon,
  HouseIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SignOutIcon,
  UserCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useAuthStore } from "@/src/shared/store/store.auth";
import { useLogout } from "@/src/features/auth/hooks/useAuth";
import { cn, getInitials } from "@/src/shared/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/Avatar";

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const logout = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Khóa cuộn trang khi Sidebar mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tự đóng sidebar khi đổi trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const NAV_ITEMS = [
    { href: "/", label: "Trang chủ", icon: HouseIcon },
    { href: "/posts", label: "Khám phá bài đăng", icon: CompassIcon },
    { href: "/bookings", label: "Lịch hẹn & Booking", icon: CalendarCheckIcon },
    { href: "/search", label: "Tìm kiếm & Xu hướng", icon: MagnifyingGlassIcon },
    { href: "/profile", label: "Tài khoản của tôi", icon: UserCircleIcon },
  ];

  return (
    <div className="sm:hidden">
      {/* Nút Hamburger kích hoạt Sidebar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Mở menu điều hướng"
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95"
      >
        <ListIcon weight="bold" className="size-4" />
      </button>

      {/* SIDEBAR DRAWER OVERLAY & PANEL (Portaled to document.body) */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop Dimmer */}
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            />

            {/* Sidebar Drawer Panel trượt từ bên phải */}
            <aside
              aria-label="Menu di động"
              className="fixed top-0 right-0 bottom-0 z-[10000] flex w-72 max-w-[85vw] flex-col justify-between border-l border-border bg-card p-5 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
            >
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <Link
                  href="/"
                  className="text-lg font-black tracking-tight text-foreground"
                >
                  Muse
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground active:scale-95"
                  aria-label="Đóng menu"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              {/* User Profile Mini Badge */}
              <div className="my-4 rounded-2xl border border-border/80 bg-muted/40 p-3">
                {hasHydrated && isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border shrink-0">
                      <AvatarImage src={user.avatar_url} alt={user.display_name || "Avatar"} />
                      <AvatarFallback className="text-xs font-bold">
                        {getInitials(user.display_name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-foreground truncate">
                        {user.display_name || "Tài khoản"}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {user.email || user.phone || ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-foreground">
                      Chào mừng bạn đến với Muse
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Đăng nhập để xem SĐT Zalo và lưu bài đăng yêu thích.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-flex justify-center rounded-xl bg-primary py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      Đăng nhập / Đăng ký
                    </Link>
                  </div>
                )}
              </div>

              {/* Primary Navigation List */}
              <nav className="flex flex-col gap-1 pt-1">
                <div className="pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Điều hướng chính
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon weight={isActive ? "fill" : "regular"} className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Secondary Information */}
              <div className="mt-4 pt-3 border-t border-border/60 flex flex-col gap-1">
                <div className="pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Thông tin khác
                </div>
                <Link
                  href="/#cach-hoat-dong"
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cách thức hoạt động
                </Link>
                <Link
                  href="/#dich-vu"
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Dịch vụ & Bảng giá
                </Link>
              </div>
            </div>

            {/* Bottom Actions of Sidebar */}
            <div className="pt-4 border-t border-border/70 flex flex-col gap-2">
              <Link
                href="/posts/new"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-98 cursor-pointer"
              >
                <PlusIcon weight="bold" className="size-4" />
                Đăng tin ngay
              </Link>

              {hasHydrated && isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive active:scale-98"
                >
                  <SignOutIcon className="size-3.5" />
                  Đăng xuất ({user?.display_name || "Tài khoản"})
                </button>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </div>
  );
}

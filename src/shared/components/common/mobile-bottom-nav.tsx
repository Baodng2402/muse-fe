"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CompassIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isPosts = pathname.startsWith("/posts");
  const isHome = pathname === "/";
  const isSearch = pathname.startsWith("/search");
  const isProfile = pathname === "/profile" || pathname.startsWith("/auth");

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 px-3 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-lg backdrop-blur-lg sm:hidden"
    >
      <div className="flex items-center justify-around">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
            isHome
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <HouseIcon
            weight={isHome ? "fill" : "regular"}
            className="size-5"
          />
          <span>Trang chủ</span>
        </Link>

        {/* 2. Khám phá & Tin đăng */}
        <Link
          href="/posts"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
            isPosts
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CompassIcon
            weight={isPosts ? "fill" : "regular"}
            className="size-5"
          />
          <span>Khám phá</span>
        </Link>

        {/* 3. ĐĂNG TIN (Nút nổi bật ở giữa) */}
        <div className="flex flex-1 justify-center">
          <Link
            href="/posts/new"
            aria-label="Đăng tin mới"
            className="-mt-5 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform active:scale-95 hover:bg-primary/90 cursor-pointer"
          >
            <PlusIcon weight="bold" className="size-6" />
          </Link>
        </div>

        {/* 4. Tìm kiếm nhanh */}
        <Link
          href="/search"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
            isSearch
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MagnifyingGlassIcon
            weight={isSearch ? "bold" : "regular"}
            className="size-5"
          />
          <span>Tìm kiếm</span>
        </Link>

        {/* 5. Tài khoản */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
            isProfile
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UserIcon
            weight={isProfile ? "fill" : "regular"}
            className="size-5"
          />
          <span>Tài khoản</span>
        </Link>
      </div>
    </nav>
  );
}

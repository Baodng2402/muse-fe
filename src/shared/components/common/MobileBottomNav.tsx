"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheckIcon,
  CompassIcon,
  HouseIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isPosts = pathname.startsWith("/posts") && !pathname.startsWith("/posts/new");
  const isBookings = pathname.startsWith("/bookings");
  const isProfile = pathname === "/profile" || pathname.startsWith("/auth") || pathname.startsWith("/account");
  const isCreate = pathname === "/posts/new" || pathname === "/posts/create";

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-lg backdrop-blur-lg sm:hidden"
    >
      <div className="flex items-center justify-around">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors",
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
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors",
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

        {/* 3. ĐĂNG TIN (Nút FAB nổi bật ở giữa) */}
        <div className="flex flex-1 flex-col items-center">
          <Link
            href="/posts/new"
            aria-label="Đăng tin mới"
            className={cn(
              "-mt-4 flex size-12 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 cursor-pointer",
              isCreate
                ? "bg-primary/90 text-primary-foreground shadow-primary/40"
                : "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
            )}
          >
            <PlusIcon weight="bold" className="size-6" />
          </Link>
          <span className={cn(
            "mt-0.5 text-[10px] font-medium",
            isCreate ? "font-semibold text-primary" : "text-muted-foreground"
          )}>
            Đăng tin
          </span>
        </div>

        {/* 4. Lịch hẹn */}
        <Link
          href="/bookings"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors",
            isBookings
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CalendarCheckIcon
            weight={isBookings ? "fill" : "regular"}
            className="size-5"
          />
          <span>Lịch hẹn</span>
        </Link>

        {/* 5. Tài khoản */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors",
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

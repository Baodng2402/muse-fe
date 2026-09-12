import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { AuthStatusButton } from "@/src/shared/components/common/auth-status-button";
import { MobileNavMenu } from "@/src/shared/components/common/mobile-nav-menu";

const SECTION_LINKS = [
  { href: "/#cach-hoat-dong", label: "Cách hoạt động" },
  { href: "/posts", label: "Kèo tuyển mẫu" },
  { href: "/search", label: "Tìm kiếm" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground"
          >
            Muse
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            {SECTION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Đăng tin ngay: chuẩn link /posts/new, hiển thị đẹp mắt trên cả desktop & mobile */}
          <Link
            href="/posts/new"
            className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-primary px-3 sm:px-3.5 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 cursor-pointer shrink-0"
          >
            <PlusIcon weight="bold" className="size-3.5" />
            <span>Đăng tin ngay</span>
          </Link>

          {/* Desktop Auth State */}
          <div className="hidden sm:flex items-center">
            <AuthStatusButton />
          </div>

          {/* Mobile Navigation Drawer */}
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}

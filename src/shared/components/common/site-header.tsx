import Link from "next/link";
import { AuthStatusButton } from "@/src/shared/components/common/auth-status-button";
import { MobileNavMenu } from "@/src/shared/components/common/mobile-nav-menu";
import { Button } from "@/src/shared/components/ui/button";

const SECTION_LINKS = [
  { href: "/#cach-hoat-dong", label: "Cách hoạt động" },
  { href: "/posts", label: "Kèo tuyển mẫu" },
  { href: "/search", label: "Tìm kiếm" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-3 sm:px-6">
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
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/auth" />}
          >
            Đăng tin ngay
          </Button>
          <AuthStatusButton />
        </div>
        <MobileNavMenu />
      </div>
    </header>
  );
}

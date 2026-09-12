'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRegionsQuery, useSpecialtiesQuery } from "@/src/shared/hooks/useMetadata";
import { cn } from "@/src/shared/utils";

const SUPPORT = [
  { label: "Về Muse", href: "/#top" },
  { label: "Cách hoạt động", href: "/#cach-hoat-dong" },
  { label: "Dịch vụ hỗ trợ", href: "/#dich-vu" },
  { label: "Đăng nhập / Đăng ký", href: "/auth" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const { data: specialties = [] } = useSpecialtiesQuery();
  const { data: regions = [] } = useRegionsQuery();

  // On mobile, hide the complex multi-column marketing footer on app-centric views
  const isAppView =
    pathname === "/account" ||
    pathname === "/profile" ||
    pathname.startsWith("/bookings") ||
    pathname === "/posts/new";

  return (
    <footer
      className={cn(
        "border-t border-border bg-card",
        isAppView && "hidden sm:block"
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-12 sm:pb-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-foreground"
            >
              Muse
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Nền tảng kết nối thợ làm đẹp và nhiếp ảnh với mẫu thực hành &
              khách hàng tại Việt Nam.
            </p>
          </div>

          {/* Services — chuyên ngành thật từ API, không còn danh sách cứng */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Dịch vụ phổ biến
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {specialties.map((s) => {
                const id = s.id || s.ID;
                const name = s.name || s.Name;
                return (
                  <li key={id}>
                    <Link
                      href={`/posts?specialty=${id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Regions — khu vực thật từ API */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Khu vực</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {regions.map((r) => {
                const id = r.id || r.ID;
                const name = r.name || r.Name;
                return (
                  <li key={id}>
                    <Link
                      href={`/posts?region=${id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {SUPPORT.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-2.5 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:mt-10 sm:flex-row sm:justify-between sm:text-left">
          <p>© {year} Muse. All rights reserved.</p>
          <p className="max-w-md leading-relaxed">
            Nền tảng kết nối thợ làm đẹp &amp; nhiếp ảnh với mẫu, khách hàng.
          </p>
        </div>
      </div>
    </footer>
  );
}

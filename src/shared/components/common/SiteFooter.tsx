import Link from "next/link";

const SERVICES = [
  { label: "Trang điểm dự tiệc", href: "/posts?category=makeup" },
  { label: "Trang điểm cô dâu", href: "/posts?category=makeup" },
  { label: "Làm nail & vẽ nghệ thuật", href: "/posts?category=nail" },
  { label: "Nối mi & uốn mi", href: "/posts?category=nail" },
  { label: "Chụp ảnh chân dung", href: "/posts?category=photo" },
  { label: "Chụp ảnh concept / ngoại cảnh", href: "/posts?category=photo" },
];

const REGIONS = [
  { label: "TP. Hồ Chí Minh", href: "/posts?city=hcm" },
  { label: "Hà Nội", href: "/posts?city=hanoi" },
  { label: "Đà Nẵng", href: "/posts?city=danang" },
];

const SUPPORT = [
  { label: "Về Muse", href: "/#top" },
  { label: "Cách hoạt động", href: "/#cach-hoat-dong" },
  { label: "Dịch vụ hỗ trợ", href: "/#dich-vu" },
  { label: "Đăng nhập / Đăng ký", href: "/auth" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 sm:px-6 sm:py-12 sm:pb-12">
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

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Dịch vụ phổ biến
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {SERVICES.map((item) => (
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

          {/* Regions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Khu vực</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {REGIONS.map((item) => (
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

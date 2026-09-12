import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/shared/utils";
import { SiteHeader } from "@/src/shared/components/common/SiteHeader";
import { SiteFooter } from "@/src/shared/components/common/SiteFooter";
import { MobileBottomNav } from "@/src/shared/components/common/MobileBottomNav";
import { QueryProvider } from "@/src/core/providers/query-provider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Muse — Kết nối thợ làm đẹp, nhiếp ảnh với mẫu & khách hàng",
  description:
    "Muse giúp thợ và học viên makeup, nail, nhiếp ảnh đăng tin tìm mẫu hoặc nhận booking, xây dựng portfolio đáng tin cậy và kết nối trực tiếp với khách hàng.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      translate="no"
      className={cn("h-full", "antialiased", beVietnamPro.variable)}
    >
      <body className="min-h-full flex flex-col w-full max-w-full overflow-x-clip">
        <QueryProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col pb-20 sm:pb-0 w-full min-w-0 overflow-x-clip">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}

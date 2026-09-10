import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountPage } from "@/src/features/account/page";

export const metadata: Metadata = {
  title: "Tài khoản của tôi | Muse",
  description: "Quản lý bài đăng tuyển mẫu, bài viết đã lưu và thông tin tài khoản tại Muse.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-4xl px-3 py-8 sm:px-6 animate-pulse">
          <div className="h-24 w-full bg-muted rounded-3xl mb-6" />
          <div className="h-10 w-full bg-muted rounded-2xl mb-6" />
          <div className="h-48 w-full bg-muted rounded-3xl" />
        </div>
      }
    >
      <AccountPage />
    </Suspense>
  );
}

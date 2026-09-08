import type { Metadata } from "next";
import { AccountPage } from "@/src/features/account/page";

export const metadata: Metadata = {
  title: "Tài khoản của tôi | Muse",
  description: "Quản lý bài đăng tuyển mẫu, bài viết đã lưu và thông tin tài khoản tại Muse.",
};

export default function Page() {
  return <AccountPage />;
}

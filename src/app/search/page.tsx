import type { Metadata } from "next";
import { SearchPage } from "@/src/features/search/page";

export const metadata: Metadata = {
  title: "Tìm kiếm & Khám phá | Muse",
  description: "Khám phá các layout makeup, mẫu nail, studio nhiếp ảnh và thợ làm đẹp chuyên nghiệp tại Việt Nam.",
};

export default function Page() {
  return <SearchPage />;
}

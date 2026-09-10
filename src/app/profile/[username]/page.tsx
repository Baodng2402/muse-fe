import type { Metadata } from "next";
import { ProfilePage } from "@/src/features/profile/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | Muse Portfolio`,
    description: "Portfolio tác phẩm và kèo tuyển mẫu thực hành tại Muse.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfilePage username={username} />;
}

import type { Metadata } from "next";
import { ProfilePage } from "@/src/features/profile/page";
import { ARTIST_PROFILES } from "@/src/features/profile/mock/artists";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const artist = ARTIST_PROFILES[username];
  return {
    title: artist ? `${artist.name} (@${artist.username}) | Muse Portfolio` : "Nghệ nhân | Muse",
    description: artist?.bio || "Portfolio tác phẩm và kèo tuyển mẫu thực hành tại Muse.",
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

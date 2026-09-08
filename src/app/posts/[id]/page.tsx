import { notFound } from "next/navigation";
import { POSTS } from "@/src/features/posts/mock/posts";
import { PostDetailPage } from "@/src/features/posts/page/detail";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = POSTS.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return <PostDetailPage post={post} />;
}

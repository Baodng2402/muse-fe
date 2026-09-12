import { notFound } from "next/navigation";
import { postsApi } from "@/src/features/posts/api/api.posts";
import { normalizePost } from "@/src/features/posts/utils/normalize-post";
import { PostDetailPage } from "@/src/features/posts/page/detail";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post = null;
  try {
    const rawData = await postsApi.getPostById(id);
    if (rawData) {
      post = normalizePost(rawData);
    }
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return <PostDetailPage post={post} />;
}

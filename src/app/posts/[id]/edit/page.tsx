import type { Metadata } from 'next';
import { EditPostPage } from '@/src/features/posts/page/edit-post';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài đăng | Muse',
  description: 'Chỉnh sửa bài đăng tuyển mẫu hoặc booking dịch vụ tại Muse.',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPostPage postId={id} />;
}

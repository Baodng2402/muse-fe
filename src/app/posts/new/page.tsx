import { Metadata } from 'next';
import { CreatePostPage } from '@/src/features/posts/page/create-post';

export const metadata: Metadata = {
  title: 'Tạo bài đăng mới | Muse',
  description: 'Đăng tin tuyển mẫu thực hành makeup, nail hoặc nhận lịch khách hàng trên Muse.',
};

export default function NewPostPage() {
  return <CreatePostPage />;
}

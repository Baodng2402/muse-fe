import type { Metadata } from 'next';
import { RegionsDashboard } from '@/src/features/admin/regions/RegionsDashboard';

export const metadata: Metadata = {
  title: 'Quản lý Khu vực | Admin Muse',
  description: 'Bảng điều khiển quản lý danh sách tỉnh thành hỗ trợ trên Muse.',
};

export default function Page() {
  return <RegionsDashboard />;
}

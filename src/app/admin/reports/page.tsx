import type { Metadata } from 'next';
import { ReportsDashboard } from '@/src/features/admin/reports/ReportsDashboard';

export const metadata: Metadata = {
  title: 'Quản lý Báo cáo | Admin Muse',
  description: 'Bảng điều khiển quản lý và xử lý báo cáo vi phạm cộng đồng Muse.',
};

export default function Page() {
  return <ReportsDashboard />;
}

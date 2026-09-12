import type { Metadata } from 'next';
import { BookingsPage } from '@/src/features/bookings/page/BookingsPage';

export const metadata: Metadata = {
  title: 'Quản lý Lịch hẹn & Booking | Muse',
  description: 'Theo dõi lịch hẹn dịch vụ và tuyển mẫu làm đẹp tại Muse.',
};

export default function Page() {
  return <BookingsPage />;
}

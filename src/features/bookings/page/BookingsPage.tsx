'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheckIcon,
  ClockIcon,
  SparkleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/Avatar';
import { useAuthStore } from '@/src/shared/store/store.auth';
import {
  useClientBookingsQuery,
  useProviderBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../hooks/useBookings';
import { isProvider } from '@/src/shared/utils/user-roles';
import { Button } from '@/src/shared/components/ui/Button';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/components/ui/AlertDialog';
import { CreateReviewModal } from '@/src/features/reviews/components/CreateReviewModal';
import { cn } from '@/src/shared/utils';
import type { BookingStatus } from '@/src/core/api/types';

const STATUS_MAP: Record<BookingStatus, { label: string; className: string }> = {
  scheduled: {
    label: 'Sắp diễn ra',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50',
  },
  completed: {
    label: 'Đã hoàn thành',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50',
  },
  no_show: {
    label: 'Vắng mặt',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50',
  },
};

export function BookingsPage() {
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const [activeRole, setActiveRole] = useState<'client' | 'provider'>('client');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

  const { data: clientBookings = [], isLoading: isClientLoading } = useClientBookingsQuery();
  const { data: providerBookings = [], isLoading: isProviderLoading } = useProviderBookingsQuery();
  const updateStatusMutation = useUpdateBookingStatusMutation();

  const userIsProvider = isProvider(currentUser);
  const currentList = activeRole === 'client' ? clientBookings : providerBookings;
  const isLoading = activeRole === 'client' ? isClientLoading : isProviderLoading;

  const filteredList = Array.isArray(currentList)
    ? currentList.filter((b) => (statusFilter === 'all' ? true : b.status === statusFilter))
    : [];

  const handleStatusUpdate = (id: string, nextStatus: BookingStatus) => {
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  if (hasHydrated && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <CalendarCheckIcon className="mx-auto size-12 text-primary mb-3" />
          <h2 className="text-xl font-bold text-foreground">Đăng nhập để xem lịch hẹn</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Vui lòng đăng nhập tài khoản Muse để theo dõi các cuộc hẹn làm đẹp, chụp ảnh và tuyển mẫu.
          </p>
          <div className="mt-6">
            <Link
              href="/auth?redirect=/bookings"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-xs shadow-primary/20 hover:bg-primary/90"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheckIcon className="size-6 text-primary" />
            Quản lý Lịch hẹn & Booking
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi tiến độ, lịch hẹn dịch vụ và ca thực hành của bạn.
          </p>
        </div>

        <Link
          href="/posts"
          className="mt-3 sm:mt-0 inline-flex h-9 items-center gap-1.5 self-start rounded-xl border border-primary/30 bg-primary/10 px-3.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-98"
        >
          <MagnifyingGlassIcon className="size-3.5" />
          Khám phá thợ & kèo tuyển mẫu
        </Link>
      </div>

      {/* Role Selector (if user is provider) */}
      {userIsProvider && (
        <div className="flex rounded-2xl bg-muted/60 p-1 mb-5 border border-border/60 max-w-sm">
          <button
            type="button"
            onClick={() => setActiveRole('client')}
            className={cn(
              'flex-1 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer text-center',
              activeRole === 'client'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Lịch tôi đã đặt
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('provider')}
            className={cn(
              'flex-1 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer text-center',
              activeRole === 'provider'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Lịch khách đặt tôi
          </button>
        </div>
      )}

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => {
          const label =
            status === 'all'
              ? 'Tất cả'
              : status === 'scheduled'
              ? 'Sắp diễn ra'
              : status === 'completed'
              ? 'Đã xong'
              : 'Đã hủy';
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer border',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="h-28 w-full bg-muted rounded-2xl" />
          <div className="h-28 w-full bg-muted rounded-2xl" />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xs">
          <SparkleIcon className="mx-auto size-12 text-primary/40 mb-3" />
          <h3 className="text-base font-bold text-foreground">Chưa có lịch hẹn nào</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {activeRole === 'client'
              ? 'Bạn chưa đặt lịch với nghệ nhân nào. Hãy tìm kiếm thợ trang điểm hoặc nhiếp ảnh gia để đặt lịch ngay!'
              : 'Hiện chưa có khách hàng nào đặt lịch mới.'}
          </p>
          <div className="mt-5">
            <Link
              href="/posts"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Tìm bài đăng phù hợp
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredList.map((booking) => {
            const statusBadge = STATUS_MAP[booking.status] || {
              label: booking.status,
              className: 'bg-muted text-muted-foreground',
            };

            const startDate = new Date(booking.scheduled_start_at).toLocaleString('vi-VN', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const isScheduled = booking.status === 'scheduled';
            const isCompleted = booking.status === 'completed';

            const partnerName =
              activeRole === 'client'
                ? booking.provider_name || 'Nghệ nhân'
                : booking.customer_name || 'Khách hàng';
            const partnerAvatar =
              activeRole === 'client' ? booking.provider_avatar : booking.customer_avatar;
            const partnerPhone =
              activeRole === 'client' ? booking.provider_phone : booking.customer_phone;

            return (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar size="default" className="shrink-0 mt-0.5 border border-border/60">
                    {partnerAvatar ? (
                      <AvatarImage src={partnerAvatar} alt={partnerName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {partnerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs font-bold',
                          statusBadge.className
                        )}
                      >
                        {statusBadge.label}
                      </span>
                      <span className="text-sm font-bold text-foreground">{startDate}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-foreground">
                      <span>{activeRole === 'client' ? 'Với thợ:' : 'Khách:'} {partnerName}</span>
                      {partnerPhone && (
                        <span className="text-muted-foreground font-normal">• {partnerPhone}</span>
                      )}
                    </div>

                    {booking.service_name && (
                      <p className="text-xs text-primary font-medium mt-0.5">
                        Dịch vụ: {booking.service_name}
                      </p>
                    )}

                    {booking.note && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed bg-muted/40 rounded-lg px-2 py-1">
                        Ghi chú: {booking.note}
                      </p>
                    )}

                    <p className="text-[11px] text-muted-foreground/70 mt-1.5 font-mono">
                      Mã: {booking.id.slice(0, 8)}... • Tạo {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons Group with generous spacing */}
                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto border-border/40">
                  {/* Scheduled state: Customer or Provider can cancel */}
                  {isScheduled && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircleIcon className="size-3.5 mr-1" />
                            Hủy lịch
                          </Button>
                        }
                      />
                      <AlertDialogPopup>
                        <div className="flex flex-col gap-2">
                          <AlertDialogTitle>Xác nhận hủy lịch hẹn?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Lịch hẹn vào lúc {startDate} sẽ bị hủy bỏ. Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                          <AlertDialogClose render={<Button variant="outline" size="default" />}>
                            Giữ lại
                          </AlertDialogClose>
                          <AlertDialogClose
                            render={
                              <Button
                                variant="destructive"
                                size="default"
                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              >
                                Xác nhận hủy
                              </Button>
                            }
                          />
                        </div>
                      </AlertDialogPopup>
                    </AlertDialog>
                  )}

                  {/* Scheduled state: Provider can mark completed */}
                  {isScheduled && activeRole === 'provider' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircleIcon className="size-3.5 mr-1" />
                      Hoàn thành ca
                    </Button>
                  )}

                  {/* Completed state: Customer can write review */}
                  {isCompleted && activeRole === 'client' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewBookingId(booking.id)}
                      className="border-amber-400/40 text-amber-600 hover:bg-amber-500/10"
                    >
                      <StarIcon weight="fill" className="size-3.5 mr-1 text-amber-500" />
                      Viết đánh giá
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <CreateReviewModal
          bookingId={reviewBookingId}
          isOpen={Boolean(reviewBookingId)}
          onClose={() => setReviewBookingId(null)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { XIcon, CalendarBlankIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/button';
import { useCreateBookingMutation } from '../hooks/use-bookings';
import { useAuthStore } from '@/src/shared/store/use-auth-store';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerProfileId: string;
  providerName: string;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  providerProfileId,
  providerName,
}: CreateBookingModalProps) {
  const user = useAuthStore((s) => s.user);
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: createBooking, isPending, error } = useCreateBookingMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledStart) return;

    // Default 1 hour duration if end time not set
    const startDate = new Date(scheduledStart);
    const endDate = scheduledEnd
      ? new Date(scheduledEnd)
      : new Date(startDate.getTime() + 60 * 60 * 1000);

    createBooking(
      {
        customer_user_id: user?.id || '00000000-0000-0000-0000-000000000001',
        provider_profile_id: providerProfileId || '00000000-0000-0000-0000-000000000001',
        scheduled_start_at: startDate.toISOString(),
        scheduled_end_at: endDate.toISOString(),
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
          }, 1800);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Đóng"
        >
          <XIcon className="size-4" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon weight="fill" className="size-16 text-emerald-500 mb-3" />
            <h3 className="text-lg font-bold text-foreground">Đặt lịch hẹn thành công!</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Yêu cầu của bạn đã được gửi tới {providerName}. Họ sẽ liên hệ để xác nhận lịch sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CalendarBlankIcon className="size-5 text-primary" />
                Đặt lịch hẹn với {providerName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chọn thời gian mong muốn và gửi lời nhắn cho thợ.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {(error as Error).message || 'Không thể tạo lịch hẹn. Vui lòng thử lại.'}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Thời gian kết thúc (tùy chọn)
              </label>
              <input
                type="datetime-local"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Ghi chú hoặc yêu cầu đặc biệt
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Cần tone makeup nhẹ nhàng chụp kỷ yếu..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl border border-input bg-background p-3 text-xs font-medium text-foreground outline-none focus-visible:border-primary resize-none"
              />
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isPending}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !scheduledStart}
              >
                {isPending ? 'Đang gửi yêu cầu...' : 'Xác nhận đặt lịch'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

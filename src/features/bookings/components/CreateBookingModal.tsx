'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarBlankIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { Button, buttonVariants } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/src/shared/components/ui/Modal';
import { useCreateBookingMutation } from '../hooks/useBookings';
import { useAuthStore } from '@/src/shared/store/store.auth';

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
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon weight="fill" className="size-16 text-emerald-500 mb-3" />
            <h3 className="text-lg font-bold text-foreground">Đặt lịch hẹn thành công!</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Yêu cầu của bạn đã được gửi tới {providerName}. Họ sẽ liên hệ để xác nhận lịch sớm nhất.
            </p>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarBlankIcon className="size-12 text-primary mb-3" />
            <h3 className="text-base font-bold text-foreground">Đăng nhập để đặt lịch</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Vui lòng đăng nhập tài khoản để gửi yêu cầu đặt lịch hẹn với {providerName}.
            </p>
            <div className="mt-5">
              <Link
                href="/auth"
                className={buttonVariants({ variant: 'default', size: 'default' })}
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                <CalendarBlankIcon className="size-5 text-primary" />
                Đặt lịch hẹn với {providerName}
              </ModalTitle>
              <ModalDescription>Chọn thời gian mong muốn và gửi lời nhắn cho thợ.</ModalDescription>
            </ModalHeader>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {(error as Error).message || 'Không thể tạo lịch hẹn. Vui lòng thử lại.'}
              </div>
            )}

            <Field>
              <FieldLabel>
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="datetime-local"
                required
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Thời gian kết thúc (tùy chọn)</FieldLabel>
              <Input
                type="datetime-local"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Ghi chú hoặc yêu cầu đặc biệt</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Ví dụ: Cần tone makeup nhẹ nhàng chụp kỷ yếu..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isPending || !scheduledStart}>
                {isPending ? 'Đang gửi yêu cầu...' : 'Xác nhận đặt lịch'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

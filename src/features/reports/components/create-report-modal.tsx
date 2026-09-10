'use client';

import React, { useState } from 'react';
import { XIcon, WarningCircleIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/button';
import { useCreateReportMutation } from '../hooks/use-reports';
import type { ReportTargetType } from '@/src/core/api/types';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: ReportTargetType;
  targetTitle?: string;
}

const REPORT_REASONS = [
  'Lừa đảo hoặc gian lận chi phí',
  'Thông tin địa điểm / dịch vụ sai lệch',
  'Nội dung phản cảm hoặc không phù hợp',
  'Spam hoặc trùng lặp nhiều lần',
  'Thái độ hoặc hành vi không chuẩn mực',
  'Lý do khác',
];

export function CreateReportModal({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
}: CreateReportModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: createReport, isPending, error } = useCreateReportMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport(
      {
        target_type: targetType,
        target_id: targetId,
        reason: selectedReason,
        description: description.trim() || undefined,
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
            <h3 className="text-lg font-bold text-foreground">Đã gửi báo cáo vi phạm</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Cảm ơn bạn đã hỗ trợ xây dựng cộng đồng Muse an toàn. Đội ngũ kiểm duyệt sẽ xử lý trong 24 giờ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 text-destructive">
                <WarningCircleIcon className="size-5" />
                Báo cáo vi phạm
              </h3>
              {targetTitle && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Đối tượng: <span className="font-semibold text-foreground">{targetTitle}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {(error as Error).message || 'Có lỗi xảy ra khi gửi báo cáo.'}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Lý do báo cáo <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none focus-visible:border-primary cursor-pointer shadow-2xs"
              >
                {REPORT_REASONS.map((reason) => (
                  <option key={reason} value={reason} className="py-2 text-sm">
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Mô tả chi tiết vi phạm
              </label>
              <textarea
                rows={3}
                placeholder="Cung cấp thêm thông tin hoặc bằng chứng (nếu có)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                variant="destructive"
                size="sm"
                disabled={isPending}
              >
                {isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

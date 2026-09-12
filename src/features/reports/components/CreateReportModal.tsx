'use client';

import React, { useState } from 'react';
import { WarningCircleIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/Select';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/src/shared/components/ui/Modal';
import { useCreateReportMutation } from '../hooks/useReports';
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

const REPORT_REASON_ITEMS = REPORT_REASONS.map((reason) => ({ value: reason, label: reason }));

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
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
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
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2 text-destructive">
                <WarningCircleIcon className="size-5" />
                Báo cáo vi phạm
              </ModalTitle>
              {targetTitle && (
                <p className="text-xs text-muted-foreground truncate">
                  Đối tượng: <span className="font-semibold text-foreground">{targetTitle}</span>
                </p>
              )}
            </ModalHeader>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {(error as Error).message || 'Có lỗi xảy ra khi gửi báo cáo.'}
              </div>
            )}

            <Field>
              <FieldLabel>
                Lý do báo cáo <span className="text-destructive">*</span>
              </FieldLabel>
              <Select items={REPORT_REASON_ITEMS} value={selectedReason} onValueChange={(v) => setSelectedReason(v as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Mô tả chi tiết vi phạm</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Cung cấp thêm thông tin hoặc bằng chứng (nếu có)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
                {isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

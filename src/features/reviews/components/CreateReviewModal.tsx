'use client';

import React, { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/src/shared/components/ui/Modal';
import { useCreateReviewMutation } from '../hooks/useReviews';
import { cn } from '@/src/shared/utils';

interface CreateReviewModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateReviewModal({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: CreateReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createReviewMutation = useCreateReviewMutation(bookingId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (rating < 1 || rating > 5) {
      setErrorMsg('Vui lòng chọn số sao từ 1 đến 5.');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Vui lòng nhập nhận xét của bạn.');
      return;
    }

    createReviewMutation.mutate(
      { rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setComment('');
          setRating(5);
          onClose();
          onSuccess?.();
        },
        onError: (err) => {
          setErrorMsg((err as Error).message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
        },
      }
    );
  };

  const activeStars = hoverRating !== null ? hoverRating : rating;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle className="text-lg font-bold">Đánh giá dịch vụ</ModalTitle>
          <ModalDescription className="text-xs text-muted-foreground">
            Chia sẻ trải nghiệm thực tế để giúp cộng đồng và nghệ nhân phát triển.
          </ModalDescription>
        </ModalHeader>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Mức độ hài lòng ({activeStars} / 5 sao)</FieldLabel>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label={`${star} sao`}
                >
                  <StarIcon
                    weight={star <= activeStars ? 'fill' : 'regular'}
                    className={cn(
                      'size-7 transition-colors',
                      star <= activeStars ? 'text-amber-400' : 'text-muted-foreground/40'
                    )}
                  />
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel>Nhận xét chi tiết</FieldLabel>
            <Textarea
              rows={4}
              required
              placeholder="Tay nghề thợ ra sao? Thái độ phục vụ và độ đúng giờ thế nào..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </Field>

          <ModalFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
              disabled={createReviewMutation.isPending}
            >
              Để sau
            </Button>
            <Button
              type="submit"
              size="default"
              disabled={createReviewMutation.isPending || !comment.trim()}
            >
              {createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

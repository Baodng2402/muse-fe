'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ChatCircleDotsIcon,
  CheckIcon,
  CopyIcon,
} from '@phosphor-icons/react/dist/ssr';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/src/shared/components/ui/Modal';
import { Button } from '@/src/shared/components/ui/Button';
import type { Post } from '../types';

interface PostShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  authorUsername: string;
}

export function PostShareModal({
  isOpen,
  onClose,
  post,
  authorUsername,
}: PostShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyZaloMessage = () => {
    if (typeof window !== 'undefined') {
      const msg = `[Tuyển mẫu Muse] ${post.title}\n📍 Địa điểm: ${post.area}\n⏰ Thời gian: ${
        post.timeSlot || post.date
      }\n🎁 Quyền lợi: ${post.benefitTag || post.offer}\n🔗 Xem chi tiết và đăng ký: ${
        window.location.href
      }`;
      navigator.clipboard?.writeText(msg);
      setCopiedZalo(true);
      setTimeout(() => setCopiedZalo(false), 2500);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Chia sẻ tin tuyển mẫu</ModalTitle>
          <ModalDescription>
            Gửi trực tiếp cho bạn bè hoặc lưu ảnh đăng Story.
          </ModalDescription>
        </ModalHeader>

        {/* Poster Story Preview 9:16 Mini */}
        <div className="relative aspect-9/14 w-full overflow-hidden rounded-2xl border border-border/80 bg-stone-900 text-white shadow-md">
          <Image
            src={post.imageUrl!}
            alt={post.title}
            fill
            sizes="340px"
            className="object-cover filter brightness-[0.72]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

          {/* Top watermark */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-white">MUSE</span>
            <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
              {post.benefitTag || post.offer}
            </span>
          </div>

          {/* Bottom specs on poster */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 text-left">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              {post.type === 'tim-mau' ? 'Tuyển Mẫu Thực Hành' : 'Dịch Vụ Pro'}
            </span>
            <h4 className="text-xs font-bold leading-tight text-white line-clamp-2">
              {post.title}
            </h4>
            <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-white/90">
              <span>⏰ {post.timeSlot || post.date}</span>
              <span>📍 {post.area}</span>
              {post.slotsAvailable !== undefined && (
                <span className="text-emerald-300 font-bold">
                  🔥 Còn {post.slotsAvailable} slot đăng ký
                </span>
              )}
            </div>
            <div className="mt-2 pt-1.5 border-t border-white/20 flex items-center justify-between text-[9px] text-white/70">
              <span>by @{authorUsername}</span>
              <span>muse.vn</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleCopyZaloMessage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
          >
            <ChatCircleDotsIcon weight="fill" className="size-4 mr-1.5" />
            {copiedZalo ? 'Đã sao chép lời nhắn Zalo!' : 'Sao chép lời nhắn gửi Zalo'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="w-full"
          >
            {copiedLink ? (
              <>
                <CheckIcon className="size-4 mr-1.5 text-emerald-600" />
                Đã sao chép link bài đăng!
              </>
            ) : (
              <>
                <CopyIcon className="size-4 mr-1.5" />
                Sao chép liên kết bài viết
              </>
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  XIcon,
  ChatCircleDotsIcon,
  CheckIcon,
  CopyIcon,
} from '@phosphor-icons/react/dist/ssr';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Đóng"
        >
          <XIcon className="size-4" />
        </button>

        <h3 className="text-sm font-bold text-foreground">Chia sẻ tin tuyển mẫu</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gửi trực tiếp cho bạn bè hoặc lưu ảnh đăng Story.
        </p>

        {/* Poster Story Preview 9:16 Mini */}
        <div className="mt-3 relative aspect-9/14 w-full overflow-hidden rounded-2xl border border-border/80 bg-stone-900 text-white shadow-md">
          <Image
            src={
              (post as { imageUrl?: string }).imageUrl ||
              (post.imageId
                ? `https://images.unsplash.com/${post.imageId}?w=500&h=750&fit=crop&q=80&auto=format`
                : 'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=500&h=750&fit=crop&q=80')
            }
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
          <button
            type="button"
            onClick={handleCopyZaloMessage}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-98 cursor-pointer"
          >
            <ChatCircleDotsIcon weight="fill" className="size-4" />
            {copiedZalo ? 'Đã sao chép lời nhắn Zalo!' : 'Sao chép lời nhắn gửi Zalo'}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 rounded-xl border border-input bg-background py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-98 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <CheckIcon className="size-4 text-emerald-600" />
                Đã sao chép link bài đăng!
              </>
            ) : (
              <>
                <CopyIcon className="size-4" />
                Sao chép liên kết bài viết
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

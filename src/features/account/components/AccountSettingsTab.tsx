'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/src/shared/components/ui/button';
import { useUpdateProfileMutation } from '../hooks/use-user';
import type { UserDTO } from '@/src/core/api/types';

interface AccountSettingsTabProps {
  user: UserDTO;
}

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const [displayName, setDisplayName] = useState(user.display_name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateMutation = useUpdateProfileMutation();

  useEffect(() => {
    setDisplayName(user.display_name || '');
    setPhone(user.phone || '');
    setBio(user.bio || '');
    setAvatarUrl(user.avatar_url || '');
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    updateMutation.mutate(
      {
        display_name: displayName.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          setFeedback({ type: 'success', message: 'Cập nhật thông tin tài khoản thành công!' });
          setTimeout(() => setFeedback(null), 3500);
        },
        onError: (err) => {
          setFeedback({ type: 'error', message: err.message || 'Cập nhật thất bại. Vui lòng thử lại!' });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-5 shadow-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Cài đặt thông tin tài khoản</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý thông tin hồ sơ của bạn trên Muse.
        </p>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-3 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
              : 'bg-destructive/10 border border-destructive/20 text-destructive'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground">Tên hiển thị</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          placeholder="Nhập tên hiển thị của bạn"
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground">Email</label>
        <input
          type="email"
          disabled
          value={user.email || ''}
          className="rounded-xl border border-input bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground outline-none cursor-not-allowed"
        />
        <span className="text-[10px] text-muted-foreground">Email đăng nhập không thể thay đổi</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground">Số điện thoại liên hệ</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground">Link ảnh đại diện (Avatar URL)</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground">Tiểu sử (Bio / Giới thiệu bản thân)</label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Mô tả phong cách, chuyên môn hoặc định hướng làm việc của bạn..."
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary resize-none"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={updateMutation.isPending}
          className="rounded-xl font-bold cursor-pointer"
        >
          {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
}


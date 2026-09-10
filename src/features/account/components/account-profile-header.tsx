'use client';

import React from 'react';
import { SignOutIcon, UserCircleIcon } from '@phosphor-icons/react/dist/ssr';
import type { UserDTO } from '@/src/core/api/types';

interface AccountProfileHeaderProps {
  user: UserDTO;
  onLogout: () => void;
}

export function AccountProfileHeader({ user, onLogout }: AccountProfileHeaderProps) {
  const displayName = user.display_name || user.email?.split('@')[0] || 'Thành viên Muse';

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="relative size-14 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shrink-0">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={displayName}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
              <UserCircleIcon weight="fill" className="size-8" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-foreground">
              {displayName}
            </h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-bold text-primary">
              {user.is_admin ? 'Quản trị viên' : user.is_provider ? 'Nghệ nhân / Thợ' : 'Thành viên'}
            </span>
          </div>
          {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
          {user.phone && <p className="text-[11px] text-muted-foreground">{user.phone}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive active:scale-98 cursor-pointer"
      >
        <SignOutIcon className="size-4" />
        Đăng xuất
      </button>
    </div>
  );
}

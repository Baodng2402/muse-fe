'use client';

import Image from 'next/image';
import { CheckCircleIcon, UserCircleIcon } from '@phosphor-icons/react/dist/ssr';

export interface ProfileHeroStat {
  label: string;
  value: React.ReactNode;
}

interface ProfileHeroProps {
  displayName: string;
  coverUrl?: string;
  avatarUrl?: string;
  verified?: boolean;
  roleBadge?: string;
  levelBadge?: string;
  /** Dòng phụ dưới tên — email, khu vực... */
  meta?: React.ReactNode;
  stats: ProfileHeroStat[];
  /** Nút hành động — liên hệ Zalo/gọi (profile người khác) hoặc đăng xuất (tài khoản của tôi) */
  actions?: React.ReactNode;
  bio?: React.ReactNode;
}

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=400&fit=crop&q=80&auto=format';

/**
 * Hero hồ sơ dùng chung cho account/page (hồ sơ của tôi) và profile/page (xem người khác) —
 * cover + avatar chờm lên + badge + stats 3 cột, để 2 màn hình luôn nhất quán (không lệch pattern
 * như trước redesign: account từng dùng card dẹt + list-tab, profile dùng cover+grid).
 */
export function ProfileHero({
  displayName,
  coverUrl,
  avatarUrl,
  verified,
  roleBadge,
  levelBadge,
  meta,
  stats,
  actions,
  bio,
}: ProfileHeroProps) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 shadow-sm">
        <div className="relative aspect-21/9 sm:aspect-4/1 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl || DEFAULT_COVER}
            alt={displayName}
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative -mt-10 sm:-mt-12 flex flex-col items-center px-4 pb-5 text-center sm:flex-row sm:items-end sm:text-left sm:gap-4 sm:px-6 sm:pb-6">
          <div className="relative size-20 sm:size-24 overflow-hidden rounded-full border-4 border-background bg-card shadow-md shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                priority
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                <UserCircleIcon weight="fill" className="size-12" />
              </div>
            )}
          </div>

          <div className="mt-2.5 sm:mt-0 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
                {displayName}
              </h1>
              {verified && (
                <CheckCircleIcon weight="fill" className="size-4 text-blue-400 shrink-0" />
              )}
              {roleBadge && (
                <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur-md">
                  {roleBadge}
                </span>
              )}
              {levelBadge && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                  {levelBadge}
                </span>
              )}
            </div>

            {meta && <div className="text-xs text-stone-200 mt-0.5">{meta}</div>}
          </div>

          {actions && <div className="mt-3.5 sm:mt-0 flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col gap-3">
        <div
          className="grid divide-x divide-border/60 text-center py-1"
          style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-base sm:text-lg font-extrabold text-foreground">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {bio && (
          <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed border-t border-border/50 pt-2.5">
            {bio}
          </div>
        )}
      </div>
    </div>
  );
}

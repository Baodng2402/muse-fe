'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CrownIcon } from '@phosphor-icons/react/dist/ssr';
import { useSpecialtiesQuery } from '@/src/features/posts/hooks/usePosts';
import type { Specialty } from '@/src/core/api/types';

/** Ảnh + màu nền trang trí theo tên chuyên ngành THẬT — chỉ để hiển thị, không phải dữ liệu. */
const SPECIALTY_STYLE: Record<string, { imageId: string; gradient: string }> = {
  'Trang điểm': { imageId: 'photo-1512496015851-a90fb38ba796', gradient: 'from-rose-500 to-pink-500' },
  Nail: { imageId: 'photo-1632345031435-8727f6897d53', gradient: 'from-purple-500 to-indigo-500' },
  'Chụp ảnh': { imageId: 'photo-1643217427489-5a58ebbce99e', gradient: 'from-blue-500 to-cyan-500' },
};
const DEFAULT_STYLE = { imageId: 'photo-1522337360788-8b13dee7a37e', gradient: 'from-primary to-accent-foreground' };

export function StoryCategoriesBar() {
  const { data: rawSpecialties = [] } = useSpecialtiesQuery();

  const items = useMemo(() => {
    const specialtyItems = (rawSpecialties as Specialty[]).map((s) => {
      const name = s.name || s.Name || 'Khác';
      const style = SPECIALTY_STYLE[name] || DEFAULT_STYLE;
      return {
        id: s.id || s.ID,
        name,
        href: `/posts?specialty=${s.id || s.ID}`,
        ...style,
      };
    });

    // Lối tắt thật (không phải chuyên ngành) — điều hướng đúng bằng filter/tab đã có sẵn.
    return [
      ...specialtyItems,
      {
        id: 'pro',
        name: 'Thợ Pro',
        href: '/posts?tab=nhan-booking',
        imageId: 'photo-1730486559425-45221a85d6dd',
        gradient: 'from-amber-400 to-yellow-600',
      },
    ];
  }, [rawSpecialties]);

  return (
    <section>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Khám phá theo nhu cầu
        </h2>
        <Link href="/posts" className="text-xs font-semibold text-primary hover:underline">
          Xem tất cả →
        </Link>
      </div>

      <div className="w-full max-w-full min-w-0 flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`flex size-14 sm:size-16 items-center justify-center rounded-full bg-gradient-to-tr ${item.gradient} p-0.5 transition-transform duration-300 group-hover:scale-105 active:scale-95 shadow-sm`}
            >
              <div className="relative size-full overflow-hidden rounded-full border-2 border-background bg-muted">
                <Image
                  src={`https://images.unsplash.com/${item.imageId}?w=120&h=120&fit=crop&q=80&auto=format`}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.id === 'pro' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <CrownIcon weight="fill" className="size-5 text-amber-300" />
                  </div>
                )}
              </div>
            </div>

            <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

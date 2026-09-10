import Image from 'next/image';
import Link from 'next/link';

export const STORY_CATEGORIES = [
  {
    id: 'makeup',
    name: 'Makeup',
    sub: 'Layout tiệc, cô dâu',
    imageId: 'photo-1512496015851-a90fb38ba796',
    href: '/posts?category=makeup',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'nail',
    name: 'Nail & Mi',
    sub: 'Đắp gel, móng úp',
    imageId: 'photo-1632345031435-8727f6897d53',
    href: '/posts?category=nail',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'photo',
    name: 'Nhiếp ảnh',
    sub: 'Lookbook & chân dung',
    imageId: 'photo-1643217427489-5a58ebbce99e',
    href: '/posts?category=photo',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'urgent',
    name: 'Kèo gấp',
    sub: 'Hôm nay & ngày mai',
    imageId: 'photo-1679141335462-547b83aa99f5',
    href: '/posts',
    gradient: 'from-amber-500 to-rose-500',
  },
  {
    id: 'pro',
    name: 'Thợ Pro',
    sub: 'Dịch vụ cao cấp',
    imageId: 'photo-1730486559425-45221a85d6dd',
    href: '/posts',
    gradient: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'free',
    name: 'Free 100%',
    sub: 'Tài trợ toàn bộ',
    imageId: 'photo-1534528741775-53994a69daeb',
    href: '/posts',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export function StoryCategoriesBar() {
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
        {STORY_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`flex size-14 sm:size-16 items-center justify-center rounded-full bg-gradient-to-tr ${cat.gradient} p-0.5 transition-transform duration-300 group-hover:scale-105 active:scale-95 shadow-sm`}
            >
              <div className="relative size-full overflow-hidden rounded-full border-2 border-background bg-muted">
                <Image
                  src={`https://images.unsplash.com/${cat.imageId}?w=120&h=120&fit=crop&q=80&auto=format`}
                  alt={cat.name}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

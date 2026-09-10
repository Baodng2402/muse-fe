import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

export function EditorialHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 text-white shadow-lg">
      <div className="relative aspect-16/10 sm:aspect-21/9 w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&h=600&fit=crop&q=85&auto=format"
          alt="Muse Beauty Editorial"
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover object-[center_35%] filter brightness-[0.78]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-300">
            Sàn Kết Nối Mẫu Ảnh & Thợ Làm Đẹp
          </div>

          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
            Nơi tài năng tỏa sáng. <br className="hidden sm:block" />
            Tuyển mẫu nhanh, đặt lịch thợ xịn.
          </h1>

          <p className="mt-1 max-w-lg text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-none">
            Học viên makeup, nail, nhiếp ảnh tìm mẫu thực hành tay nghề. Thợ chuyên nghiệp kết nối
            trực tiếp khách hàng.
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
            >
              Khám phá kèo mẫu
            </Link>

            <Link
              href="/posts/new"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <PlusIcon weight="bold" className="size-4" />
              Đăng tin tuyển mẫu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

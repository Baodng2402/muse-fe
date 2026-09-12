import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

export function EditorialHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 text-white shadow-xl">
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[500px] w-full flex flex-col justify-end p-6 sm:p-10 lg:p-12 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&h=800&fit=crop&q=85&auto=format"
          alt="Muse Beauty Editorial"
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover object-[center_30%] filter brightness-[0.72]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

        <div className="relative z-10 flex flex-col max-w-2xl">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-200 backdrop-blur-md border border-white/20">
            Sàn Kết Nối Mẫu Ảnh & Thợ Làm Đẹp
          </div>

          <h1 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Nơi tài năng tỏa sáng. <br className="hidden sm:block" />
            Tuyển mẫu nhanh, đặt lịch thợ xịn.
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-white/85 leading-relaxed">
            Học viên makeup, nail, nhiếp ảnh tìm mẫu thực hành tay nghề. Thợ chuyên nghiệp kết nối
            trực tiếp khách hàng khắp Việt Nam.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/posts"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Khám phá kèo mẫu
            </Link>

            <Link
              href="/posts/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
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

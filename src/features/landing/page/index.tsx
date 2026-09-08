import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CameraIcon,
  CheckCircleIcon,
  ClockIcon,
  CrownIcon,
  FireIcon,
  GiftIcon,
  HeartIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaletteIcon,
  PlusIcon,
  ShieldCheckIcon,
  SprayBottleIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { POSTS } from "@/src/features/posts/mock/posts";

/**
 * Danh mục Story Circles (Phong cách Instagram Story / Xiaohongshu)
 * Tạo cảm giác sản phẩm sống động, thân quen và hiện đại cho Mobile.
 */
const STORY_CATEGORIES = [
  {
    id: "makeup",
    name: "Makeup",
    sub: "Layout tiệc, cô dâu",
    imageId: "photo-1512496015851-a90fb38ba796",
    href: "/posts?category=makeup",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "nail",
    name: "Nail & Mi",
    sub: "Đắp gel, móng úp",
    imageId: "photo-1632345031435-8727f6897d53",
    href: "/posts?category=nail",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "photo",
    name: "Nhiếp ảnh",
    sub: "Lookbook & chân dung",
    imageId: "photo-1643217427489-5a58ebbce99e",
    href: "/posts?category=photo",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "urgent",
    name: "Kèo gấp",
    sub: "Hôm nay & ngày mai",
    imageId: "photo-1679141335462-547b83aa99f5",
    href: "/posts",
    gradient: "from-amber-500 to-rose-500",
  },
  {
    id: "pro",
    name: "Thợ Pro",
    sub: "Dịch vụ cao cấp",
    imageId: "photo-1730486559425-45221a85d6dd",
    href: "/posts",
    gradient: "from-amber-400 to-yellow-600",
  },
  {
    id: "free",
    name: "Free 100%",
    sub: "Tài trợ toàn bộ",
    imageId: "photo-1534528741775-53994a69daeb",
    href: "/posts",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 flex flex-col gap-6 sm:gap-10">
      {/* 1. EDITORIAL MAGAZINE HERO BANNER (Không văn vở, hình ảnh ấn tượng) */}
      <EditorialHeroBanner />

      {/* 2. DẢI STORY CATEGORIES (Instagram Stories / Xiaohongshu Style) */}
      <StoryCategoriesBar />

      {/* 3. KÈO TUYỂN MẪU MỚI NHẤT (Visual Feed 2 Cột hiển thị ngay trên màn hình) */}
      <UrgentModelFeed />

      {/* 4. SHOWCASE NGHỆ NHÂN CHUYÊN NGHIỆP (Featured Pro Artists) */}
      <FeaturedArtistsSection />

      {/* 5. TẠI SAO CHỌN MUSE (3 Thẻ Bento tối giản, sang trọng) */}
      <WhyMuseBento />
    </div>
  );
}

/**
 * Editorial Hero Banner: Phong cách bìa tạp chí thời trang, hình ảnh mạnh mẽ
 */
function EditorialHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 text-white shadow-lg">
      {/* Background Image với lớp phủ ấm áp */}
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

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-300">
            Sàn Kết Nối Mẫu Ảnh & Thợ Làm Đẹp
          </div>

          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
            Nơi tài năng tỏa sáng. <br className="hidden sm:block" />
            Tuyển mẫu nhanh, đặt lịch thợ xịn.
          </h1>

          <p className="mt-1 max-w-lg text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-none">
            Học viên makeup, nail, nhiếp ảnh tìm mẫu thực hành tay nghề. Thợ chuyên nghiệp kết nối trực tiếp khách hàng.
          </p>

          {/* Action Buttons Group — Gọn gàng, tinh tế */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
            >
              Khám phá kèo mẫu
            </Link>

            <Link
              href="/auth"
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

/**
 * Dải Story Circles: Chuẩn mobile cho ngành làm đẹp
 */
function StoryCategoriesBar() {
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
            {/* Gradient Ring Wrapper */}
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

/**
 * Kèo Tuyển Mẫu Nổi Bật: Lưới 2 cột trực quan
 */
function UrgentModelFeed() {
  const posts = POSTS.filter((p) => p.type === "tim-mau").slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Tuyển mẫu hôm nay
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
            Kèo thực hành hot cần slot
          </h2>
        </div>

        <Link
          href="/posts"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Xem tất cả
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      {/* Lưới 2 Cột chân thực */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
              {/* Media Container 3:4 */}
              <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                <Image
                  src={`https://images.unsplash.com/${post.imageId}?w=400&h=533&fit=crop&q=80&auto=format`}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Top: Benefit Tag */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md ${
                      post.benefitType === "stipend" ? "bg-amber-500" : "bg-emerald-600"
                    }`}
                  >
                    {post.benefitTag || post.offer}
                  </span>

                  {post.isUrgent && (
                    <span className="rounded-full bg-rose-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                      Gấp
                    </span>
                  )}
                </div>

                {/* Bottom on-image: Time & Slot */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-medium text-white/95">
                  <span className="truncate flex items-center gap-1">
                    <ClockIcon weight="bold" className="size-3 shrink-0 text-white" />
                    {post.timeSlot ? post.timeSlot.split(",")[0] : post.date}
                  </span>
                  {post.slotsAvailable !== undefined && (
                    <span className="shrink-0 rounded-md bg-black/50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                      {post.slotsAvailable} slot
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-2.5">
                {/* Author row */}
                <div className="flex items-center gap-1.5">
                  <div className="relative size-4.5 overflow-hidden rounded-full border border-border shrink-0">
                    <Image
                      src={`https://images.unsplash.com/${post.author.avatarId}?w=36&h=36&fit=crop&q=80&auto=format&crop=face`}
                      alt={post.author.name}
                      fill
                      sizes="18px"
                      className="object-cover"
                    />
                  </div>
                  <span className="truncate text-[11px] font-medium text-foreground">
                    {post.author.name}
                  </span>
                  <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
                    <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                    {post.author.rating}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground line-clamp-2">
                  {post.title}
                </h3>

                {/* Footer: Location + Action */}
                <div className="mt-auto pt-2 flex items-center justify-between text-[10px] border-t border-border/40">
                  <span className="truncate text-muted-foreground flex items-center gap-0.5">
                    <MapPinIcon className="size-3 text-primary shrink-0" />
                    {post.area.split(",")[0]}
                  </span>
                  <span className="font-bold text-primary group-hover:underline">
                    Ứng tuyển →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Showcase Nghệ Nhân Chuyên Nghiệp (Featured Pro Artists)
 */
function FeaturedArtistsSection() {
  const pros = POSTS.filter((p) => p.type === "nhan-booking").slice(0, 2);

  return (
    <section className="rounded-3xl border border-border/80 bg-muted/20 p-4 sm:p-6">
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <CrownIcon weight="fill" className="size-3.5" />
            Dịch vụ chuyên nghiệp
          </div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
            Thợ Pro có portfolio nổi bật
          </h2>
        </div>

        <Link
          href="/posts"
          className="text-xs font-bold text-primary hover:underline"
        >
          Tất cả thợ →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pros.map((pro) => (
          <Link
            key={pro.id}
            href={`/posts/${pro.id}`}
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={`https://images.unsplash.com/${pro.imageId}?w=160&h=160&fit=crop&q=80&auto=format`}
                alt={pro.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col justify-center min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-xs font-bold text-foreground">
                  {pro.author.name}
                </span>
                <CheckCircleIcon weight="fill" className="size-3 text-blue-500 shrink-0" />
                <span className="ml-auto text-[10px] font-semibold text-amber-500 flex items-center gap-0.5">
                  <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                  {pro.author.rating}
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs font-medium text-foreground/90">
                {pro.title}
              </p>

              <p className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                <MapPinIcon className="size-3 text-primary shrink-0" />
                {pro.area}
              </p>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-primary">
                  {pro.priceDisplay || pro.offer}
                </span>
                <span className="text-[10px] font-bold text-primary group-hover:underline">
                  Đặt lịch →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * 3 Thẻ Bento tối giản & thanh lịch: Không dùng text dài lê thê
 */
function WhyMuseBento() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LightningIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          Đăng bài & Ứng tuyển nhanh
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Không bị trôi bài như Facebook. Rõ ràng khung giờ, địa điểm và số slot cần tuyển.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <ShieldCheckIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          Liên hệ trực tiếp qua Zalo / SĐT
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Xem thông tin liên hệ và trao đổi trực tiếp, chốt lịch tức thì không qua trung gian.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <GiftIcon weight="fill" className="size-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          100% Miễn phí nền tảng
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Không thu phí kết nối đối với học viên và mẫu ảnh thực hành.
        </p>
      </div>
    </section>
  );
}

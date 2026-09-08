"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  TrendUpIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES, POSTS, type Post } from "@/src/features/posts/mock/posts";
import { cn } from "@/src/shared/utils";

// Danh sách hashtags xu hướng
const TRENDING_KEYWORDS = [
  { id: "1", label: "Makeup tone Thái", tag: "makeup" },
  { id: "2", label: "Kèo Free 100%", tag: "free" },
  { id: "3", label: "Nail móng úp", tag: "nail" },
  { id: "4", label: "Chụp lookbook hè", tag: "photo" },
  { id: "5", label: "Makeup Douyin", tag: "makeup" },
  { id: "6", label: "Mẫu nail Katun", tag: "nail" },
];

// Danh mục Visual Cards
const EXPLORE_TILES = [
  {
    id: "makeup",
    title: "Makeup & Trang điểm",
    sub: "Tone Thái, Douyin, Kỷ yếu, Cô dâu",
    imageId: "photo-1512496015851-a90fb38ba796",
    href: "/posts?category=makeup",
  },
  {
    id: "nail",
    title: "Nail & Chăm sóc mi",
    sub: "Nail box, Đắp gel, Nối mi Katun",
    imageId: "photo-1632345031435-8727f6897d53",
    href: "/posts?category=nail",
  },
  {
    id: "photo",
    title: "Nhiếp ảnh & Lookbook",
    sub: "Chân dung nghệ thuật, Ngoại cảnh",
    imageId: "photo-1643217427489-5a58ebbce99e",
    href: "/posts?category=photo",
  },
  {
    id: "pro",
    title: "Thợ Pro & Dịch vụ",
    sub: "Nghệ nhân có portfolio uy tín",
    imageId: "photo-1730486559425-45221a85d6dd",
    href: "/posts",
  },
];

// Thợ nổi bật cho phần gợi ý
const FEATURED_ARTISTS = [
  {
    name: "Thanh Hương",
    username: "thanhhuong.pro",
    category: "Makeup Chuyên Nghiệp",
    area: "TP. Thủ Đức, TP.HCM",
    rating: 5.0,
    reviews: 96,
    avatarId: "photo-1544005313-94ddf0286df2",
    sampleImage: "photo-1730486559425-45221a85d6dd",
    bio: "Hơn 5 năm kinh nghiệm makeup cô dâu & sự kiện cao cấp.",
  },
  {
    name: "Quang Đức",
    username: "quangduc.photo",
    category: "Nhiếp Ảnh Gia",
    area: "Quận 3, TP.HCM",
    rating: 4.9,
    reviews: 67,
    avatarId: "photo-1507003211169-0a1dd7228f2d",
    sampleImage: "photo-1643217427489-5a58ebbce99e",
    bio: "Chuyên lookbook thời trang & ảnh chân dung nghệ thuật.",
  },
  {
    name: "Minh Châu",
    username: "minhchau.nails",
    category: "Nail Artist",
    area: "Bình Thạnh, TP.HCM",
    rating: 4.9,
    reviews: 42,
    avatarId: "photo-1438761681033-6461ffad8d80",
    sampleImage: "photo-1632345031435-8727f6897d53",
    bio: "Vẽ móng nghệ thuật phong cách Hàn - Nhật đính đá.",
  },
];

export function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Makeup cô dâu tone Thái",
    "Mẫu nail quận 1",
    "Chụp lookbook",
  ]);
  const [resultFilter, setResultFilter] = useState<"all" | "tim-mau" | "nhan-booking">("all");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/posts");
    }
  };

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw);
    // Lưu vào recent nếu chưa có
    if (!recentSearches.includes(kw)) {
      setRecentSearches((prev) => [kw, ...prev.slice(0, 4)]);
    }
  };

  const handleRemoveRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  // Lọc kết quả tìm kiếm
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let res = POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.offer.toLowerCase().includes(q) ||
        (p.benefitTag && p.benefitTag.toLowerCase().includes(q))
    );

    if (resultFilter !== "all") {
      res = res.filter((p) => p.type === resultFilter);
    }
    return res;
  }, [query, resultFilter]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* 1. Header Search Bar Sticky */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon className="size-4" />
        </button>

        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo layout, quận huyện, tên thợ..."
            className="w-full rounded-2xl border border-input bg-card py-2.5 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Khi đang tìm kiếm: Hiển thị kết quả */}
      {isSearching ? (
        <div className="mt-4 flex flex-col gap-4">
          {/* Subheader & Tab phân loại kết quả */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="text-xs font-semibold text-muted-foreground">
              Tìm thấy <strong className="text-foreground">{searchResults.length}</strong> kết quả cho &ldquo;{query}&rdquo;
            </span>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => setResultFilter("all")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  resultFilter === "all"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setResultFilter("tim-mau")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  resultFilter === "tim-mau"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Kèo tuyển mẫu
              </button>
              <button
                type="button"
                onClick={() => setResultFilter("nhan-booking")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  resultFilter === "nhan-booking"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Thợ chuyên nghiệp
              </button>
            </div>
          </div>

          {/* Lưới kết quả 2 cột */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {searchResults.map((post) => (
                <SearchResultCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <MagnifyingGlassIcon className="size-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Không tìm thấy bài đăng phù hợp</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                Thử tìm với các từ khóa phổ biến hơn như &ldquo;makeup&rdquo;, &ldquo;nail&rdquo;, &ldquo;quận 1&rdquo; hoặc xem các xu hướng bên dưới.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 3. Khi chưa tìm kiếm: Màn hình Discovery Hub */
        <div className="mt-5 flex flex-col gap-6 sm:gap-8">
          {/* A. Lịch sử tìm kiếm gần đây */}
          {recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ClockCounterClockwiseIcon className="size-3.5" />
                  Tìm kiếm gần đây
                </span>
                <button
                  type="button"
                  onClick={handleClearAllRecent}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    className="group flex items-center gap-1 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectKeyword(item)}
                      className="text-left"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecent(item)}
                      aria-label={`Xóa ${item}`}
                      className="ml-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* B. Xu hướng tìm kiếm hôm nay (Trending Searches) */}
          <section>
            <div className="flex items-center gap-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <TrendUpIcon weight="bold" className="size-3.5 text-primary" />
              Xu hướng thịnh hành
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TRENDING_KEYWORDS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectKeyword(item.label)}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2.5 text-left transition-all hover:border-primary/40 hover:bg-muted/30 active:scale-98 shadow-2xs"
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold",
                      idx < 3
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate text-xs font-semibold text-foreground">
                    #{item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* C. Khám phá danh mục (Visual Tiles) */}
          <section>
            <h2 className="pb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Khám phá theo danh mục
            </h2>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {EXPLORE_TILES.map((tile) => (
                <Link
                  key={tile.id}
                  href={tile.href}
                  className="group relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-stone-900 p-3 text-white shadow-xs transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Image
                    src={`https://images.unsplash.com/${tile.imageId}?w=400&h=300&fit=crop&q=80&auto=format`}
                    alt={tile.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover filter brightness-[0.72] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-xs sm:text-sm font-bold leading-tight">
                      {tile.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-white/80 line-clamp-1">
                      {tile.sub}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* D. Nghệ nhân & Thợ nổi bật có portfolio (Featured Pro Spotlight) */}
          <section>
            <div className="flex items-center justify-between pb-2.5">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Thợ & Studio nổi bật
                </h2>
                <p className="text-xs text-muted-foreground">
                  Xem portfolio tác phẩm thực tế và liên hệ đặt lịch
                </p>
              </div>
              <Link
                href="/posts"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FEATURED_ARTISTS.map((artist) => (
                <div
                  key={artist.username}
                  className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image
                        src={`https://images.unsplash.com/${artist.avatarId}?w=100&h=100&fit=crop&q=80&auto=format&crop=face`}
                        alt={artist.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-xs font-bold text-foreground">
                          {artist.name}
                        </span>
                        <CheckCircleIcon weight="fill" className="size-3 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[10px] font-medium text-primary truncate">
                        {artist.category}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                        <span className="font-semibold text-foreground">{artist.rating}</span>
                        <span>({artist.reviews} đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
                    <span className="truncate text-muted-foreground flex items-center gap-0.5">
                      <MapPinIcon className="size-3 text-primary shrink-0" />
                      {artist.area.split(",")[0]}
                    </span>
                    <Link
                      href={`/profile/${artist.username}`}
                      className="font-bold text-primary hover:underline"
                    >
                      Xem portfolio →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * Card hiển thị kết quả tìm kiếm (Lưới 2 cột gọn đẹp)
 */
function SearchResultCard({ post }: { post: Post }) {
  const isModel = post.type === "tim-mau";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
        {/* Image 3:4 */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
          <Image
            src={`https://images.unsplash.com/${post.imageId}?w=400&h=533&fit=crop&q=80&auto=format`}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Benefit Badge */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md",
                isModel
                  ? post.benefitType === "stipend"
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                  : "bg-stone-900/90 text-amber-300"
              )}
            >
              {isModel ? post.benefitTag || post.offer : post.priceDisplay || post.offer}
            </span>

            {post.isUrgent && (
              <span className="rounded-full bg-rose-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                Gấp
              </span>
            )}
          </div>

          {/* Time / Slot */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-medium text-white/95">
            <span className="truncate flex items-center gap-1">
              <ClockIcon weight="bold" className="size-3 shrink-0 text-white" />
              {post.timeSlot ? post.timeSlot.split(",")[0] : post.date}
            </span>
            {isModel && post.slotsAvailable !== undefined && (
              <span className="shrink-0 rounded-md bg-black/50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                {post.slotsAvailable} slot
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-2.5">
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

          <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground line-clamp-2">
            {post.title}
          </h3>

          <div className="mt-auto pt-2 flex items-center justify-between text-[10px] border-t border-border/40">
            <span className="truncate text-muted-foreground flex items-center gap-0.5">
              <MapPinIcon className="size-3 text-primary shrink-0" />
              {post.area.split(",")[0]}
            </span>
            <span className="font-bold text-primary group-hover:underline">
              {isModel ? "Ứng tuyển →" : "Xem thợ →"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

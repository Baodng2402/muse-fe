"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/utils";
import {
  ArrowClockwiseIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  ClockIcon,
  CrownIcon,
  FadersHorizontalIcon,
  FireIcon,
  GridFourIcon,
  HeartIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  CATEGORIES,
  CITIES,
  POSTS,
  type CategoryId,
  type CityId,
  type Post,
  type PostType,
} from "../mock/posts";

type TimingFilter = "all" | "today" | "weekend";
type BenefitFilter = "all" | "free" | "stipend";
type ViewMode = "2-col" | "1-col";

const INITIAL_PAGE_SIZE = 6;
const LOAD_MORE_STEP = 4;

export function PostsPage() {
  // Main Segmented Tab: 'tim-mau' vs 'nhan-booking'
  const [activeTab, setActiveTab] = useState<PostType>("tim-mau");

  // View Mode: 2 cột (lưới ảnh) vs 1 cột (danh sách chi tiết)
  const [viewMode, setViewMode] = useState<ViewMode>("2-col");

  // Filters
  const [activeCategory, setActiveCategory] = useState<"all" | CategoryId>("all");
  const [activeCity, setActiveCity] = useState<"all" | CityId>("all");
  const [activeTiming, setActiveTiming] = useState<TimingFilter>("all");
  const [activeBenefit, setActiveBenefit] = useState<BenefitFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer / Expand advanced filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Progressive Load More instead of clunky pagination numbers
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Tab counts
  const modelPostsCount = useMemo(
    () => POSTS.filter((p) => p.type === "tim-mau").length,
    []
  );
  const proPostsCount = useMemo(
    () => POSTS.filter((p) => p.type === "nhan-booking").length,
    []
  );

  // Reset pagination when any filter or tab changes
  const filterKey = `${activeTab}-${activeCategory}-${activeCity}-${activeTiming}-${activeBenefit}-${searchQuery}`;
  const [prevKey, setPrevKey] = useState(filterKey);
  if (filterKey !== prevKey) {
    setPrevKey(filterKey);
    setVisibleCount(INITIAL_PAGE_SIZE);
  }

  // Count how many filters are active beyond defaults
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "all") count++;
    if (activeCity !== "all") count++;
    if (activeTiming !== "all") count++;
    if (activeBenefit !== "all") count++;
    return count;
  }, [activeCategory, activeCity, activeTiming, activeBenefit]);

  const filteredPosts = useMemo(() => {
    let result = POSTS.filter((post) => post.type === activeTab);

    if (activeCategory !== "all") {
      result = result.filter((post) => post.category === activeCategory);
    }
    if (activeCity !== "all") {
      result = result.filter((post) => post.city === activeCity);
    }
    if (activeTab === "tim-mau") {
      if (activeTiming !== "all") {
        result = result.filter((post) => post.timingCategory === activeTiming);
      }
      if (activeBenefit === "free") {
        result = result.filter((post) => post.benefitType === "free");
      } else if (activeBenefit === "stipend") {
        result = result.filter((post) => post.benefitType === "stipend");
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q) ||
          post.area.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, activeCategory, activeCity, activeTiming, activeBenefit, searchQuery]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredPosts.length));
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setActiveCity("all");
    setActiveTiming("all");
    setActiveBenefit("all");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 min-w-0">
      {/* 1. Header siêu gọn trên mobile — Không chiếm diện tích màn hình */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
            {activeTab === "tim-mau" ? "Kèo Tuyển Mẫu Thực Hành" : "Thợ Làm Đẹp & Nhiếp Ảnh"}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block sm:text-sm">
            Kết nối trực tiếp thợ makeup, nail, nhiếp ảnh gia với mẫu & khách hàng tại Việt Nam.
          </p>
        </div>

        {/* View Mode Switcher (Option 1: 1 Cột, Option 2: 2 Cột) */}
        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("2-col")}
            title="Xem dạng lưới 2 cột"
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
              viewMode === "2-col"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GridFourIcon weight={viewMode === "2-col" ? "fill" : "regular"} className="size-4" />
            <span className="hidden xs:inline text-[11px]">2 cột</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("1-col")}
            title="Xem dạng danh sách 1 cột"
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
              viewMode === "1-col"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ListDashesIcon weight={viewMode === "1-col" ? "bold" : "regular"} className="size-4" />
            <span className="hidden xs:inline text-[11px]">1 cột</span>
          </button>
        </div>
      </div>

      {/* 2. Segmented Tab Switcher (gọn nhẹ, chiều cao hợp lý) */}
      <div className="mt-3">
        <div className="flex w-full rounded-xl border border-border/70 bg-muted/50 p-1 shadow-xs">
          {/* Tab 1: Tìm mẫu */}
          <button
            type="button"
            onClick={() => setActiveTab("tim-mau")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all sm:text-sm",
              activeTab === "tim-mau"
                ? "bg-background text-foreground shadow-xs shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="truncate">Tìm mẫu thực hành</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                activeTab === "tim-mau" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {modelPostsCount}
            </span>
          </button>

          {/* Tab 2: Tìm thợ */}
          <button
            type="button"
            onClick={() => setActiveTab("nhan-booking")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all sm:text-sm",
              activeTab === "nhan-booking"
                ? "bg-background text-foreground shadow-xs shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="truncate">Thợ chuyên nghiệp</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                activeTab === "nhan-booking"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {proPostsCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Compact Search & Horizontal Quick Filters — Tiết kiệm tối đa chiều cao */}
      <div className="mt-2.5 flex flex-col gap-2 w-full min-w-0">
        {/* Quick Search Shortcut + Nút mở bộ lọc nâng cao */}
        <div className="flex items-center gap-2 w-full min-w-0">
          <Link
            href="/search"
            className="flex flex-1 min-w-0 items-center gap-2 rounded-xl border border-input bg-card py-2 px-3 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground shadow-2xs"
          >
            <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {activeTab === "tim-mau"
                ? "Tìm kiếm kèo theo layout, tone makeup, quận huyện..."
                : "Tìm kiếm thợ makeup, nail, nhiếp ảnh gia..."}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            title="Mở bộ lọc chi tiết"
            className={cn(
              "flex h-8.5 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-xs font-semibold transition-colors",
              isFilterOpen || activeFiltersCount > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-card text-foreground hover:bg-muted/50"
            )}
          >
            <FadersHorizontalIcon className="size-4 shrink-0" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
            {isFilterOpen ? (
              <CaretUpIcon className="size-3 shrink-0" />
            ) : (
              <CaretDownIcon className="size-3 shrink-0" />
            )}
          </button>
        </div>

        {/* Thanh Chip Cuộn Ngang (Clean Text Only — Không icon, không emoji) */}
        <div className="w-full max-w-full min-w-0 overflow-x-auto py-1 no-scrollbar [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]">
          <div className="flex items-center gap-1.5 w-max">
            {/* Tất cả */}
            <Chip
              active={
                activeCategory === "all" &&
                activeTiming === "all" &&
                activeBenefit === "all" &&
                activeCity === "all"
              }
              onClick={handleResetFilters}
            >
              Tất cả
            </Chip>

            {/* Quick timing & benefit chips for Model tab */}
            {activeTab === "tim-mau" && (
              <>
                <Chip
                  active={activeTiming === "today"}
                  onClick={() =>
                    setActiveTiming(activeTiming === "today" ? "all" : "today")
                  }
                >
                  Hôm nay
                </Chip>
                <Chip
                  active={activeTiming === "weekend"}
                  onClick={() =>
                    setActiveTiming(activeTiming === "weekend" ? "all" : "weekend")
                  }
                >
                  Cuối tuần
                </Chip>
                <Chip
                  active={activeBenefit === "free"}
                  onClick={() =>
                    setActiveBenefit(activeBenefit === "free" ? "all" : "free")
                  }
                >
                  Miễn phí
                </Chip>
                <Chip
                  active={activeBenefit === "stipend"}
                  onClick={() =>
                    setActiveBenefit(activeBenefit === "stipend" ? "all" : "stipend")
                  }
                >
                  Có thù lao
                </Chip>
              </>
            )}

            {/* Categories — Clean text */}
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? "all" : cat.id)
                }
              >
                {cat.label}
              </Chip>
            ))}

            {/* City Chips — Clean text */}
            {CITIES.map((city) => (
              <Chip
                key={city.id}
                active={activeCity === city.id}
                onClick={() =>
                  setActiveCity(activeCity === city.id ? "all" : city.id)
                }
              >
                {city.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Drawer bộ lọc chi tiết khi người dùng nhấn "Bộ lọc" — Sử dụng Pill Chips, không dùng thẻ select native */}
        {isFilterOpen && (
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tùy chọn lọc chi tiết
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="mt-3.5 flex flex-col gap-3.5">
              {/* Filter: Dịch vụ */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Dịch vụ
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                      activeCategory === "all"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Tất cả dịch vụ
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCategory(c.id)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        activeCategory === c.id
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Khu vực */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Khu vực
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveCity("all")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                      activeCity === "all"
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Tất cả khu vực
                  </button>
                  {CITIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCity(c.id)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        activeCity === c.id
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Quyền lợi (nếu tab tìm mẫu) */}
              {activeTab === "tim-mau" && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Quyền lợi mẫu
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveBenefit("all")}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        activeBenefit === "all"
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Tất cả quyền lợi
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBenefit("free")}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        activeBenefit === "free"
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Miễn phí 100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBenefit("stipend")}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        activeBenefit === "stipend"
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Có thù lao
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Sub-header: Count indicator */}
      <div className="mt-3 flex items-center justify-between px-0.5">
        <p className="text-xs font-semibold text-muted-foreground">
          {filteredPosts.length > 0 ? (
            <>
              Hiển thị{" "}
              <strong className="text-foreground">{visiblePosts.length}</strong> /{" "}
              {filteredPosts.length}{" "}
              {activeTab === "tim-mau" ? "kèo mẫu" : "thợ pro"}
            </>
          ) : (
            "0 kết quả"
          )}
        </p>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Đặt lại lọc
          </button>
        )}
      </div>

      {/* 5. FEED HIỂN THỊ POSTS: Hỗ trợ linh hoạt 2 CỘT hoặc 1 CỘT */}
      {viewMode === "2-col" ? (
        /* ================= OPTION 2: LƯỚI 2 CỘT TRÊN MOBILE (Thu hút, xem được nhiều tin) ================= */
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visiblePosts.map((post) => (
            <CompactPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* ================= OPTION 1: 1 CỘT CHI TIẾT (Timeline Deal Card) ================= */
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) =>
            post.type === "tim-mau" ? (
              <DetailedModelCard key={post.id} post={post} />
            ) : (
              <DetailedProCard key={post.id} post={post} />
            )
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 px-4 text-center">
          <p className="text-sm font-semibold text-foreground">
            Không tìm thấy bài đăng phù hợp
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thử chuyển bộ lọc khu vực hoặc xóa từ khóa tìm kiếm.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 rounded-xl"
            onClick={handleResetFilters}
          >
            Xem tất cả bài đăng
          </Button>
        </div>
      )}

      {/* 6. Phân trang dạng "Tải thêm bài đăng" (Load More) thân thiện Mobile */}
      {hasMore && (
        <div className="mt-6 flex flex-col items-center gap-2">
          {/* Progress Indicator */}
          <div className="flex w-full max-w-xs items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(visiblePosts.length / filteredPosts.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-[11px] tabular-nums font-semibold text-muted-foreground">
              {visiblePosts.length}/{filteredPosts.length}
            </span>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={handleLoadMore}
            className="w-full max-w-xs rounded-xl font-bold border-border/80 shadow-xs active:scale-98"
          >
            <ArrowClockwiseIcon className="size-4 text-primary mr-1" />
            Tải thêm bài đăng ({filteredPosts.length - visiblePosts.length} tin)
          </Button>
        </div>
      )}

      {!hasMore && filteredPosts.length > 0 && (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          ✓ Đã hiển thị tất cả {filteredPosts.length} bài đăng
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-xs shadow-primary/20"
          : "border-border/80 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

/* =========================================================================
   CARD DẠNG 2 CỘT (OPTION 2 — COMPACT, VISUAL-FIRST)
   ========================================================================= */
function CompactPostCard({ post }: { post: Post }) {
  const isModel = post.type === "tim-mau";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="flex flex-1 flex-col">
        {/* Visual image container — tỉ lệ 3:4 */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
          <Image
            src={`https://images.unsplash.com/${post.imageId}?w=400&h=533&fit=crop&q=80&auto=format`}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Top: Combined Benefit & Urgent Tag */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md",
                isModel
                  ? post.benefitType === "stipend"
                    ? "bg-amber-500/95 text-white"
                    : "bg-emerald-600/95 text-white"
                  : "bg-primary/95 text-white"
              )}
            >
              {isModel && post.isUrgent && <FireIcon weight="fill" className="size-2.5" />}
              {isModel ? post.benefitTag || post.offer : post.priceDisplay || post.offer}
            </span>

            {!isModel && (
              <span className="flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <StarIcon weight="fill" className="size-2.5 text-amber-400" />
                {post.author.rating}
              </span>
            )}
          </div>

          {/* Bottom on-image: Single sleek row */}
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

        {/* Content Box */}
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
            {isModel ? (
              <span className="ml-auto text-[9px] text-muted-foreground flex items-center gap-0.5">
                <StarIcon weight="fill" className="size-2.5 text-amber-500" />
                {post.author.rating}
              </span>
            ) : (
              <CheckCircleIcon weight="fill" className="size-3 text-blue-500 ml-auto shrink-0" />
            )}
          </div>

          {/* Title */}
          <h3 className="mt-1 text-xs font-semibold leading-snug text-foreground line-clamp-2">
            {post.title}
          </h3>

          {/* Footer row: Location + Compact CTA */}
          <div className="mt-auto pt-2 flex items-center justify-between text-[10px] border-t border-border/40">
            <span className="truncate text-muted-foreground flex items-center gap-0.5">
              <MapPinIcon className="size-3 text-primary shrink-0" />
              {post.area.split(",")[0]}
            </span>
            <span className="font-bold text-primary group-hover:underline">
              {isModel ? "Ứng tuyển" : "Xem thợ"} →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* =========================================================================
   CARD DẠNG 1 CỘT (OPTION 1 — THIẾT KẾ GỌN ĐẸP, BUTTON COMPACT PILL)
   ========================================================================= */
function DetailedModelCard({ post }: { post: Post }) {
  const category = CATEGORIES.find((item) => item.id === post.category)!;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 1. Ảnh với badges gom gọn, không rải 4 góc */}
      <Link href={`/posts/${post.id}`} className="relative aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={`https://images.unsplash.com/${post.imageId}?w=640&h=360&fit=crop&q=80&auto=format`}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

        {/* Top: Gom Benefit Tag và Urgent Tag thành 1 cụm thống nhất */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-0.8 text-[11px] font-bold shadow-xs backdrop-blur-md",
              post.benefitType === "stipend"
                ? "bg-amber-500 text-white"
                : "bg-emerald-600 text-white"
            )}
          >
            {post.isUrgent && <FireIcon weight="fill" className="size-3" />}
            {post.benefitTag || post.offer}
          </span>
          {post.isUrgent && (
            <span className="rounded-full bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
              Kèo gấp
            </span>
          )}
        </div>

        {/* Bottom bar gom giờ hẹn + slot thành 1 thanh mỏng */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] backdrop-blur-md">
            <ClockIcon weight="bold" className="size-3.5 text-primary-foreground" />
            {post.timeSlot || post.date}
          </span>
          {post.slotsAvailable !== undefined && (
            <span className="rounded-lg bg-black/60 px-2 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
              Còn {post.slotsAvailable}/{post.slotsTotal || 2} slot
            </span>
          )}
        </div>
      </Link>

      {/* 2. Thân Card */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-full border border-border">
              <Image
                src={`https://images.unsplash.com/${post.author.avatarId}?w=48&h=48&fit=crop&q=80&auto=format&crop=face`}
                alt={post.author.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-foreground">
              {post.author.name}
            </span>
            <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
              {post.author.level}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
            <StarIcon weight="fill" className="size-3 text-amber-500" />
            {post.author.rating}
          </span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h3 className="mt-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Requirements */}
        {post.requirements && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            <span className="font-semibold text-foreground/80">Yêu cầu:</span>{" "}
            {post.requirements}
          </p>
        )}

        {/* 3. Footer Row: Địa điểm + CỤM 2 NÚT HÀI HÒA (Bookmark + Ứng tuyển) */}
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPinIcon className="size-3 text-primary shrink-0" />
              {post.area}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-medium">
              {category.label}
            </span>
          </div>

          {/* Action Pair: Lưu tin + Nút Ứng tuyển */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Lưu tin này"
              className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <BookmarkSimpleIcon className="size-4" />
            </button>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
            >
              Ứng tuyển
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailedProCard({ post }: { post: Post }) {
  const category = CATEGORIES.find((item) => item.id === post.category)!;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="relative aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={`https://images.unsplash.com/${post.imageId}?w=640&h=360&fit=crop&q=80&auto=format`}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-foreground/90 px-2.5 py-0.8 text-[11px] font-bold text-background shadow-md">
          <CrownIcon weight="fill" className="size-3.5 text-amber-400" />
          Thợ Pro
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold text-white">
          <span className="rounded-lg bg-primary/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            {post.priceDisplay || post.offer}
          </span>
          <span className="rounded-lg bg-black/60 px-2 py-0.8 text-[10px] backdrop-blur-md">
            {category.label}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-2">
          <div className="relative size-6 overflow-hidden rounded-full border border-border">
            <Image
              src={`https://images.unsplash.com/${post.author.avatarId}?w=48&h=48&fit=crop&q=80&auto=format&crop=face`}
              alt={post.author.name}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-foreground">
                {post.author.name}
              </span>
              <CheckCircleIcon weight="fill" className="size-3 text-blue-500" />
            </div>
            <p className="text-[10px] text-muted-foreground">{post.author.level}</p>
          </div>
          <span className="ml-auto flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
            <StarIcon weight="fill" className="size-3 text-amber-500" />
            {post.author.rating} ({post.author.reviewCount})
          </span>
        </div>

        <Link href={`/posts/${post.id}`}>
          <h3 className="mt-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Footer Row: Địa điểm + CỤM 2 NÚT HÀI HÒA (Bookmark + Đặt lịch) */}
        <div className="mt-auto border-t border-border/50 pt-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPinIcon className="size-3 text-primary shrink-0" />
            {post.area}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Lưu thợ này"
              className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <BookmarkSimpleIcon className="size-4" />
            </button>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
            >
              Đặt lịch
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}


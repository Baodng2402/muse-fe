"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { useMockSession } from "@/src/shared/store/mock-session";
import { cn } from "@/src/shared/utils";
import {
  ArrowLeftIcon,
  BookmarkSimpleIcon,
  CalendarBlankIcon,
  ChatCircleDotsIcon,
  CheckIcon,
  CopyIcon,
  DownloadSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  ShareNetworkIcon,
  StarIcon,
  TagIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  CATEGORIES,
  TYPE_LABEL,
  formatPhone,
  maskPhone,
  type Post,
} from "../mock/posts";

export function PostDetailPage({ post }: { post: Post }) {
  const { session, hydrated } = useMockSession();
  const isLoggedIn = hydrated && session !== null;
  const category = CATEGORIES.find((item) => item.id === post.category)!;
  const CategoryIcon = category.icon;

  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/posts");
    }
  };

  // Match username for author
  const authorUsername =
    post.author.name === "Thanh Hương"
      ? "thanhhuong.pro"
      : post.author.name === "Quang Đức"
      ? "quangduc.photo"
      : post.author.name === "Minh Châu"
      ? "minhchau.nails"
      : "ngoctrinh.makeup";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyZaloMessage = () => {
    if (typeof window !== "undefined") {
      const msg = `[Tuyển mẫu Muse] ${post.title}\n📍 Địa điểm: ${post.area}\n⏰ Thời gian: ${post.timeSlot || post.date}\n🎁 Quyền lợi: ${post.benefitTag || post.offer}\n🔗 Xem chi tiết và đăng ký: ${window.location.href}`;
      navigator.clipboard?.writeText(msg);
      setCopiedZalo(true);
      setTimeout(() => setCopiedZalo(false), 2500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeftIcon className="size-4" />
        Quay lại
      </button>

      {/* 2-column layout */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* LEFT — Content */}
        <div className="flex flex-col gap-6">
          {/* Main image */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={`https://images.unsplash.com/${post.imageId}?w=1200&h=900&fit=crop&q=80&auto=format`}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                post.type === "tim-mau"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-background"
              )}
            >
              {post.type === "tim-mau" ? "Tuyển mẫu thực hành" : "Thợ chuyên nghiệp"}
            </span>
            {post.benefitTag && (
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                {post.benefitTag}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CategoryIcon className="size-3.5" />
              {category.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {post.title}
          </h1>

          {/* Quick specs box */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/80 bg-muted/30 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <MapPinIcon className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] text-muted-foreground">Địa điểm</p>
                <p className="text-xs font-semibold text-foreground">{post.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CalendarBlankIcon className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] text-muted-foreground">Thời gian hẹn</p>
                <p className="text-xs font-semibold text-foreground">{post.timeSlot || post.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <TagIcon className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  {post.type === "tim-mau" ? "Quyền lợi mẫu" : "Mức giá"}
                </p>
                <p className="text-xs font-semibold text-foreground">{post.priceDisplay || post.offer}</p>
              </div>
            </div>
          </div>

          {/* Slot availability for model recruitment */}
          {post.type === "tim-mau" && post.slotsAvailable !== undefined && (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-semibold flex items-center gap-1.5">
                Tình trạng slot:
              </span>
              <span className="rounded-full bg-amber-500 text-white font-bold px-2.5 py-0.5 text-[11px]">
                Còn {post.slotsAvailable}/{post.slotsTotal || 2} suất đăng ký
              </span>
            </div>
          )}

          {/* Requirements for models */}
          {post.requirements && (
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Yêu cầu đối với mẫu
              </h2>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {post.requirements}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Mô tả chi tiết
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Action row — mobile only (desktop has sidebar) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button size="sm" variant="outline" nativeButton className="flex-1">
              <BookmarkSimpleIcon data-icon="inline-start" />
              Lưu tin
            </Button>
            <Button
              size="sm"
              variant="outline"
              nativeButton
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1"
            >
              <ShareNetworkIcon data-icon="inline-start" />
              Chia sẻ
            </Button>
          </div>

          {/* Safety note */}
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-4">
            <WarningCircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-5 text-muted-foreground">
              Muse khuyến khích bạn trao đổi rõ địa chỉ và nội dung buổi làm mẫu/chụp ảnh trước khi
              đến. Nếu phát hiện tin đăng có dấu hiệu không an toàn, vui lòng báo cáo ngay cho ban quản trị.
            </p>
          </div>
        </div>

        {/* RIGHT — Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-5">
            {/* Author card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-full border border-border">
                  <Image
                    src={`https://images.unsplash.com/${post.author.avatarId}?w=96&h=96&fit=crop&q=80&auto=format&crop=face`}
                    alt={post.author.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {post.author.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <StarIcon
                      weight="fill"
                      className="size-3 text-amber-500"
                    />
                    {post.author.rating} · {post.author.reviewCount} đánh giá
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {post.author.level}
                </span>
                <Link
                  href={`/profile/${authorUsername}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Xem portfolio →
                </Link>
              </div>
            </div>

            {/* Contact card */}
            <div className="rounded-xl border border-border bg-card p-5">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">
                    Số điện thoại liên hệ
                  </p>
                  <p className="text-lg font-semibold tabular-nums text-foreground">
                    {formatPhone(post.phone)}
                  </p>
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={<a href={`tel:${post.phone}`} />}
                    className="w-full font-semibold shadow-md shadow-primary/10"
                  >
                    <PhoneIcon data-icon="inline-start" />
                    {post.type === "tim-mau" ? "Ứng tuyển làm mẫu ngay" : "Liên hệ đặt lịch ngay"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Đăng nhập để xem số điện thoại và liên hệ trực tiếp.
                  </p>
                  <p className="text-center text-sm tabular-nums text-muted-foreground">
                    {maskPhone(post.phone)}
                  </p>
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={
                      <Link href={`/auth?redirect=/posts/${post.id}`} />
                    }
                    className="w-full font-semibold"
                  >
                    {post.type === "tim-mau" ? "Đăng nhập để ứng tuyển" : "Đăng nhập để đặt lịch"}
                  </Button>
                </div>
              )}
            </div>

            {/* Action buttons — desktop */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                nativeButton
                className="flex-1"
              >
                <BookmarkSimpleIcon data-icon="inline-start" />
                Lưu tin
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1"
              >
                <ShareNetworkIcon data-icon="inline-start" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile contact card — shown below content on small screens */}
        <div className="lg:hidden">
          <div className="rounded-xl border border-border bg-card p-5">
            {/* Author row */}
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-full border border-border">
                <Image
                  src={`https://images.unsplash.com/${post.author.avatarId}?w=80&h=80&fit=crop&q=80&auto=format&crop=face`}
                  alt={post.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {post.author.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <StarIcon weight="fill" className="size-3 text-amber-500" />
                  {post.author.rating} · {post.author.level}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <Link
                href={`/profile/${authorUsername}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Xem portfolio & đánh giá của {post.author.name} →
              </Link>
            </div>

            {/* Contact */}
            <div className="mt-4">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Số điện thoại liên hệ
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                      {formatPhone(post.phone)}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={<a href={`tel:${post.phone}`} />}
                    className="font-semibold shadow-md shadow-primary/10"
                  >
                    <PhoneIcon data-icon="inline-start" />
                    {post.type === "tim-mau" ? "Ứng tuyển làm mẫu ngay" : "Liên hệ đặt lịch ngay"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Đăng nhập để xem số điện thoại và liên hệ trực tiếp.
                  </p>
                  <Button
                    nativeButton={false}
                    render={
                      <Link href={`/auth?redirect=/posts/${post.id}`} />
                    }
                    className="w-full font-semibold"
                  >
                    {post.type === "tim-mau" ? "Đăng nhập để ứng tuyển" : "Đăng nhập để đặt lịch"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHIA SẺ & XUẤT POSTER STORY 9:16 */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Đóng"
            >
              <XIcon className="size-4" />
            </button>

            <h3 className="text-sm font-bold text-foreground">Chia sẻ tin tuyển mẫu</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gửi trực tiếp cho bạn bè hoặc lưu ảnh đăng Story.
            </p>

            {/* Poster Story Preview 9:16 Mini */}
            <div className="mt-3 relative aspect-9/14 w-full overflow-hidden rounded-2xl border border-border/80 bg-stone-900 text-white shadow-md">
              <Image
                src={`https://images.unsplash.com/${post.imageId}?w=500&h=750&fit=crop&q=80&auto=format`}
                alt={post.title}
                fill
                sizes="340px"
                className="object-cover filter brightness-[0.72]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

              {/* Top watermark */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs font-black tracking-wider text-white">
                  MUSE
                </span>
                <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                  {post.benefitTag || post.offer}
                </span>
              </div>

              {/* Bottom specs on poster */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                  {post.type === "tim-mau" ? "Tuyển Mẫu Thực Hành" : "Dịch Vụ Pro"}
                </span>
                <h4 className="text-xs font-bold leading-tight text-white line-clamp-2">
                  {post.title}
                </h4>
                <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-white/90">
                  <span>⏰ {post.timeSlot || post.date}</span>
                  <span>📍 {post.area}</span>
                  {post.slotsAvailable !== undefined && (
                    <span className="text-emerald-300 font-bold">
                      🔥 Còn {post.slotsAvailable} slot đăng ký
                    </span>
                  )}
                </div>
                <div className="mt-2 pt-1.5 border-t border-white/20 flex items-center justify-between text-[9px] text-white/70">
                  <span>by @{authorUsername}</span>
                  <span>muse.vn</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3.5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyZaloMessage}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-98"
              >
                <ChatCircleDotsIcon weight="fill" className="size-4" />
                {copiedZalo ? "Đã sao chép lời nhắn Zalo!" : "Sao chép lời nhắn gửi Zalo"}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-input bg-background py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-98"
              >
                {copiedLink ? (
                  <>
                    <CheckIcon className="size-4 text-emerald-600" />
                    Đã sao chép link bài đăng!
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-4" />
                    Sao chép liên kết bài viết
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

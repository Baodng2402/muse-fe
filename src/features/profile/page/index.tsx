"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  HeartIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  ShareNetworkIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { POSTS } from "@/src/features/posts/mock/posts";
import { ARTIST_PROFILES, type ArtistProfile } from "../mock/artists";
import { cn } from "@/src/shared/utils";

export function ProfilePage({ username }: { username: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"portfolio" | "posts" | "reviews">("portfolio");
  const [copied, setCopied] = useState(false);

  // Lấy dữ liệu profile theo username (hoặc fallback profile đầu tiên)
  const profile: ArtistProfile = useMemo(() => {
    return ARTIST_PROFILES[username] || ARTIST_PROFILES["thanhhuong.pro"];
  }, [username]);

  // Lấy các bài đăng tuyển mẫu của thợ này
  const artistPosts = useMemo(() => {
    return POSTS.filter((p) => p.author.name.toLowerCase() === profile.name.toLowerCase());
  }, [profile.name]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/posts");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between pb-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon className="size-4" />
          Quay lại
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 shadow-2xs"
        >
          <ShareNetworkIcon className="size-3.5" />
          {copied ? "Đã sao chép link!" : "Chia sẻ Profile"}
        </button>
      </div>

      {/* 2. Cover Banner & Avatar */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-stone-900 shadow-sm">
        {/* Cover Photo */}
        <div className="relative aspect-21/9 sm:aspect-4/1 w-full overflow-hidden bg-muted">
          <Image
            src={`https://images.unsplash.com/${profile.coverImageId}?w=1200&h=400&fit=crop&q=80&auto=format`}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Profile Card Overlay */}
        <div className="relative -mt-10 sm:-mt-12 flex flex-col items-center px-4 pb-5 text-center sm:flex-row sm:items-end sm:text-left sm:gap-4 sm:px-6 sm:pb-6">
          {/* Avatar lớn */}
          <div className="relative size-20 sm:size-24 overflow-hidden rounded-full border-4 border-background bg-card shadow-md shrink-0">
            <Image
              src={`https://images.unsplash.com/${profile.avatarId}?w=160&h=160&fit=crop&q=80&auto=format&crop=face`}
              alt={profile.name}
              fill
              priority
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="mt-2.5 sm:mt-0 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              {profile.verified && (
                <CheckCircleIcon weight="fill" className="size-4 text-blue-400 shrink-0" />
              )}
              <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur-md">
                {profile.level}
              </span>
            </div>

            <p className="text-xs text-stone-200 mt-0.5">
              @{profile.username} · {profile.title}
            </p>

            <p className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-stone-300 mt-1">
              <MapPinIcon className="size-3 text-rose-400 shrink-0" />
              {profile.area}
            </p>
          </div>

          {/* Direct Action Buttons */}
          <div className="mt-3.5 sm:mt-0 flex items-center gap-2">
            <a
              href={`https://zalo.me/${profile.zaloPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <ChatCircleDotsIcon weight="fill" className="size-4" />
              Nhắn Zalo
            </a>

            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              aria-label="Gọi điện trực tiếp"
            >
              <PhoneIcon weight="fill" className="size-4" />
              Gọi
            </a>

            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                aria-label="Instagram cá nhân"
              >
                <InstagramLogoIcon weight="bold" className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bio & Stats & Chuyên môn */}
      <div className="mt-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col gap-3">
        {/* Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-border/60 text-center py-1">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-foreground">
              {profile.portfolio.length}
            </div>
            <div className="text-[11px] text-muted-foreground">Tác phẩm</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-extrabold text-amber-500 flex items-center justify-center gap-0.5">
              <StarIcon weight="fill" className="size-3.5 text-amber-500" />
              {profile.rating}
            </div>
            <div className="text-[11px] text-muted-foreground">{profile.reviewCount} đánh giá</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-extrabold text-foreground">
              {profile.completedPostsCount}
            </div>
            <div className="text-[11px] text-muted-foreground">Kèo đã xong</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed border-t border-border/50 pt-2.5">
          {profile.bio}
        </p>

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.specialties.map((spec) => (
            <span
              key={spec}
              className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground/90"
            >
              #{spec}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Tab Navigation (Portfolio / Kèo tuyển mẫu / Đánh giá) */}
      <div className="mt-6 flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "portfolio"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Tác phẩm ({profile.portfolio.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "posts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Kèo đang tuyển ({artistPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 pb-2.5 text-xs sm:text-sm font-bold transition-all border-b-2",
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Đánh giá từ mẫu ({profile.reviews.length})
        </button>
      </div>

      {/* 5. Tab Contents */}
      <div className="mt-4">
        {/* TAB 1: PORTFOLIO GRID (Phong cách Instagram Grid 3 Cột) */}
        {activeTab === "portfolio" && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {profile.portfolio.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-4/5 overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-2xs"
              >
                <Image
                  src={`https://images.unsplash.com/${item.imageId}?w=500&h=625&fit=crop&q=80&auto=format`}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 300px, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 text-white" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white drop-shadow-sm">
                  <span className="truncate text-xs font-semibold">{item.title}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-300">
                    <HeartIcon weight="fill" className="size-3" />
                    {item.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: KÈO ĐANG TUYỂN MẪU */}
        {activeTab === "posts" && (
          <div className="flex flex-col gap-3">
            {artistPosts.length > 0 ? (
              artistPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={`https://images.unsplash.com/${post.imageId}?w=120&h=120&fit=crop&q=80&auto=format`}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-emerald-600 px-2 py-0.2 text-[10px] font-bold text-white">
                          {post.benefitTag || post.offer}
                        </span>
                        {post.slotsAvailable !== undefined && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                            Còn {post.slotsAvailable} slot
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-xs sm:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {post.timeSlot || post.date} · {post.area}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs group-hover:bg-primary/90">
                    Ứng tuyển ngay →
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Nghệ nhân hiện không có bài tuyển mẫu nào đang mở slot.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEW & FEEDBACK THỰC TẾ TỪ MẪU */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-3">
            {profile.reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative size-8 overflow-hidden rounded-full border border-border">
                      <Image
                        src={`https://images.unsplash.com/${rev.authorAvatarId}?w=64&h=64&fit=crop&q=80&auto=format&crop=face`}
                        alt={rev.authorName}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">{rev.authorName}</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.2 text-[9px] font-semibold text-muted-foreground">
                          {rev.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon key={i} weight="fill" className="size-3" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed pt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.photoId && (
                  <div className="relative aspect-4/3 w-36 overflow-hidden rounded-xl border border-border mt-1">
                    <Image
                      src={`https://images.unsplash.com/${rev.photoId}?w=300&h=225&fit=crop&q=80&auto=format`}
                      alt="Thành quả feedback"
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

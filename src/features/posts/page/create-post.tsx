'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  SparkleIcon,
  CheckCircleIcon,
  ImageIcon,
  MapPinIcon,
  TagIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/button';
import { useAuthStore } from '@/src/shared/store/use-auth-store';
import { useCreatePostMutation, useRegionsQuery, useSpecialtiesQuery } from '../hooks/use-posts';
import type { PostType } from '@/src/core/api/types';

export function CreatePostPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const [postType, setPostType] = useState<PostType>('find_model');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [regionId, setRegionId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: regions = [] } = useRegionsQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();
  const { mutate: createPost, isPending, error } = useCreatePostMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    if (!title.trim()) {
      setCustomError('Vui lòng nhập tiêu đề bài đăng.');
      return;
    }

    if (!regionId) {
      setCustomError('Vui lòng chọn khu vực.');
      return;
    }

    if (postType === 'find_model' && !specialtyId) {
      setCustomError('Vui lòng chọn chuyên ngành / dịch vụ cho bài tuyển mẫu.');
      return;
    }

    const imagesPayload = imageUrl.trim()
      ? [{ image_url: imageUrl.trim(), position: 0 }]
      : undefined;

    createPost(
      {
        type: postType,
        title: title.trim(),
        description: description.trim() || undefined,
        region_id: regionId,
        specialty_id: specialtyId || undefined,
        status: 'published',
        images: imagesPayload,
      },
      {
        onSuccess: (newPost) => {
          setIsSuccess(true);
          setTimeout(() => {
            const id =
              (newPost as any)?.post?.id ||
              (newPost as any)?.post?.ID ||
              newPost?.id ||
              newPost?.ID;
            router.push(id ? `/posts/${id}` : '/posts');
          }, 1500);
        },
      }
    );
  };

  if (hasHydrated && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <SparkleIcon className="mx-auto size-12 text-primary mb-3" />
          <h2 className="text-xl font-bold text-foreground">Đăng nhập để tạo tin đăng</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Bạn cần đăng nhập tài khoản Muse để có thể tuyển mẫu thực hành hoặc nhận lịch khách hàng.
          </p>
          <div className="mt-6">
            <Link
              href="/auth?redirect=/posts/new"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/20 hover:bg-primary/90"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        Quay lại danh sách bài đăng
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircleIcon weight="fill" className="size-16 text-emerald-500 mb-3" />
            <h2 className="text-xl font-bold text-foreground">Đăng tin thành công!</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Đang chuyển hướng tới bài đăng của bạn...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Tạo bài đăng mới
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Đăng tin tuyển mẫu thực hành hoặc giới thiệu dịch vụ làm đẹp / chụp ảnh tới cộng đồng.
              </p>
            </div>

            {(customError || error) && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {customError || (error as Error).message || 'Không thể tạo bài đăng. Vui lòng kiểm tra lại dữ liệu.'}
              </div>
            )}

            {/* Post Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mục đích bài đăng
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPostType('find_model');
                    setCustomError(null);
                  }}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    postType === 'find_model'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-border bg-background text-muted-foreground hover:border-foreground/20'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground">Tuyển mẫu thực hành</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Hỗ trợ phí hoặc miễn phí để nâng cao tay nghề / làm portfolio
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPostType('booking');
                    setCustomError(null);
                  }}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    postType === 'booking'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-border bg-background text-muted-foreground hover:border-foreground/20'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground">Thợ nhận booking</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Nhận lịch trang điểm, làm nail, chụp ảnh chuyên nghiệp
                  </span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tiêu đề bài đăng <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Cần 2 bạn mẫu makeup tone Hàn Quốc chụp lookbook Chủ Nhật này"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setCustomError(null);
                }}
                className="h-11 rounded-2xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-2xs"
              />
            </div>

            {/* Region and Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <MapPinIcon className="size-3.5 text-primary" />
                  Khu vực <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={regionId}
                    onChange={(e) => {
                      setRegionId(e.target.value);
                      setCustomError(null);
                    }}
                    className="h-11 w-full rounded-2xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer shadow-2xs"
                  >
                    <option value="" className="text-muted-foreground py-2">-- Chọn khu vực --</option>
                    {regions.map((r: any) => (
                      <option key={r.id || r.ID} value={r.id || r.ID} className="py-2 text-foreground">
                        {r.name || r.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <TagIcon className="size-3.5 text-primary" />
                  Chuyên ngành / Dịch vụ {postType === 'find_model' && <span className="text-destructive">*</span>}
                </label>
                <div className="relative">
                  <select
                    required={postType === 'find_model'}
                    value={specialtyId}
                    onChange={(e) => {
                      setSpecialtyId(e.target.value);
                      setCustomError(null);
                    }}
                    className="h-11 w-full rounded-2xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer shadow-2xs"
                  >
                    <option value="" className="text-muted-foreground py-2">-- Chọn chuyên ngành --</option>
                    {specialties.map((s: any) => (
                      <option key={s.id || s.ID} value={s.id || s.ID} className="py-2 text-foreground">
                        {s.name || s.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <ImageIcon className="size-3.5 text-primary" />
                URL Ảnh minh họa (tùy chọn)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-11 rounded-2xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-2xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Dán đường dẫn ảnh Unsplash, Cloudinary hoặc ảnh sản phẩm thực tế.
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Mô tả chi tiết & Yêu cầu
              </label>
              <textarea
                rows={5}
                placeholder="Mô tả cụ thể thời gian, địa chỉ studio/tiệm, quyền lợi mẫu (hỗ trợ chi phí, tặng ảnh retouch...), hoặc phong cách mong muốn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-2xl border border-input bg-background p-3.5 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-2xs resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-3 flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link
                href="/posts"
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Hủy bỏ
              </Link>
              <Button
                type="submit"
                disabled={isPending || !title.trim() || !regionId}
                className="rounded-xl px-5 font-bold shadow-xs shadow-primary/25"
              >
                {isPending ? 'Đang tạo bài đăng...' : 'Đăng bài ngay'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

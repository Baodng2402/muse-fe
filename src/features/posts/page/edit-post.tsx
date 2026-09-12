'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  GiftIcon,
  UsersIcon,
  ShieldWarningIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/Select';
import { ImageUpload } from '@/src/shared/components/ui/ImageUpload';
import { useAuthStore } from '@/src/shared/store/store.auth';
import {
  usePostDetailQuery,
  useUpdatePostMutation,
  useRegionsQuery,
  useSpecialtiesQuery,
} from '../hooks/usePosts';
import type { PostStatus } from '@/src/core/api/types';

interface EditPostPageProps {
  postId: string;
}

export function EditPostPage({ postId }: EditPostPageProps) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const { data: postDetailResponse, isLoading: isPostLoading } = usePostDetailQuery(postId);
  const post = (postDetailResponse as any)?.post || postDetailResponse;
  const existingImages = (postDetailResponse as any)?.images as
    | { image_url?: string; ImageUrl?: string }[]
    | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [regionId, setRegionId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [status, setStatus] = useState<PostStatus>('published');
  const [practiceTime, setPracticeTime] = useState('');
  const [discountNote, setDiscountNote] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [slotsTotal, setSlotsTotal] = useState<number | ''>('');
  const [images, setImages] = useState<string[]>([]);
  const [customError, setCustomError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: regions = [] } = useRegionsQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();
  const regionItems = (regions as any[]).map((r) => ({ value: r.id || r.ID, label: r.name || r.Name }));
  const specialtyItems = (specialties as any[]).map((s) => ({ value: s.id || s.ID, label: s.name || s.Name }));
  const STATUS_ITEMS = [
    { value: 'published', label: 'Công khai (Published)' },
    { value: 'draft', label: 'Bản nháp (Draft)' },
    { value: 'closed', label: 'Đã đủ mẫu / Đóng (Closed)' },
    { value: 'hidden', label: 'Ẩn bài (Hidden)' },
  ];
  const updatePostMutation = useUpdatePostMutation(postId);

  // Pre-fill fields once post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title || post.Title || '');
      setDescription(post.description || post.Description || '');
      setRegionId(post.region_id || post.RegionID || '');
      setSpecialtyId(post.specialty_id || post.SpecialtyID || '');
      setStatus(post.status || post.Status || 'published');
      setPracticeTime(post.practice_time || post.PracticeTime || '');
      setDiscountNote(post.discount_note || post.DiscountNote || '');
      setRequirementsText(post.requirements_text || post.RequirementsText || '');
      const slots = post.slots_total ?? post.SlotsTotal;
      setSlotsTotal(slots !== undefined && slots !== null ? slots : '');
    }
    if (existingImages) {
      setImages(existingImages.map((img) => img.image_url || img.ImageUrl || '').filter(Boolean));
    }
  }, [post, existingImages]);

  const postUserId = post?.user_id || post?.UserID;
  const isOwner = currentUser?.id && postUserId && currentUser.id === postUserId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    if (!title.trim()) {
      setCustomError('Vui lòng nhập tiêu đề bài đăng.');
      return;
    }

    updatePostMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        region_id: regionId || undefined,
        specialty_id: specialtyId || undefined,
        status,
        practice_time: practiceTime.trim() || undefined,
        discount_note: discountNote.trim() || undefined,
        requirements_text: requirementsText.trim() || undefined,
        slots_total: slotsTotal === '' ? undefined : Number(slotsTotal),
        image_urls: images.length > 0 ? images : undefined,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push(`/posts/${postId}`);
          }, 1200);
        },
        onError: (err) => {
          setCustomError((err as Error).message || 'Cập nhật bài viết thất bại.');
        },
      }
    );
  };

  if (isPostLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-6" />
        <div className="h-96 w-full bg-muted rounded-3xl" />
      </div>
    );
  }

  if (hasHydrated && (!isAuthenticated || (post && !isOwner))) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl border border-destructive/20 bg-card p-8 shadow-sm">
          <ShieldWarningIcon className="mx-auto size-12 text-destructive mb-3" />
          <h2 className="text-xl font-bold text-foreground">Không có quyền truy cập</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Bạn không phải là chủ nhân của bài đăng này hoặc bài viết không tồn tại.
          </p>
          <div className="mt-6">
            <Link
              href="/posts"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/20 hover:bg-primary/90"
            >
              Quay lại danh sách bài đăng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href={`/posts/${postId}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        Quay lại chi tiết bài đăng
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircleIcon weight="fill" className="size-16 text-emerald-500 mb-3" />
            <h2 className="text-xl font-bold text-foreground">Cập nhật thành công!</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Đang chuyển hướng về bài đăng...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Chỉnh sửa bài đăng
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Cập nhật thông tin tuyển mẫu, dịch vụ hoặc trạng thái hiển thị của bài đăng.
              </p>
            </div>

            {customError && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {customError}
              </div>
            )}

            {/* Ảnh minh họa */}
            <Field>
              <FieldLabel>Ảnh minh họa</FieldLabel>
              <ImageUpload value={images} onChange={setImages} max={6} tileAspect="4/5" />
            </Field>

            {/* Status Selector */}
            <Field>
              <FieldLabel>Trạng thái bài đăng</FieldLabel>
              <Select items={STATUS_ITEMS} value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Title */}
            <Field>
              <FieldLabel>
                Tiêu đề bài đăng <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setCustomError(null);
                }}
              />
            </Field>

            {/* Region & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-1">
                  <MapPinIcon className="size-3.5 text-primary" />
                  Khu vực
                </FieldLabel>
                <Select
                  items={regionItems}
                  value={regionId || null}
                  onValueChange={(v) => setRegionId((v as string) ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Giữ nguyên khu vực --" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r: any) => (
                      <SelectItem key={r.id || r.ID} value={r.id || r.ID}>
                        {r.name || r.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-1">
                  <TagIcon className="size-3.5 text-primary" />
                  Chuyên ngành / Dịch vụ
                </FieldLabel>
                <Select
                  items={specialtyItems}
                  value={specialtyId || null}
                  onValueChange={(v) => setSpecialtyId((v as string) ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn chuyên ngành --" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((s: any) => (
                      <SelectItem key={s.id || s.ID} value={s.id || s.ID}>
                        {s.name || s.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Extra fields: Practice Time & Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-1">
                  <ClockIcon className="size-3.5 text-primary" />
                  Thời gian thực hiện
                </FieldLabel>
                <Input
                  value={practiceTime}
                  onChange={(e) => setPracticeTime(e.target.value)}
                  placeholder="Ví dụ: 09:00 - 12:00 Chủ Nhật này"
                />
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-1">
                  <UsersIcon className="size-3.5 text-primary" />
                  Số lượng slot
                </FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={slotsTotal}
                  onChange={(e) => setSlotsTotal(e.target.value ? Number(e.target.value) : '')}
                />
              </Field>
            </div>

            {/* Quyền lợi / Hỗ trợ */}
            <Field>
              <FieldLabel className="flex items-center gap-1">
                <GiftIcon className="size-3.5 text-emerald-500" />
                Quyền lợi / Hỗ trợ
              </FieldLabel>
              <Input value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} />
            </Field>

            {/* Yêu cầu */}
            <Field>
              <FieldLabel>Yêu cầu cụ thể</FieldLabel>
              <Input value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel>Mô tả chi tiết</FieldLabel>
              <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>

            {/* Submit Actions */}
            <div className="mt-3 flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link
                href={`/posts/${postId}`}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Hủy bỏ
              </Link>
              <Button
                type="submit"
                disabled={updatePostMutation.isPending || !title.trim()}
                className="rounded-xl px-5 font-bold shadow-xs shadow-primary/25"
              >
                {updatePostMutation.isPending ? 'Đang lưu thay đổi...' : 'Cập nhật bài đăng'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

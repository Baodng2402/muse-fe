'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SparkleIcon,
  CheckCircleIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  GiftIcon,
  UsersIcon,
  ListPlusIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel, FieldDescription } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/Select';
import { ImageUpload } from '@/src/shared/components/ui/ImageUpload';
import { cn } from '@/src/shared/utils';
import { useAuthStore } from '@/src/shared/store/store.auth';
import { useCreatePostMutation, useRegionsQuery, useSpecialtiesQuery } from '../hooks/usePosts';
import type { PostType, ServiceRequest } from '@/src/core/api/types';

const STEPS = ['Ảnh & Loại tin', 'Thông tin chi tiết', 'Xem lại & Đăng'] as const;

const POST_TYPE_OPTIONS: { value: PostType; title: string; desc: string }[] = [
  { value: 'find_model', title: 'Tuyển mẫu thực hành', desc: 'Thợ tìm mẫu để luyện tay nghề hoặc lên layout mới' },
  { value: 'booking', title: 'Thợ nhận booking', desc: 'Dịch vụ làm đẹp, makeup, chụp ảnh chuyên nghiệp' },
  { value: 'model_available', title: 'Mẫu tự giới thiệu', desc: 'Người mẫu tìm thợ/studio để nhận kèo makeup & chụp' },
];

export function CreatePostPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const [step, setStep] = useState(0);

  const [postType, setPostType] = useState<PostType>('find_model');
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [regionId, setRegionId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [practiceTime, setPracticeTime] = useState('');
  const [discountNote, setDiscountNote] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [slotsTotal, setSlotsTotal] = useState<number | ''>('');

  // Service packages for booking posts
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [priceFrom, setPriceFrom] = useState<number | ''>('');
  const [priceTo, setPriceTo] = useState<number | ''>('');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('');

  const [stepError, setStepError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const errorRef = useRef<HTMLDivElement>(null);

  const { data: regions = [] } = useRegionsQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();
  const { mutate: createPost, isPending, error } = useCreatePostMutation();

  const regionItems = (regions as any[]).map((r) => ({ value: r.id || r.ID, label: r.name || r.Name }));
  const specialtyItems = (specialties as any[]).map((s) => ({ value: s.id || s.ID, label: s.name || s.Name }));
  const regionName = regionItems.find((r) => r.value === regionId)?.label;
  const specialtyName = specialtyItems.find((s) => s.value === specialtyId)?.label;

  const handleAddService = () => {
    if (!serviceName.trim()) return;
    setServices((prev) => [
      ...prev,
      {
        service_name: serviceName.trim(),
        price_from: priceFrom === '' ? undefined : Number(priceFrom),
        price_to: priceTo === '' ? undefined : Number(priceTo),
        duration_minutes: durationMinutes === '' ? undefined : Number(durationMinutes),
      },
    ]);
    setServiceName('');
    setPriceFrom('');
    setPriceTo('');
    setDurationMinutes('');
  };

  const handleRemoveService = (index: number) => {
    setServices((prev) => prev.filter((_, idx) => idx !== index));
  };

  const goNext = () => {
    setStepError(null);

    if (step === 1) {
      if (!title.trim()) {
        setStepError('Vui lòng nhập tiêu đề bài đăng.');
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        return;
      }
      if (!regionId) {
        setStepError('Vui lòng chọn khu vực.');
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        return;
      }
      if (postType === 'find_model' && !specialtyId) {
        setStepError('Vui lòng chọn chuyên ngành / dịch vụ cho bài tuyển mẫu.');
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        return;
      }
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    const imagesPayload =
      images.length > 0 ? images.map((image_url, position) => ({ image_url, position })) : undefined;

    createPost(
      {
        type: postType,
        title: title.trim(),
        description: description.trim() || undefined,
        region_id: regionId,
        specialty_id: specialtyId || undefined,
        status: 'published',
        images: imagesPayload,
        practice_time: practiceTime.trim() || undefined,
        discount_note: discountNote.trim() || undefined,
        requirements_text: requirementsText.trim() || undefined,
        slots_total: slotsTotal === '' ? undefined : Number(slotsTotal),
        services: services.length > 0 ? services : undefined,
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
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10 pb-24 sm:pb-10">
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
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Tạo bài đăng mới
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Đăng tin tuyển mẫu thực hành, nhận booking dịch vụ, hoặc tự giới thiệu làm mẫu.
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {STEPS.map((label, idx) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                        idx < step
                          ? 'bg-primary text-primary-foreground'
                          : idx === step
                          ? 'bg-primary/10 text-primary border border-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {idx < step ? <CheckCircleIcon weight="fill" className="size-3.5" /> : idx + 1}
                    </span>
                    <span
                      className={cn(
                        'hidden text-[11px] font-semibold sm:inline',
                        idx === step ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={cn('h-px flex-1', idx < step ? 'bg-primary' : 'bg-border')} />
                  )}
                </div>
              ))}
            </div>

            {(stepError || error) && (
              <div ref={errorRef} className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {stepError || (error as Error)?.message || 'Không thể tạo bài đăng. Vui lòng kiểm tra lại dữ liệu.'}
              </div>
            )}

            {/* Step 1: Post type + Photos */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <Field>
                  <FieldLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Mục đích bài đăng
                  </FieldLabel>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {POST_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPostType(opt.value)}
                        className={cn(
                          'flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                          postType === opt.value
                            ? 'border-primary bg-primary/10 shadow-xs'
                            : 'border-border bg-background hover:border-foreground/20'
                        )}
                      >
                        <span className="text-xs font-bold text-foreground">{opt.title}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Ảnh minh họa</FieldLabel>
                  <ImageUpload value={images} onChange={setImages} max={6} tileAspect="4/5" />
                  <FieldDescription>
                    Đăng ảnh thật của layout/dịch vụ giúp tin đăng đáng tin cậy hơn nhiều so với chỉ có chữ.
                  </FieldDescription>
                </Field>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <Field>
                  <FieldLabel>
                    Tiêu đề bài đăng <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    required
                    placeholder="Ví dụ: Cần 2 bạn mẫu makeup tone Hàn Quốc chụp lookbook Chủ Nhật này"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5 text-primary" />
                      Khu vực <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      items={regionItems}
                      value={regionId || null}
                      onValueChange={(v) => setRegionId((v as string) ?? '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn khu vực --" />
                      </SelectTrigger>
                      <SelectContent>
                        {(regions as any[]).map((r) => (
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
                      Chuyên ngành / Dịch vụ {postType === 'find_model' && <span className="text-destructive">*</span>}
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
                        {(specialties as any[]).map((s) => (
                          <SelectItem key={s.id || s.ID} value={s.id || s.ID}>
                            {s.name || s.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="flex items-center gap-1">
                      <ClockIcon className="size-3.5 text-primary" />
                      Thời gian thực hiện (tùy chọn)
                    </FieldLabel>
                    <Input
                      placeholder="Ví dụ: 09:00 - 12:00 Chủ Nhật này"
                      value={practiceTime}
                      onChange={(e) => setPracticeTime(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="flex items-center gap-1">
                      <UsersIcon className="size-3.5 text-primary" />
                      Số lượng slot cần tuyển
                    </FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Ví dụ: 2"
                      value={slotsTotal}
                      onChange={(e) => setSlotsTotal(e.target.value ? Number(e.target.value) : '')}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel className="flex items-center gap-1">
                    <GiftIcon className="size-3.5 text-emerald-500" />
                    Quyền lợi / Hỗ trợ cho mẫu (tùy chọn)
                  </FieldLabel>
                  <Input
                    placeholder="Ví dụ: Miễn phí 100% + hỗ trợ 100k tiền xăng xe + trả toàn bộ file ảnh"
                    value={discountNote}
                    onChange={(e) => setDiscountNote(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel>Yêu cầu cụ thể (tùy chọn)</FieldLabel>
                  <Input
                    placeholder="Ví dụ: Mí mắt rõ, da ít khuyết điểm, không nối mi trước đó..."
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                  />
                </Field>

                {postType === 'booking' && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ListPlusIcon className="size-4 text-primary" />
                      Bảng giá gói dịch vụ (Booking)
                    </h3>

                    {services.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {services.map((srv, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-xs"
                          >
                            <div>
                              <span className="font-bold text-foreground">{srv.service_name}</span>
                              <span className="text-muted-foreground ml-2">
                                {srv.price_from ? `${srv.price_from.toLocaleString('vi-VN')}đ` : 'Thoả thuận'}
                                {srv.price_to ? ` - ${srv.price_to.toLocaleString('vi-VN')}đ` : ''}
                                {srv.duration_minutes ? ` (${srv.duration_minutes} phút)` : ''}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-destructive hover:text-destructive/80 cursor-pointer"
                            >
                              <TrashIcon className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                      <Input
                        placeholder="Tên gói (ví dụ: Makeup tiệc)"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Giá từ (VNĐ)"
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value ? Number(e.target.value) : '')}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Giá đến (VNĐ)"
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value ? Number(e.target.value) : '')}
                        className="h-9 text-xs"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Thời gian (phút)"
                          value={durationMinutes}
                          onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')}
                          className="h-9 w-full text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddService}
                          disabled={!serviceName.trim()}
                          className="h-9 px-3 rounded-xl shrink-0"
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Field>
                  <FieldLabel>Mô tả chi tiết & Ghi chú thêm</FieldLabel>
                  <Textarea
                    rows={4}
                    placeholder="Mô tả cụ thể thông tin studio/địa chỉ, phong cách mong muốn, lưu ý mang theo..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {images.map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={url} src={url} alt="" className="aspect-4/5 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Chưa có ảnh minh họa — quay lại bước 1 nếu muốn thêm.
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-muted/30 p-4 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Loại tin</span>
                    <span className="font-semibold text-foreground text-xs">
                      {POST_TYPE_OPTIONS.find((o) => o.value === postType)?.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground text-xs">Tiêu đề</span>
                    <span className="font-semibold text-foreground text-xs text-right">{title}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground text-xs">Khu vực</span>
                    <span className="font-semibold text-foreground text-xs">{regionName || '—'}</span>
                  </div>
                  {specialtyName && (
                    <div className="flex items-center justify-between border-t border-border/60 pt-2">
                      <span className="text-muted-foreground text-xs">Chuyên ngành</span>
                      <span className="font-semibold text-foreground text-xs">{specialtyName}</span>
                    </div>
                  )}
                  {slotsTotal !== '' && (
                    <div className="flex items-center justify-between border-t border-border/60 pt-2">
                      <span className="text-muted-foreground text-xs">Số slot</span>
                      <span className="font-semibold text-foreground text-xs">{slotsTotal}</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Kiểm tra lại thông tin trước khi đăng — bạn vẫn có thể sửa sau khi đăng.
                </p>
              </div>
            )}

            {/* Step navigation — STICKY on mobile, inline on desktop */}
            <div className="fixed bottom-0 inset-x-0 sm:static sm:mt-1 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:border-t-border sm:bg-transparent sm:backdrop-blur-none sm:px-0 sm:py-0 sm:pb-0 z-30 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={goBack} className="rounded-xl px-4">
                  <ArrowLeftIcon className="size-4 mr-1" />
                  Quay lại
                </Button>
              ) : (
                <Link
                  href="/posts"
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Hủy bỏ
                </Link>
              )}

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext} className="rounded-xl px-5 font-bold">
                  Tiếp theo
                  <ArrowRightIcon className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="rounded-xl px-5 font-bold shadow-xs shadow-primary/25"
                >
                  {isPending ? 'Đang tạo bài đăng...' : 'Đăng bài ngay'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  CheckIcon,
  MapPinIcon,
  SparkleIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { Field, FieldLabel, FieldDescription } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import { ImageUpload } from '@/src/shared/components/ui/ImageUpload';
import { useRegionsQuery, useSpecialtiesQuery } from '@/src/shared/hooks/useMetadata';
import { useUpdateProfileMutation } from '../hooks/useUser';
import { cn } from '@/src/shared/utils';
import type { UserDTO } from '@/src/core/api/types';

interface AccountSettingsTabProps {
  user: UserDTO;
}

const LEVELS = [
  { value: 'student', label: 'Học viên / Mới bắt đầu', desc: 'Đang học nghề, cần mẫu thực hành thường xuyên' },
  { value: 'experienced', label: 'Đã có kinh nghiệm', desc: 'Tay nghề vững, nhận dịch vụ & chụp lookbook' },
  { value: 'professional', label: 'Chuyên nghiệp / Master', desc: 'Nghệ nhân lâu năm, chủ studio / cơ sở làm đẹp' },
] as const;

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const [displayName, setDisplayName] = useState(user.display_name || '');
  const [username, setUsername] = useState(user.username || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [coverUrl, setCoverUrl] = useState(user.cover_url || '');
  const [regionId, setRegionId] = useState(user.region_id || '');
  const [level, setLevel] = useState<string>(user.level || 'student');
  
  // Roles: provider vs customer
  const initialRoles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['customer'];
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);

  // Specialties
  const initialSpecialtyIds = Array.isArray(user.specialties)
    ? user.specialties.map((s) => s.id)
    : [];
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>(initialSpecialtyIds);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: regions = [] } = useRegionsQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();
  const updateMutation = useUpdateProfileMutation();

  useEffect(() => {
    setDisplayName(user.display_name || '');
    setUsername(user.username || '');
    setPhone(user.phone || '');
    setBio(user.bio || '');
    setAvatarUrl(user.avatar_url || '');
    setCoverUrl(user.cover_url || '');
    setRegionId(user.region_id || '');
    setLevel(user.level || 'student');
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      setSelectedRoles(user.roles);
    }
    if (Array.isArray(user.specialties)) {
      setSelectedSpecialtyIds(user.specialties.map((s) => s.id));
    }
  }, [user]);

  const toggleRole = (role: 'provider' | 'customer') => {
    setSelectedRoles((prev) => {
      const exists = prev.includes(role);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one role
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  };

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialtyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    updateMutation.mutate(
      {
        display_name: displayName.trim(),
        username: username.trim() || undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
        cover_url: coverUrl.trim() || undefined,
        region_id: regionId || undefined,
        roles: selectedRoles,
        level: level || undefined,
        specialty_ids: selectedSpecialtyIds,
      },
      {
        onSuccess: () => {
          setFeedback({ type: 'success', message: 'Cập nhật thông tin tài khoản thành công!' });
          setTimeout(() => setFeedback(null), 3500);
        },
        onError: (err) => {
          setFeedback({ type: 'error', message: err.message || 'Cập nhật thất bại. Vui lòng thử lại!' });
        },
      }
    );
  };

  const isProviderSelected = selectedRoles.includes('provider');

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">Cài đặt thông tin tài khoản</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý thông tin hồ sơ, vai trò hoạt động và lĩnh vực chuyên môn của bạn trên Muse.
        </p>
      </div>

      {feedback && (
        <div
          className={cn(
            'rounded-xl p-3 text-xs font-semibold',
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
              : 'bg-destructive/10 border border-destructive/20 text-destructive'
          )}
        >
          {feedback.message}
        </div>
      )}

      {/* 1. Vai trò người dùng (Type / Role) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
            <UserIcon weight="bold" className="size-4 text-primary" />
            Loại hình tài khoản / Vai trò
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Chọn một hoặc cả hai vai trò để Muse tối ưu trải nghiệm và quyền hạn của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Provider Card */}
          <button
            type="button"
            onClick={() => toggleRole('provider')}
            className={cn(
              'flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative',
              selectedRoles.includes('provider')
                ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <SparkleIcon weight="fill" className="size-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  Thợ làm đẹp / Nhiếp ảnh / Mẫu
                </span>
              </div>
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border transition-colors',
                  selectedRoles.includes('provider')
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background'
                )}
              >
                {selectedRoles.includes('provider') && <CheckIcon weight="bold" className="size-3" />}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Đăng tin tuyển mẫu thực hành make-up, nail, nhận booking dịch vụ và đăng tải Portfolio tác phẩm.
            </p>
          </button>

          {/* Customer Card */}
          <button
            type="button"
            onClick={() => toggleRole('customer')}
            className={cn(
              'flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative',
              selectedRoles.includes('customer')
                ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserIcon weight="fill" className="size-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  Khách hàng / Thành viên
                </span>
              </div>
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border transition-colors',
                  selectedRoles.includes('customer')
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background'
                )}
              >
                {selectedRoles.includes('customer') && <CheckIcon weight="bold" className="size-3" />}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Tìm kiếm thợ làm đẹp, nhận làm mẫu make-up/nail/lookbook hoặc đặt lịch làm đẹp chất lượng cao.
            </p>
          </button>
        </div>
      </div>

      {/* 2. Cấp độ kinh nghiệm (Level) - Hiển thị khi là Provider */}
      {isProviderSelected && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <BriefcaseIcon weight="bold" className="size-4 text-primary" />
              Cấp độ tay nghề / Kinh nghiệm
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Giúp khách hàng và người xem portfolio hiểu rõ mức độ chuyên nghiệp của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setLevel(lvl.value)}
                className={cn(
                  'flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer',
                  level === lvl.value
                    ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30'
                    : 'border-border bg-card hover:border-primary/40'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-foreground">{lvl.label}</span>
                  {level === lvl.value && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon weight="bold" className="size-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Chuyên môn / Lĩnh vực hoạt động */}
      {isProviderSelected && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <SparkleIcon weight="bold" className="size-4 text-primary" />
              Lĩnh vực hoạt động / Chuyên môn
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Chọn các chuyên ngành bạn đang cung cấp hoặc tìm mẫu.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {specialties.map((spec) => {
              const specId = spec.id || spec.ID || '';
              const isSelected = selectedSpecialtyIds.includes(specId);
              return (
                <button
                  key={specId}
                  type="button"
                  onClick={() => toggleSpecialty(specId)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {isSelected && <CheckIcon weight="bold" className="size-3" />}
                  <span>{spec.name || spec.Name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Khu vực hoạt động */}
      <Field>
        <FieldLabel className="flex items-center gap-1.5">
          <MapPinIcon className="size-4 text-primary" />
          Khu vực hoạt động chính
        </FieldLabel>
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm text-foreground outline-none focus-visible:border-primary cursor-pointer"
        >
          <option value="">-- Chọn tỉnh / thành phố --</option>
          {regions.map((reg) => {
            const rId = reg.id || reg.ID || '';
            const rName = reg.name || reg.Name || '';
            return (
              <option key={rId} value={rId}>
                {rName}
              </option>
            );
          })}
        </select>
        <FieldDescription>Khu vực giúp bạn tiếp cận người dùng và mẫu ở gần thuận tiện hơn.</FieldDescription>
      </Field>

      {/* 5. Thông tin hình ảnh hồ sơ */}
      <Field>
        <FieldLabel>Ảnh đại diện</FieldLabel>
        <ImageUpload
          value={avatarUrl ? [avatarUrl] : []}
          onChange={(urls) => setAvatarUrl(urls[urls.length - 1] || '')}
          max={1}
          tileAspect="square"
        />
      </Field>

      <Field>
        <FieldLabel>Ảnh bìa hồ sơ</FieldLabel>
        <ImageUpload
          value={coverUrl ? [coverUrl] : []}
          onChange={(urls) => setCoverUrl(urls[urls.length - 1] || '')}
          max={1}
          tileAspect="4/5"
        />
      </Field>

      {/* 6. Tên hiển thị & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Tên hiển thị</FieldLabel>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Nhập họ và tên hoặc nghệ danh"
          />
        </Field>

        <Field>
          <FieldLabel>Tên người dùng (Username)</FieldLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
            placeholder="vd: huong.makeup"
          />
          <FieldDescription>Định danh hồ sơ công khai của bạn trên link Muse.</FieldDescription>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" disabled value={user.email || ''} className="disabled:bg-muted/50" />
          <FieldDescription>Email đăng nhập không thể thay đổi</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Số điện thoại liên hệ</FieldLabel>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912345678"
          />
          <FieldDescription>Dùng để khách hàng liên hệ khi nhận lịch hẹn</FieldDescription>
        </Field>
      </div>

      <Field>
        <FieldLabel>Tiểu sử (Bio / Giới thiệu bản thân)</FieldLabel>
        <Textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Mô tả phong cách trang điểm, định hướng làm việc hoặc kinh nghiệm nổi bật của bạn..."
        />
      </Field>

      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          size="default"
          disabled={updateMutation.isPending}
          className="rounded-xl font-bold cursor-pointer px-6"
        >
          {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
}

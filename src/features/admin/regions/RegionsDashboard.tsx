'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPinIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr';
import {
  useRegionsQuery,
  useCreateRegionMutation,
  useToggleRegionStatusMutation,
} from '@/src/shared/hooks/useMetadata';
import { AdminGuard } from '../components/AdminGuard';
import { Button } from '@/src/shared/components/ui/Button';
import { Badge } from '@/src/shared/components/ui/Badge';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/src/shared/components/ui/Modal';

export function RegionsDashboard() {
  const { data: regions = [], isLoading } = useRegionsQuery();
  const createMutation = useCreateRegionMutation();
  const toggleMutation = useToggleRegionStatusMutation();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug from name
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !slug.trim()) return;

    createMutation.mutate(
      { name: name.trim(), slug: slug.trim() },
      {
        onSuccess: () => {
          setName('');
          setSlug('');
          setIsCreateOpen(false);
        },
        onError: (err) => {
          setErrorMsg((err as Error).message || 'Không thể tạo khu vực.');
        },
      }
    );
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                Admin Panel
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
              <MapPinIcon className="size-6 text-primary" />
              Quản lý Khu vực (Regions)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Thêm mới và kích hoạt/tạm dừng các tỉnh thành hỗ trợ trên Muse.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <Link
              href="/admin/reports"
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              ← Báo cáo Vi phạm
            </Link>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl font-bold shadow-xs shadow-primary/20"
            >
              <PlusIcon weight="bold" className="size-3.5 mr-1" />
              Thêm khu vực
            </Button>
          </div>
        </div>

        {/* Create Region Modal */}
        <Modal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle className="flex items-center gap-1.5">
                <MapPinIcon className="size-4 text-primary" />
                Thêm khu vực mới
              </ModalTitle>
            </ModalHeader>

            {errorMsg && (
              <div className="mb-3 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <Field>
                <FieldLabel>Tên tỉnh / thành phố</FieldLabel>
                <Input
                  required
                  placeholder="Ví dụ: Cần Thơ"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Slug đường dẫn</FieldLabel>
                <Input
                  required
                  placeholder="can-tho"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </Field>

              <ModalFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Hủy bỏ
                </Button>
                <Button type="submit" size="sm" disabled={createMutation.isPending || !name.trim() || !slug.trim()}>
                  {createMutation.isPending ? 'Đang thêm...' : 'Thêm khu vực'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {regions.map((region) => {
              const id = region.id || region.ID || '';
              const regionName = region.name || region.Name || '';
              const regionSlug = region.slug || region.Slug || '';
              const isActive = region.is_active ?? region.IsActive ?? true;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/30 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground">{regionName}</span>
                      <Badge variant={isActive ? 'success' : 'secondary'}>
                        {isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      /{regionSlug}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(id)}
                    disabled={toggleMutation.isPending}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'border-amber-200/60 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                        : 'border-emerald-200/60 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

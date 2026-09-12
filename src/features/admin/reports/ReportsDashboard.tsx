'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  WarningCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  ArrowSquareOutIcon,
  SparkleIcon,
} from '@phosphor-icons/react/dist/ssr';
import {
  useReportsQuery,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
} from '@/src/features/reports/hooks/useReports';
import { AdminGuard } from '../components/AdminGuard';
import { Badge, type badgeVariants } from '@/src/shared/components/ui/Badge';
import { cn } from '@/src/shared/utils';
import type { ReportStatus } from '@/src/core/api/types';
import type { VariantProps } from 'class-variance-authority';

const STATUS_BADGES: Record<ReportStatus, { label: string; variant: VariantProps<typeof badgeVariants>['variant'] }> = {
  pending: { label: 'Chờ duyệt', variant: 'warning' },
  reviewed: { label: 'Đang xem xét', variant: 'default' },
  actioned: { label: 'Đã xử lý', variant: 'success' },
  dismissed: { label: 'Đã bỏ qua', variant: 'secondary' },
};

export function ReportsDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  const { data: reports = [], isLoading } = useReportsQuery(
    statusFilter === 'all' ? undefined : statusFilter
  );

  const updateStatusMutation = useUpdateReportStatusMutation();
  const deleteMutation = useDeleteReportMutation();

  const handleUpdateStatus = (id: string, status: ReportStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa báo cáo này?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                Admin Panel
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
              <WarningCircleIcon className="size-6 text-destructive" />
              Quản lý Báo cáo Vi phạm (Reports)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Xem xét và xử lý các báo cáo về nội dung không phù hợp hoặc vi phạm cộng đồng.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <Link
              href="/admin/regions"
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Quản lý Khu vực →
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {[
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'reviewed', label: 'Đang xem xét' },
            { id: 'actioned', label: 'Đã xử lý' },
            { id: 'dismissed', label: 'Bỏ qua' },
            { id: 'all', label: 'Tất cả' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  'rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer border',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-28 w-full bg-muted rounded-2xl" />
            <div className="h-28 w-full bg-muted rounded-2xl" />
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-xs">
            <SparkleIcon className="mx-auto size-12 text-primary/40 mb-3" />
            <h3 className="text-base font-bold text-foreground">Không có báo cáo nào</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Không tìm thấy báo cáo vi phạm nào trong danh mục này.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map((report) => {
              const badge = STATUS_BADGES[report.status] || {
                label: report.status,
                variant: 'secondary' as const,
              };

              return (
                <div
                  key={report.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <Badge variant="outline" className="uppercase">
                        {report.target_type}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(report.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground">
                      Lý do: {report.reason}
                    </h3>

                    {report.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Mã mục tiêu: {report.target_id.slice(0, 8)}...</span>
                      {report.target_type === 'post' && (
                        <Link
                          href={`/posts/${report.target_id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                        >
                          Xem bài đăng bị báo cáo
                          <ArrowSquareOutIcon className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center shrink-0">
                    {report.status !== 'reviewed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 cursor-pointer"
                        title="Đánh dấu đang xem xét"
                      >
                        <EyeIcon className="size-3.5" />
                        Xem xét
                      </button>
                    )}

                    {report.status !== 'actioned' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(report.id, 'actioned')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 cursor-pointer"
                        title="Đánh dấu đã xử lý"
                      >
                        <CheckCircleIcon weight="bold" className="size-3.5" />
                        Xử lý
                      </button>
                    )}

                    {report.status !== 'dismissed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 cursor-pointer"
                        title="Bỏ qua báo cáo"
                      >
                        <XCircleIcon className="size-3.5" />
                        Bỏ qua
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(report.id)}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-1 rounded-xl border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 active:scale-95 cursor-pointer"
                      title="Xóa báo cáo"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

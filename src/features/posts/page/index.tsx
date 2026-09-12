'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { buttonVariants } from '@/src/shared/components/ui/Button';
import { EmptyState } from '@/src/shared/components/common/EmptyState';
import { Pagination } from '@/src/shared/components/common/Pagination';
import { usePagination } from '@/src/shared/hooks/usePagination';
import {
  usePostsQuery,
  useToggleSavePostMutation,
  useRegionsQuery,
  useSpecialtiesQuery,
} from '../hooks/usePosts';
import { normalizePost } from '../utils/normalize-post';
import { PostsTabHeader, type ViewMode, type ActiveTab } from '../components/PostsTabHeader';
import { PostsQuickFilters, type BenefitFilter } from '../components/PostsQuickFilters';
import { PostsFilterDrawer } from '../components/PostsFilterDrawer';
import { CompactPostCard } from '../components/PostCardCompact';
import { DetailedModelCard, DetailedProCard } from '../components/PostCardDetailed';
import { useUrlParams } from '@/src/shared/hooks/useUrlParams';
import type { Region, Specialty } from '@/src/core/api/types';

export function PostsPage() {
  const { getParam, setParams } = useUrlParams();
  const tabParam = getParam<ActiveTab>('tab');
  const activeTab: ActiveTab = tabParam === 'nhan-booking' ? 'nhan-booking' : 'tim-mau';
  const [viewMode, setViewMode] = useState<ViewMode>('2-col');

  // Bộ lọc chuyên ngành/khu vực đồng bộ với URL (?specialty=...&region=...) — giống `tab`,
  // để link từ story-bar/search-hub trỏ thẳng vào 1 bộ lọc thật, chia sẻ được qua URL.
  const activeSpecialtyId = getParam('specialty', 'all')!;
  const activeRegionId = getParam('region', 'all')!;

  // Chuyên ngành/khu vực thật lấy từ API, không còn danh sách cứng trong code
  const { data: rawSpecialties = [] } = useSpecialtiesQuery();
  const { data: rawRegions = [] } = useRegionsQuery();
  const specialties = useMemo(
    () => (rawSpecialties as Specialty[]).map((s) => ({ id: s.id || s.ID!, name: s.name || s.Name! })),
    [rawSpecialties]
  );
  const regions = useMemo(
    () => (rawRegions as Region[]).map((r) => ({ id: r.id || r.ID!, name: r.name || r.Name! })),
    [rawRegions]
  );

  // Filters
  const [activeBenefit, setActiveBenefit] = useState<BenefitFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination hook synced with URL search params
  const { page, pageSize, setPage, setPageSize, resetPage, getPaginationIndicators } =
    usePagination({ defaultPageSize: 12 });

  const specialtyIdParam = activeSpecialtyId === 'all' ? undefined : activeSpecialtyId;
  const regionIdParam = activeRegionId === 'all' ? undefined : activeRegionId;

  // TanStack Query fetching model posts (find_model) — lọc chuyên ngành/khu vực thật ở server
  const {
    data: modelApiResponse,
    isLoading: isLoadingModel,
    isError: isErrorModel,
  } = usePostsQuery({
    type: 'find_model',
    page: activeTab === 'tim-mau' ? page : 1,
    page_size: activeTab === 'tim-mau' ? pageSize : 12,
    specialty_id: specialtyIdParam,
    region_id: regionIdParam,
  });

  // TanStack Query fetching pro booking posts (booking)
  const {
    data: proApiResponse,
    isLoading: isLoadingPro,
    isError: isErrorPro,
  } = usePostsQuery({
    type: 'booking',
    page: activeTab === 'nhan-booking' ? page : 1,
    page_size: activeTab === 'nhan-booking' ? pageSize : 12,
    specialty_id: specialtyIdParam,
    region_id: regionIdParam,
  });

  const apiPostsResponse = activeTab === 'tim-mau' ? modelApiResponse : proApiResponse;
  const isLoading = activeTab === 'tim-mau' ? isLoadingModel : isLoadingPro;
  const isError = activeTab === 'tim-mau' ? isErrorModel : isErrorPro;

  // Real independent counts for both tabs so switching tabs never resets the other to 0
  const modelCount = useMemo(() => {
    const meta = !Array.isArray(modelApiResponse) ? modelApiResponse?.pagination : undefined;
    if (meta?.total_records !== undefined) return meta.total_records;
    const list = Array.isArray(modelApiResponse) ? modelApiResponse : modelApiResponse?.data;
    return list?.length ?? 0;
  }, [modelApiResponse]);

  const proCount = useMemo(() => {
    const meta = !Array.isArray(proApiResponse) ? proApiResponse?.pagination : undefined;
    if (meta?.total_records !== undefined) return meta.total_records;
    const list = Array.isArray(proApiResponse) ? proApiResponse : proApiResponse?.data;
    return list?.length ?? 0;
  }, [proApiResponse]);

  const { mutate: toggleSavePost } = useToggleSavePostMutation();

  // Normalize backend posts into UI-ready posts (Zero Mock fallback)
  const postsSource = useMemo(() => {
    const rawList = Array.isArray(apiPostsResponse)
      ? apiPostsResponse
      : apiPostsResponse?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [apiPostsResponse]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeSpecialtyId !== 'all') count++;
    if (activeRegionId !== 'all') count++;
    if (activeBenefit !== 'all') count++;
    return count;
  }, [activeSpecialtyId, activeRegionId, activeBenefit]);

  // Chuyên ngành/khu vực đã lọc ở server (specialty_id/region_id) — chỉ còn lọc quyền lợi ở
  // client vì backend chưa hỗ trợ filter theo benefit.
  const filteredPosts = useMemo(() => {
    let result = postsSource;

    if (activeTab === 'tim-mau') {
      if (activeBenefit === 'free') {
        result = result.filter((post) => post.benefitType === 'free');
      } else if (activeBenefit === 'stipend') {
        result = result.filter((post) => post.benefitType === 'stipend');
      }
    }
    return result;
  }, [postsSource, activeTab, activeBenefit]);

  const handleResetFilters = () => {
    // Gộp 1 lần setParams — 2 lời gọi router.replace riêng rẽ trong cùng 1 handler sẽ
    // ghi đè nhau vì cả 2 đọc cùng 1 snapshot searchParams cũ (chưa kịp re-render giữa chừng).
    setParams({ specialty: null, region: null, page: null });
    setActiveBenefit('all');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setParams({ tab: tab === 'tim-mau' ? null : tab, page: null }, { replace: false });
  };

  const paginationMeta =
    apiPostsResponse && !Array.isArray(apiPostsResponse)
      ? apiPostsResponse.pagination
      : undefined;
  const paginationIndicators = getPaginationIndicators(paginationMeta);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 min-w-0">
      {/* 1. Header & Tab Navigation */}
      <PostsTabHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        modelCount={modelCount}
        proCount={proCount}
      />

      {/* 2. Quick Filters & Search Bar */}
      <div className="mt-3">
        <PostsQuickFilters
          activeTab={activeTab}
          specialties={specialties}
          activeSpecialtyId={activeSpecialtyId}
          onSpecialtyChange={(id) => {
            setParams({ specialty: id === 'all' ? null : id, page: null });
          }}
          regions={regions}
          activeRegionId={activeRegionId}
          onRegionChange={(id) => {
            setParams({ region: id === 'all' ? null : id, page: null });
          }}
          activeBenefit={activeBenefit}
          onBenefitChange={(b) => {
            setActiveBenefit(b);
            resetPage();
          }}
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilters}
        />

        <PostsFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          activeTab={activeTab}
          specialties={specialties}
          activeSpecialtyId={activeSpecialtyId}
          onSpecialtyChange={(id) => {
            setParams({ specialty: id === 'all' ? null : id, page: null });
          }}
          regions={regions}
          activeRegionId={activeRegionId}
          onRegionChange={(id) => {
            setParams({ region: id === 'all' ? null : id, page: null });
          }}
          activeBenefit={activeBenefit}
          onBenefitChange={(b) => {
            setActiveBenefit(b);
            resetPage();
          }}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 3. Sub-header: Count indicator & CTA create post */}
      <div className="mt-4 flex items-center justify-between px-0.5">
        <p className="text-xs font-semibold text-muted-foreground">
          {filteredPosts.length > 0 ? (
            <>
              Hiển thị <strong className="text-foreground">{filteredPosts.length}</strong> bài đăng
              {paginationMeta && ` (tổng ${paginationMeta.total_records})`}
            </>
          ) : (
            '0 kết quả'
          )}
        </p>

        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Đặt lại lọc
            </button>
          )}

          <Link
            href="/posts/new"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            <PlusIcon weight="bold" className="size-3.5 mr-1" />
            Đăng tin mới
          </Link>
        </div>
      </div>

      {/* 4. Posts Feed */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-muted/60 animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          title="Không tìm thấy bài đăng nào"
          description={
            isError
              ? 'Có lỗi khi tải danh sách từ hệ thống. Vui lòng thử lại sau.'
              : 'Chưa có bài đăng nào phù hợp với bộ lọc hiện tại của bạn.'
          }
          action={{
            label: 'Đăng bài mới ngay',
            href: '/posts/new',
          }}
          className="mt-8"
        />
      ) : viewMode === '2-col' ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPosts.map((post) => (
            <CompactPostCard
              key={post.id}
              post={post}
              onToggleBookmark={(id) =>
                toggleSavePost({ postId: id, isCurrentlySaved: Boolean(post.isSaved) })
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) =>
            post.type === 'tim-mau' ? (
              <DetailedModelCard
                key={post.id}
                post={post}
                onToggleBookmark={(id) =>
                  toggleSavePost({ postId: id, isCurrentlySaved: Boolean(post.isSaved) })
                }
              />
            ) : (
              <DetailedProCard
                key={post.id}
                post={post}
                onToggleBookmark={(id) =>
                  toggleSavePost({ postId: id, isCurrentlySaved: Boolean(post.isSaved) })
                }
              />
            )
          )}
        </div>
      )}

      {/* 5. Pagination */}
      {paginationIndicators.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={paginationIndicators.totalPages}
          totalRecords={paginationIndicators.totalRecords}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          className="mt-8"
        />
      )}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { buttonVariants } from '@/src/shared/components/ui/button';
import { EmptyState } from '@/src/shared/components/common/empty-state';
import { Pagination } from '@/src/shared/components/common/pagination';
import { usePagination } from '@/src/shared/hooks/use-pagination';
import { usePostsQuery, useToggleSavePostMutation } from '../hooks/use-posts';
import { normalizePost } from '../utils/normalize-post';
import { PostsTabHeader, type ViewMode, type ActiveTab } from '../components/posts-tab-header';
import {
  PostsQuickFilters,
  type TimingFilter,
  type BenefitFilter,
} from '../components/posts-quick-filters';
import { PostsFilterDrawer } from '../components/posts-filter-drawer';
import { CompactPostCard } from '../components/post-card-compact';
import { DetailedModelCard, DetailedProCard } from '../components/post-card-detailed';
import { useUrlParams } from '@/src/shared/hooks/use-url-params';
import type { CategoryId, CityId, PostType } from '../types';

export function PostsPage() {
  const { getParam, setParam } = useUrlParams();
  const tabParam = getParam<ActiveTab>('tab');
  const activeTab: ActiveTab = tabParam === 'nhan-booking' ? 'nhan-booking' : 'tim-mau';
  const [viewMode, setViewMode] = useState<ViewMode>('2-col');

  // Filters
  const [activeCategory, setActiveCategory] = useState<'all' | CategoryId>('all');
  const [activeCity, setActiveCity] = useState<'all' | CityId>('all');
  const [activeTiming, setActiveTiming] = useState<TimingFilter>('all');
  const [activeBenefit, setActiveBenefit] = useState<BenefitFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination hook synced with URL search params
  const { page, pageSize, setPage, setPageSize, resetPage, getPaginationIndicators } =
    usePagination({ defaultPageSize: 12 });

  // TanStack Query fetching model posts (find_model)
  const {
    data: modelApiResponse,
    isLoading: isLoadingModel,
    isError: isErrorModel,
  } = usePostsQuery({
    type: 'find_model',
    page: activeTab === 'tim-mau' ? page : 1,
    page_size: activeTab === 'tim-mau' ? pageSize : 12,
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
    if (activeCategory !== 'all') count++;
    if (activeCity !== 'all') count++;
    if (activeTiming !== 'all') count++;
    if (activeBenefit !== 'all') count++;
    return count;
  }, [activeCategory, activeCity, activeTiming, activeBenefit]);

  const filteredPosts = useMemo(() => {
    let result = postsSource;

    if (activeCategory !== 'all') {
      result = result.filter((post) => post.category === activeCategory);
    }
    if (activeCity !== 'all') {
      result = result.filter((post) => post.city === activeCity);
    }
    if (activeTab === 'tim-mau') {
      if (activeTiming !== 'all') {
        result = result.filter((post) => post.timingCategory === activeTiming);
      }
      if (activeBenefit === 'free') {
        result = result.filter((post) => post.benefitType === 'free');
      } else if (activeBenefit === 'stipend') {
        result = result.filter((post) => post.benefitType === 'stipend');
      }
    }
    return result;
  }, [postsSource, activeCategory, activeCity, activeTab, activeTiming, activeBenefit]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveCity('all');
    setActiveTiming('all');
    setActiveBenefit('all');
    resetPage();
  };

  const handleTabChange = (tab: ActiveTab) => {
    setParam('tab', tab === 'tim-mau' ? null : tab, { replace: false });
    resetPage();
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
          activeCategory={activeCategory}
          onCategoryChange={(c) => {
            setActiveCategory(c);
            resetPage();
          }}
          activeCity={activeCity}
          onCityChange={(c) => {
            setActiveCity(c);
            resetPage();
          }}
          activeTiming={activeTiming}
          onTimingChange={(t) => {
            setActiveTiming(t);
            resetPage();
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
          activeTab={activeTab}
          activeCategory={activeCategory}
          onCategoryChange={(c) => {
            setActiveCategory(c);
            resetPage();
          }}
          activeCity={activeCity}
          onCityChange={(c) => {
            setActiveCity(c);
            resetPage();
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
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPosts.map((post) => (
            <CompactPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

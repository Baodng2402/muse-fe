'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';
import { usePostsQuery } from '@/src/features/posts/hooks/use-posts';
import { normalizePost } from '@/src/features/posts/utils/normalize-post';
import { useDebounce } from '@/src/shared/hooks/use-debounce';
import { usePagination } from '@/src/shared/hooks/use-pagination';
import { Pagination } from '@/src/shared/components/common/pagination';
import { EmptyState } from '@/src/shared/components/common/empty-state';
import { CompactPostCard } from '@/src/features/posts/components/post-card-compact';
import { SearchDiscoveryHub } from '../components/search-discovery-hub';
import { cn } from '@/src/shared/utils';

export function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Makeup cô dâu tone Thái',
    'Mẫu nail quận 1',
    'Chụp lookbook',
  ]);
  const [resultFilter, setResultFilter] = useState<'all' | 'find_model' | 'booking'>('all');

  const { page, pageSize, setPage, setPageSize, resetPage, getPaginationIndicators } =
    usePagination({ defaultPageSize: 12 });

  const debouncedQuery = useDebounce(query, 300);

  const { data: searchApiData, isLoading } = usePostsQuery({
    search: debouncedQuery.trim() || undefined,
    type: resultFilter === 'all' ? undefined : resultFilter,
    page,
    page_size: pageSize,
  });

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/posts');
    }
  };

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw);
    resetPage();
    if (!recentSearches.includes(kw)) {
      setRecentSearches((prev) => [kw, ...prev.slice(0, 4)]);
    }
  };

  const handleRemoveRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const rawList = Array.isArray(searchApiData) ? searchApiData : searchApiData?.data;
    if (rawList && Array.isArray(rawList)) {
      return rawList.map((p, idx) => normalizePost(p, idx));
    }
    return [];
  }, [isSearching, searchApiData]);

  const paginationMeta = searchApiData?.pagination;
  const paginationIndicators = getPaginationIndicators(paginationMeta);

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* 1. Search Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon className="size-4" />
        </button>

        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Tìm theo layout, quận huyện, tên thợ..."
            className="w-full rounded-2xl border border-input bg-card py-2.5 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                resetPage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Results or Discovery Hub */}
      {isSearching ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="text-xs font-semibold text-muted-foreground">
              Tìm thấy <strong className="text-foreground">{searchResults.length}</strong> kết quả cho &ldquo;{query}&rdquo;
              {paginationMeta && ` (tổng ${paginationMeta.total_records})`}
            </span>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-2xl bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setResultFilter('all');
                  resetPage();
                }}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                  resultFilter === 'all'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => {
                  setResultFilter('find_model');
                  resetPage();
                }}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                  resultFilter === 'find_model'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Kèo tuyển mẫu
              </button>
              <button
                type="button"
                onClick={() => {
                  setResultFilter('booking');
                  resetPage();
                }}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                  resultFilter === 'booking'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Thợ chuyên nghiệp
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted/60 animate-pulse" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {searchResults.map((post) => (
                <CompactPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không tìm thấy bài đăng phù hợp"
              description="Thử tìm với các từ khóa phổ biến hơn như 'makeup', 'nail', 'quận 1' hoặc xem các xu hướng thịnh hành."
              action={{
                label: 'Xóa tìm kiếm',
                onClick: () => {
                  setQuery('');
                  resetPage();
                },
              }}
              className="mt-6"
            />
          )}

          {paginationIndicators.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={paginationIndicators.totalPages}
              totalRecords={paginationIndicators.totalRecords}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          )}
        </div>
      ) : (
        <SearchDiscoveryHub
          recentSearches={recentSearches}
          onSelectKeyword={handleSelectKeyword}
          onRemoveRecent={handleRemoveRecent}
          onClearAllRecent={handleClearAllRecent}
        />
      )}
    </div>
  );
}

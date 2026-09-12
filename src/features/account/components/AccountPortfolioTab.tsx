'use client';

import React, { useMemo } from 'react';
import { PortfolioGallery, type GalleryItem } from '@/src/features/portfolio/components/PortfolioGallery';
import { useUserPortfolioQuery } from '@/src/features/portfolio/hooks/usePortfolio';

interface AccountPortfolioTabProps {
  userId: string;
}

export function AccountPortfolioTab({ userId }: AccountPortfolioTabProps) {
  const { data: rawItems, isLoading } = useUserPortfolioQuery(userId);

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const list = Array.isArray(rawItems) ? rawItems : (rawItems as any)?.data;
    if (!list || !Array.isArray(list)) return [];

    return list.map((item: any) => {
      const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
      const imageUrl =
        firstImage?.image_url ||
        firstImage?.ImageUrl ||
        item.image_url ||
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=625&fit=crop&q=80';

      return {
        id: item.id || item.ID,
        title: item.title || item.Title || 'Tác phẩm',
        imageUrl,
        likes: item.like_count ?? item.LikeCount ?? 0,
        isLiked: item.is_liked ?? false,
      };
    });
  }, [rawItems]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-4/5 w-full rounded-2xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PortfolioGallery items={galleryItems} isOwner={true} />
    </div>
  );
}

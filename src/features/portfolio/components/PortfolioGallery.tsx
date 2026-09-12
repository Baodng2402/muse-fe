'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HeartIcon, PlusIcon, XIcon, SparkleIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/button';
import { EmptyState } from '@/src/shared/components/common/empty-state';
import {
  useCreatePortfolioMutation,
  useAddPortfolioImageMutation,
  useLikePortfolioMutation,
} from '../hooks/use-portfolio';
import { useAuthStore } from '@/src/shared/store/use-auth-store';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  isLiked?: boolean;
}

interface PortfolioGalleryProps {
  items: GalleryItem[];
  isOwner?: boolean;
  onLike?: (id: string) => void;
}

export function PortfolioGallery({ items, isOwner = false, onLike }: PortfolioGalleryProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [localItems, setLocalItems] = useState<GalleryItem[]>(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const createMutation = useCreatePortfolioMutation();
  const addImageMutation = useAddPortfolioImageMutation();
  const likeMutation = useLikePortfolioMutation();

  const handleLike = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked,
            }
          : item
      )
    );
    likeMutation.mutate(id);
    onLike?.(id);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    createMutation.mutate(
      { title: title.trim() },
      {
        onSuccess: (newItem: any) => {
          const itemId = newItem?.id || newItem?.ID || String(Date.now());
          addImageMutation.mutate({
            id: itemId,
            data: { image_url: imageUrl.trim() },
          });

          setLocalItems((prev) => [
            {
              id: itemId,
              title: title.trim(),
              imageUrl: imageUrl.trim(),
              likes: 0,
              isLiked: false,
            },
            ...prev,
          ]);

          setTitle('');
          setImageUrl('');
          setIsUploadOpen(false);
        },
      }
    );
  };

  return (
    <div>
      {/* Action Header for Owner */}
      {isOwner && (
        <div className="flex justify-end pb-3">
          <Button
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="rounded-xl font-bold shadow-xs shadow-primary/20"
          >
            <PlusIcon weight="bold" className="size-3.5 mr-1" />
            Thêm tác phẩm mới
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>

            <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <SparkleIcon className="size-4 text-primary" />
              Thêm tác phẩm vào Portfolio
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tải lên hình ảnh layout makeup, bộ móng hoặc ảnh lookbook chất lượng cao.
            </p>

            <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">
                  Tên tác phẩm / Layout
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tone Thái nhẹ nhàng cô dâu hè 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">
                  URL Hình ảnh
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus-visible:border-primary"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || !title.trim() || !imageUrl.trim()}
                >
                  {createMutation.isPending ? 'Đang lưu...' : 'Lưu tác phẩm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {localItems.length === 0 ? (
        <EmptyState
          title="Chưa có tác phẩm nào trong portfolio"
          description="Nghệ nhân chưa cập nhật bộ sưu tập tác phẩm."
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {localItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold truncate pr-2">{item.title}</span>
                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-bold backdrop-blur-md hover:bg-rose-500/80 transition-colors cursor-pointer"
                >
                  <HeartIcon
                    weight={item.isLiked ? 'fill' : 'regular'}
                    className={`size-3.5 ${item.isLiked ? 'text-rose-400' : 'text-white'}`}
                  />
                  {item.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  HeartIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/src/shared/components/ui/Button';
import { ImageUpload } from '@/src/shared/components/ui/ImageUpload';
import { Field, FieldLabel } from '@/src/shared/components/ui/Field';
import { Input } from '@/src/shared/components/ui/Input';
import { Textarea } from '@/src/shared/components/ui/Textarea';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/src/shared/components/ui/Modal';
import { AccountTabHeader } from '@/src/features/account/components/AccountTabHeader';
import { EmptyState } from '@/src/shared/components/common/EmptyState';
import {
  useCreatePortfolioMutation,
  useAddPortfolioImageMutation,
  useLikePortfolioMutation,
  useUnlikePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
} from '../hooks/usePortfolio';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
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
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [localItems, setLocalItems] = useState<GalleryItem[]>(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const createMutation = useCreatePortfolioMutation();
  const addImageMutation = useAddPortfolioImageMutation();
  const likeMutation = useLikePortfolioMutation();
  const unlikeMutation = useUnlikePortfolioMutation();
  const updateMutation = useUpdatePortfolioMutation();
  const deleteMutation = useDeletePortfolioMutation();

  const handleLikeToggle = (item: GalleryItem) => {
    const nextIsLiked = !item.isLiked;
    const nextLikes = nextIsLiked ? item.likes + 1 : Math.max(0, item.likes - 1);

    setLocalItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, likes: nextLikes, isLiked: nextIsLiked } : i))
    );

    if (item.isLiked) {
      unlikeMutation.mutate(item.id);
    } else {
      likeMutation.mutate(item.id);
    }
    onLike?.(item.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc muốn xóa tác phẩm này?')) return;
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
    deleteMutation.mutate(id);
  };

  const openEdit = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDesc(item.description || '');
  };

  const resetUploadForm = () => {
    setTitle('');
    setDescription('');
    setImages([]);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    updateMutation.mutate(
      {
        id: editingItem.id,
        data: {
          title: editTitle.trim(),
          description: editDesc.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setLocalItems((prev) =>
            prev.map((i) =>
              i.id === editingItem.id
                ? { ...i, title: editTitle.trim(), description: editDesc.trim() || undefined }
                : i
            )
          );
          setEditingItem(null);
        },
      }
    );
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || images.length === 0) return;

    createMutation.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: (newItem: unknown) => {
          const created = newItem as { id?: string; ID?: string };
          const itemId = created?.id || created?.ID || String(Date.now());

          images.forEach((imageUrl, position) => {
            addImageMutation.mutate({ id: itemId, data: { image_url: imageUrl, position } });
          });

          setLocalItems((prev) => [
            {
              id: itemId,
              title: title.trim(),
              description: description.trim() || undefined,
              imageUrl: images[0],
              likes: 0,
              isLiked: false,
            },
            ...prev,
          ]);

          resetUploadForm();
          setIsUploadOpen(false);
        },
      }
    );
  };

  return (
    <div>
      {/* Action Header for Owner */}
      {isOwner && (
        <div className="pb-3">
          <AccountTabHeader
            title="Tác phẩm trong Portfolio"
            count={localItems.length}
            description="Bộ sưu tập hình ảnh lookbook và phong cách làm việc của bạn trên Muse."
            action={{
              label: 'Thêm tác phẩm',
              onClick: () => setIsUploadOpen(true),
            }}
          />
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={isUploadOpen}
        onOpenChange={(open) => {
          setIsUploadOpen(open);
          if (!open) resetUploadForm();
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-1.5">
              <SparkleIcon className="size-4 text-primary" />
              Thêm tác phẩm vào Portfolio
            </ModalTitle>
            <ModalDescription>
              Tải lên ảnh layout makeup, bộ móng hoặc ảnh lookbook chất lượng cao.
            </ModalDescription>
          </ModalHeader>

          <form onSubmit={handleUpload} className="flex flex-col gap-3.5">
            <Field>
              <FieldLabel>Ảnh tác phẩm</FieldLabel>
              <ImageUpload value={images} onChange={setImages} max={6} tileAspect="square" />
            </Field>

            <Field>
              <FieldLabel>Tên tác phẩm / Layout</FieldLabel>
              <Input
                required
                placeholder="Ví dụ: Tone Thái nhẹ nhàng cô dâu hè 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Mô tả (không bắt buộc)</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Kỹ thuật, sản phẩm sử dụng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={createMutation.isPending || !title.trim() || images.length === 0}>
                {createMutation.isPending ? 'Đang lưu...' : 'Lưu tác phẩm'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-1.5">
              <PencilSimpleIcon className="size-4 text-primary" />
              Chỉnh sửa tác phẩm
            </ModalTitle>
          </ModalHeader>

          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3.5">
            <Field>
              <FieldLabel>Tên tác phẩm / Layout</FieldLabel>
              <Input required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Mô tả chi tiết</FieldLabel>
              <Textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Thêm mô tả về kỹ thuật, sản phẩm sử dụng..."
              />
            </Field>

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={updateMutation.isPending || !editTitle.trim()}>
                {updateMutation.isPending ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Items Grid — lưới kiểu Instagram: vuông, sát nhau, không bo góc (xem quy tắc ở globals.css) */}
      {localItems.length === 0 ? (
        <EmptyState
          title="Chưa có tác phẩm nào trong portfolio"
          description={
            isOwner
              ? 'Bộ sưu tập của bạn đang trống. Hãy thêm tác phẩm đầu tiên để khách hàng thấy được phong cách chuyên môn của bạn!'
              : 'Nghệ nhân chưa cập nhật bộ sưu tập tác phẩm.'
          }
          action={
            isOwner
              ? {
                  label: 'Thêm tác phẩm đầu tiên',
                  onClick: () => setIsUploadOpen(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {localItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square w-full overflow-hidden bg-muted"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 300px, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Owner Action Buttons */}
              {isOwner && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => openEdit(item, e)}
                    className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <PencilSimpleIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="flex size-7 items-center justify-center rounded-full bg-black/60 text-rose-400 backdrop-blur-md hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                    title="Xóa tác phẩm"
                  >
                    <TrashIcon className="size-3.5" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold truncate pr-2">{item.title}</span>
                <button
                  type="button"
                  onClick={() => handleLikeToggle(item)}
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

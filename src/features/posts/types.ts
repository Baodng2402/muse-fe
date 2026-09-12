export type PostType = 'tim-mau' | 'nhan-booking';

export const TYPE_LABEL: Record<PostType, string> = {
  'tim-mau': 'Tìm mẫu',
  'nhan-booking': 'Nhận booking',
};

export interface PostAuthor {
  id?: string;
  name: string;
  username?: string;
  /** Ảnh đại diện thật của tác giả (author_avatar từ backend) — không có thì dùng AvatarFallback. */
  avatarUrl?: string;
  level: 'Học viên' | 'Có kinh nghiệm' | 'Chuyên nghiệp' | string;
  /** Chưa có hệ thống review thật — chỉ set khi backend trả về, không bịa số. */
  rating?: number;
  reviewCount?: number;
}

export interface Post {
  id: string;
  type: PostType;
  /** ID/tên chuyên ngành thật từ backend (specialty_id/specialty_name) — không suy đoán từ tiêu đề. */
  specialtyId?: string;
  specialtyName?: string;
  title: string;
  /** Tên khu vực thật (region_name) để hiển thị. */
  area: string;
  /** ID khu vực thật (region_id) để lọc theo server. */
  regionId?: string;
  offer: string;
  date: string;
  description: string;
  timeSlot?: string;
  benefitTag?: string;
  benefitType?: 'free' | 'stipend' | 'subsidized' | 'discount';
  slotsTotal?: number;
  slotsAvailable?: number;
  requirements?: string;
  priceDisplay?: string;
  isUrgent?: boolean;
  isSaved?: boolean;
  /** Chỉ có khi backend trả về SĐT thật của tác giả — không bịa số mặc định. */
  phone?: string;
  imageUrl?: string;
  author: PostAuthor;
}

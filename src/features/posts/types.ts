import {
  CameraIcon,
  PaletteIcon,
  SprayBottleIcon,
} from '@phosphor-icons/react/dist/ssr';

export const CATEGORIES = [
  { id: 'makeup', label: 'Makeup', icon: PaletteIcon },
  { id: 'nail', label: 'Nail', icon: SprayBottleIcon },
  { id: 'photo', label: 'Nhiếp ảnh', icon: CameraIcon },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type PostType = 'tim-mau' | 'nhan-booking';

export const TYPE_LABEL: Record<PostType, string> = {
  'tim-mau': 'Tìm mẫu',
  'nhan-booking': 'Nhận booking',
};

export const CITIES = [
  { id: 'hcm', label: 'TP. Hồ Chí Minh' },
  { id: 'hanoi', label: 'Hà Nội' },
  { id: 'danang', label: 'Đà Nẵng' },
] as const;

export type CityId = (typeof CITIES)[number]['id'];

export interface PostAuthor {
  id?: string;
  name: string;
  avatarId?: string;
  level: 'Học viên' | 'Có kinh nghiệm' | 'Chuyên nghiệp' | string;
  rating: number;
  reviewCount: number;
}

export interface Post {
  id: string;
  type: PostType;
  category: CategoryId;
  title: string;
  area: string;
  city: CityId;
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
  timingCategory?: 'today' | 'weekend' | 'flexible';
  phone: string;
  imageId?: string;
  imageUrl?: string;
  author: PostAuthor;
}

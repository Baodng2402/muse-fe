import type { Post as ApiPost, PostDetailResponse } from '@/src/core/api/types';
import type { Post } from '../types';

export type UiPost = Post;

const DEFAULT_AVATARS = [
  'photo-1494790108377-be9c29b29330',
  'photo-1534528741775-53994a69daeb',
  'photo-1517841905240-472988babdf9',
  'photo-1507003211169-0a1dd7228f2d',
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643217427489-5a58ebbce99e?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop&q=80',
];

/**
 * Maps raw Go backend Post or PostDetailResponse to UI Post model safely.
 */
export function normalizePost(raw: ApiPost | PostDetailResponse, index = 0): UiPost {
  const post = 'post' in raw ? raw.post : raw;
  const images = 'images' in raw ? raw.images : undefined;

  const id = post.ID || post.id || `post-${index}`;
  const rawType = post.Type || post.type;
  const type = rawType === 'booking' ? 'nhan-booking' : 'tim-mau';

  // Category mapping based on specialty or title/description content
  const titleLower = (post.Title || post.title || '').toLowerCase();
  const descLower = (post.Description || post.description || '').toLowerCase();
  const specLower = (post.specialty_name || '').toLowerCase();
  const textContext = `${titleLower} ${descLower} ${specLower}`;

  const categoryId: 'makeup' | 'nail' | 'photo' =
    textContext.includes('nail') || textContext.includes('móng') || textContext.includes('mi')
      ? 'nail'
      : textContext.includes('ảnh') || textContext.includes('photo') || textContext.includes('chụp')
      ? 'photo'
      : 'makeup';

  const priceMin = post.PriceMin ?? post.price_min;
  const priceMax = post.PriceMax ?? post.price_max;
  const priceDisplay =
    priceMin !== undefined && priceMax !== undefined
      ? `${priceMin.toLocaleString('vi-VN')}đ – ${priceMax.toLocaleString('vi-VN')}đ`
      : priceMin !== undefined
      ? `Từ ${priceMin.toLocaleString('vi-VN')}đ`
      : 'Thỏa thuận';

  const slotsTotal = post.SlotsTotal ?? post.slots_total ?? 2;
  const slotsFilled = post.SlotsFilled ?? post.slots_filled ?? 0;
  const slotsAvailable = Math.max(0, slotsTotal - slotsFilled);

  const candidateImageUrl =
    images?.[0]?.ImageUrl ||
    images?.[0]?.image_url ||
    post.image_urls?.[0];

  const isPlaceholder =
    !candidateImageUrl ||
    candidateImageUrl.includes('example.com') ||
    candidateImageUrl.includes('placeholder.com') ||
    !candidateImageUrl.startsWith('http');

  const firstImageUrl = isPlaceholder
    ? DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
    : candidateImageUrl;

  const dateStr = post.CreatedAt || post.created_at;
  const dateFormatted = dateStr
    ? new Date(dateStr).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' })
    : 'Hôm nay';

  return {
    id,
    type,
    category: categoryId,
    title: post.Title || post.title || 'Tin tuyển mẫu',
    area: post.region_name || 'Hồ Chí Minh',
    city: 'hcm',
    offer: type === 'tim-mau' ? (priceMin === 0 ? 'FREE 100%' : 'Có phụ phí') : priceDisplay,
    date: dateFormatted,
    timeSlot: '09:00 - 12:00',
    description: post.Description || post.description || '',
    benefitTag: type === 'tim-mau' ? (priceMin === 0 ? 'FREE 100%' : 'HỖ TRỢ') : undefined,
    benefitType: priceMin === 0 ? 'free' : 'stipend',
    slotsTotal,
    slotsAvailable,
    priceDisplay,
    isUrgent: slotsAvailable > 0,
    timingCategory: 'flexible',
    phone: '0901234567',
    imageUrl: firstImageUrl,
    author: {
      name: post.author_name || 'Thợ Muse',
      avatarId: DEFAULT_AVATARS[index % DEFAULT_AVATARS.length],
      level:
        post.author_level === 'student'
          ? 'Học viên'
          : post.author_level === 'professional'
          ? 'Chuyên nghiệp'
          : 'Có kinh nghiệm',
      rating: 4.9,
      reviewCount: 12,
    },
  };
}

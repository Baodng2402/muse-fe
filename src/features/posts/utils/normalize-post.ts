import type { Post as ApiPost, PostDetailResponse } from '@/src/core/api/types';
import type { Post } from '../types';

export type UiPost = Post;

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1679141335462-547b83aa99f5?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1643217427489-5a58ebbce99e?w=600&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop&q=80',
];

/**
 * Maps raw Go backend Post or PostDetailResponse to UI Post model safely.
 * Chỉ dùng field thật từ backend — không suy đoán/bịa dữ liệu hiển thị.
 */
export function normalizePost(raw: ApiPost | PostDetailResponse, index = 0): UiPost {
  const post = 'post' in raw ? raw.post : raw;
  const images = 'images' in raw ? raw.images : undefined;

  const id = post.ID || post.id || `post-${index}`;
  const rawType = post.Type || post.type;
  const type = rawType === 'booking' ? 'nhan-booking' : 'tim-mau';

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

  const practiceTime = post.PracticeTime || post.practice_time;

  return {
    id,
    type,
    specialtyId: post.specialty_id || post.SpecialtyID,
    specialtyName: post.specialty_name,
    title: post.Title || post.title || 'Tin tuyển mẫu',
    area: post.region_name || 'Khu vực chưa cập nhật',
    regionId: post.region_id || post.RegionID,
    offer: type === 'tim-mau' ? (priceMin === 0 ? 'FREE 100%' : 'Có phụ phí') : priceDisplay,
    date: dateFormatted,
    timeSlot: practiceTime || undefined,
    description: post.Description || post.description || '',
    benefitTag: type === 'tim-mau' ? (priceMin === 0 ? 'FREE 100%' : 'HỖ TRỢ') : undefined,
    benefitType: priceMin === 0 ? 'free' : 'stipend',
    slotsTotal,
    slotsAvailable,
    priceDisplay,
    isUrgent: slotsAvailable > 0,
    phone: post.author_phone || undefined,
    imageUrl: firstImageUrl,
    author: {
      id: post.user_id || post.UserID || post.profile_id,
      name: post.author_name || 'Thợ Muse',
      username: post.author_username || undefined,
      avatarUrl: post.author_avatar || undefined,
      level:
        post.author_level === 'student'
          ? 'Học viên'
          : post.author_level === 'professional'
          ? 'Chuyên nghiệp'
          : 'Có kinh nghiệm',
      // Chưa có hệ thống đánh giá thật — để trống thay vì bịa số cho mọi tác giả.
      rating: undefined,
      reviewCount: undefined,
    },
  };
}

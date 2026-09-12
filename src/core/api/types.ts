/**
 * Standard API Response envelope matching Go backend pkg/response.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  error?: string;
  code?: string;
}

/**
 * Standard Pagination Metadata matching Go backend pkg/pagination.
 */
export interface PaginationMeta {
  page: number;
  page_size: number;
  total_records: number;
}

/**
 * Standard Paginated Response envelope matching Go backend pkg/pagination.
 */
export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;

export interface PaginationQueryParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

/**
 * User & Auth Domain Types
 */
export interface SpecialtyDTO {
  id: string;
  name: string;
  slug: string;
}

export interface UserDTO {
  id: string;
  email?: string;
  phone?: string;
  display_name: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  region_id?: string;
  level?: 'student' | 'experienced' | 'professional' | string;
  roles?: string[];
  tags?: string[];
  specialties?: SpecialtyDTO[];
  is_provider?: boolean;
  is_customer?: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  status?: string;
  created_at?: string;
  username?: string;
  rating?: number;
  review_count?: number;
}

export interface UpdateUserProfileDTO {
  display_name?: string;
  phone?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  region_id?: string;
  username?: string;
  roles?: string[];
  level?: string;
  tags?: string[];
  specialty_ids?: string[];
}

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  user: UserDTO;
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  display_name: string;
  password: string;
  email?: string;
  phone?: string;
  roles?: string[];
  is_provider?: boolean;
  is_customer?: boolean;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

/**
 * Region & Specialty Domain Types
 * Maps both Go sqlc serialization (PascalCase) and normalized client keys.
 */
export interface Region {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  slug?: string;
  Slug?: string;
  is_active?: boolean;
  IsActive?: boolean;
}

export interface Specialty {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  slug?: string;
  Slug?: string;
  is_active?: boolean;
  IsActive?: boolean;
}

/**
 * Post Domain Types
 */
export type PostType = 'find_model' | 'booking' | 'model_available';
export type PostStatus = 'draft' | 'published' | 'hidden' | 'closed' | 'expired';
export type UserLevel = 'student' | 'experienced' | 'professional';

export interface Post {
  id?: string;
  ID?: string;
  profile_id?: string;
  user_id?: string;
  UserID?: string;
  type?: PostType;
  Type?: PostType;
  title?: string;
  Title?: string;
  description?: string;
  Description?: string;
  region_id?: string;
  RegionID?: string;
  region_name?: string;
  status?: PostStatus;
  Status?: PostStatus;
  specialty_id?: string;
  SpecialtyID?: string;
  specialty_name?: string;
  author_name?: string;
  author_avatar?: string;
  author_level?: UserLevel;
  author_username?: string;
  author_phone?: string;
  image_urls?: string[];
  is_saved?: boolean;
  price_min?: number;
  PriceMin?: number;
  price_max?: number;
  PriceMax?: number;
  slots_total?: number;
  SlotsTotal?: number;
  slots_filled?: number;
  SlotsFilled?: number;
  practice_time?: string;
  PracticeTime?: string;
  discount_note?: string;
  DiscountNote?: string;
  requirements_text?: string;
  RequirementsText?: string;
  created_at?: string;
  CreatedAt?: string;
  updated_at?: string;
  UpdatedAt?: string;
}

export interface PostFilterParams extends PaginationQueryParams {
  type?: PostType;
  region_id?: string;
  specialty_id?: string;
  search?: string;
  user_id?: string;
  status?: PostStatus;
}

export interface PostImage {
  id?: string;
  ID?: string;
  post_id?: string;
  PostID?: string;
  image_url?: string;
  ImageUrl?: string;
  position?: number;
  Position?: number;
  created_at?: string;
  CreatedAt?: string;
}

export interface PostService {
  id?: string;
  ID?: string;
  post_id?: string;
  PostID?: string;
  service_name?: string;
  ServiceName?: string;
  price_from?: number;
  PriceFrom?: number;
  price_to?: number;
  PriceTo?: number;
  duration_minutes?: number;
  DurationMinutes?: number;
}

export interface PostDetailResponse {
  post: Post;
  images?: PostImage[];
  services?: PostService[];
}

export interface ServiceRequest {
  service_name: string;
  price_from?: number;
  price_to?: number;
  duration_minutes?: number;
}

export interface CreatePostDTO {
  type: PostType;
  title: string;
  description?: string;
  region_id: string;
  specialty_id?: string;
  status?: PostStatus;
  images?: { image_url: string; position?: number }[];
  image_urls?: string[];
  price_min?: number;
  price_max?: number;
  slots_total?: number;
  practice_time?: string;
  discount_note?: string;
  requirements_text?: string;
  availability?: Record<string, unknown>;
  services?: ServiceRequest[];
}

export interface UpdatePostDTO {
  title: string;
  description?: string;
  region_id?: string;
  specialty_id?: string;
  status?: PostStatus;
  practice_time?: string;
  discount_note?: string;
  requirements_text?: string;
  slots_total?: number;
  price_min?: number;
  price_max?: number;
  availability?: Record<string, unknown>;
  image_urls?: string[];
}

/**
 * Portfolio Domain Types
 */
export interface PortfolioImage {
  id: string;
  image_url: string;
  type: 'single' | 'before' | 'after';
  position: number;
}

export interface PortfolioItem {
  id: string;
  profile_id: string;
  specialty_id?: string;
  title: string;
  description?: string;
  like_count: number;
  is_liked?: boolean;
  images: PortfolioImage[];
  created_at: string;
}

export interface UpdatePortfolioDTO {
  title?: string;
  description?: string;
  specialty_id?: string;
  position?: number;
  layout?: 'single' | 'before_after' | 'grid' | string;
}

/**
 * Booking Domain Types
 */
export type BookingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  customer_user_id: string;
  provider_profile_id: string;
  scheduled_start_at: string;
  scheduled_end_at: string;
  status: BookingStatus;
  note?: string;
  provider_name?: string;
  provider_avatar?: string;
  provider_phone?: string;
  customer_name?: string;
  customer_avatar?: string;
  customer_phone?: string;
  service_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingCommand {
  customer_user_id: string;
  provider_profile_id: string;
  scheduled_start_at: string;
  scheduled_end_at: string;
  note?: string;
}

/**
 * Report Domain Types
 */
export type ReportTargetType = 'post' | 'user' | 'booking';
export type ReportStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed';

export interface Report {
  id: string;
  reporter_user_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  created_at: string;
}

export interface CreateReportDTO {
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  description?: string;
}

/**
 * Review Domain Types
 */
export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  created_at: string;
}

export interface CreateReviewCommand {
  rating: number;
  comment: string;
}


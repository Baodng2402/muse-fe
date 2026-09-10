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
export interface UserDTO {
  id: string;
  email?: string;
  phone?: string;
  display_name: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  region_id?: string;
  level?: string;
  is_provider: boolean;
  is_customer: boolean;
  is_admin: boolean;
  is_verified: boolean;
  status: string;
  created_at: string;
}

export interface UpdateUserProfileDTO {
  display_name?: string;
  phone?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  region_id?: string;
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
export type PostType = 'find_model' | 'booking';
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
}

export interface UpdatePostDTO {
  title?: string;
  description?: string;
  region_id?: string;
  specialty_id?: string;
  status?: PostStatus;
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

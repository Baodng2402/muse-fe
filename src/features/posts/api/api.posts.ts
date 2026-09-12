import { apiClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type {
  Post,
  PostDetailResponse,
  PaginatedData,
  PostFilterParams,
  CreatePostDTO,
  UpdatePostDTO,
} from '@/src/core/api/types';

export const postsApi = {
  /**
   * Fetches paginated posts with optional filters (type, region, specialty, search).
   */
  getPosts(params: PostFilterParams = {}): Promise<PaginatedData<Post>> {
    return apiClient.get<PaginatedData<Post>>(API_ENDPOINTS.posts.list, {
      params: params as Record<string, unknown>,
    });
  },

  /**
   * Fetches a single post by ID.
   */
  getPostById(id: string): Promise<PostDetailResponse> {
    return apiClient.get<PostDetailResponse>(API_ENDPOINTS.posts.detail(id));
  },

  /**
   * Creates a new post (requires authentication).
   */
  createPost(dto: CreatePostDTO): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.posts.create, dto);
  },

  /**
   * Updates an existing post (requires author authentication).
   */
  updatePost(id: string, dto: UpdatePostDTO): Promise<Post> {
    return apiClient.put<Post>(API_ENDPOINTS.posts.update(id), dto);
  },

  /**
   * Deletes a post (requires author authentication).
   */
  deletePost(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.posts.delete(id));
  },

  /**
   * Saves/bookmarks a post.
   */
  savePost(id: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.posts.save(id));
  },

  /**
   * Removes bookmark from a post.
   */
  unsavePost(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.posts.unsave(id));
  },

  /**
   * Lists current user's saved/bookmarked posts.
   */
  getSavedPosts(): Promise<Post[]> {
    return apiClient.get<Post[]>(API_ENDPOINTS.savedPosts.list);
  },

  /**
   * Fetches active regions.
   */
  getRegions(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.regions.list);
  },

  /**
   * Fetches active specialties.
   */
  getSpecialties(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.specialties.list);
  },
};

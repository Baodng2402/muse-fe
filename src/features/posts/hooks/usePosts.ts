import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { postKeys } from '../api/keys.posts';
import { postsApi } from '../api/api.posts';
import type { PostFilterParams, CreatePostDTO, UpdatePostDTO, Post } from '@/src/core/api/types';

/**
 * Hook to query paginated posts with filters.
 * Uses keepPreviousData for smooth transitions during filter or pagination changes.
 */
export function usePostsQuery(params: PostFilterParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.getPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to query a single post's details by ID.
 */
export function usePostDetailQuery(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPostById(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to query user's saved/bookmarked posts.
 */
export function useSavedPostsQuery() {
  return useQuery({
    queryKey: postKeys.saved(),
    queryFn: () => postsApi.getSavedPosts(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Mutation hook to create a post with automatic cache invalidation.
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePostDTO) => postsApi.createPost(dto),
    onSuccess: (newPost) => {
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      // Optimistically populate detail cache
      const postId =
        (newPost as any)?.post?.id ||
        (newPost as any)?.post?.ID ||
        newPost?.id ||
        newPost?.ID;
      if (postId) {
        queryClient.setQueryData(postKeys.detail(postId), newPost);
      }
    },
  });
}

/**
 * Mutation hook to update a post.
 */
export function useUpdatePostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdatePostDTO) => postsApi.updatePost(id, dto),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(postKeys.detail(id), updatedPost);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Mutation hook to delete a post.
 */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.saved() });
    },
  });
}

/**
 * Mutation hook to toggle bookmark on a post with optimistic UI update.
 */
export function useToggleSavePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isCurrentlySaved }: { postId: string; isCurrentlySaved: boolean }) => {
      if (isCurrentlySaved) {
        await postsApi.unsavePost(postId);
      } else {
        await postsApi.savePost(postId);
      }
    },
    onMutate: async ({ postId, isCurrentlySaved }) => {
      // Cancel outgoing queries for detail
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData<Post>(postKeys.detail(postId));

      // Optimistically update
      if (previousPost) {
        queryClient.setQueryData<Post>(postKeys.detail(postId), {
          ...previousPost,
          is_saved: !isCurrentlySaved,
        });
      }

      return { previousPost };
    },
    onError: (_err, { postId }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }
    },
    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.saved() });
    },
  });
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: postKeys.regions(),
    queryFn: () => postsApi.getRegions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecialtiesQuery() {
  return useQuery({
    queryKey: postKeys.specialties(),
    queryFn: () => postsApi.getSpecialties(),
    staleTime: 5 * 60 * 1000,
  });
}

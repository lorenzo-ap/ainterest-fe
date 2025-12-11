import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { createPost, deletePost, getPosts, getUserPosts, likePost } from '../api';
import { Post, PostGeneratedImage } from '../types';
import { STALE_TIME } from '../utils';

type PostsResponse = AxiosResponse<Post[]>;

type PostsOptions = Omit<UseSuspenseQueryOptions<PostsResponse, Error, Post[]>, 'queryKey' | 'queryFn'>;
type CreatePostOptions = Omit<UseMutationOptions<AxiosResponse<Post>, Error, PostGeneratedImage>, 'mutationFn'>;
type LikePostOptions = Omit<UseMutationOptions<AxiosResponse<Post>>, 'mutationFn'>;
type DeletePostOptions = Omit<UseMutationOptions, 'mutationFn'>;

export const postKeys = {
  posts: ['posts'] as const,
  userPosts: (userId: string) => ['posts', userId] as const
};

export const usePosts = (options?: PostsOptions) =>
  useSuspenseQuery({
    queryKey: postKeys.posts,
    queryFn: () => getPosts(),
    select: (res) => res.data,
    staleTime: STALE_TIME,
    ...options
  });

export const useUserPosts = (userId: string, options?: PostsOptions) =>
  useSuspenseQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => getUserPosts(userId),
    select: (res) => res.data,
    staleTime: STALE_TIME,
    ...options
  });

export const useCreatePost = (options?: CreatePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (generatedImage) => createPost(generatedImage),
    onSuccess: (...args) => {
      const [res] = args;
      const userId = res.data.user._id;

      queryClient.setQueryData<PostsResponse>(postKeys.posts, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [res.data, ...oldData.data]
        };
      });

      queryClient.setQueryData<PostsResponse>(postKeys.userPosts(userId), (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [res.data, ...oldData.data]
        };
      });

      options?.onSuccess?.(...args);
    }
  });
};

export const useLikePost = (postId: string, userId: string, options?: LikePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postKeys.posts });

      const previous = queryClient.getQueriesData<PostsResponse>({
        queryKey: postKeys.posts
      });

      queryClient.setQueriesData<PostsResponse>({ queryKey: postKeys.posts }, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((post) => {
            if (post._id === postId) {
              const newLikes = post.likes.includes(userId)
                ? post.likes.filter((like) => like !== userId)
                : [...post.likes, userId];
              return { ...post, likes: newLikes };
            }
            return post;
          })
        };
      });

      return { previous };
    },
    onError: (_error, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    }
  });
};

export const useDeletePost = (postId: string, options?: DeletePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => deletePost(postId),
    onSuccess: (...args) => {
      queryClient.setQueriesData<PostsResponse>(
        {
          queryKey: postKeys.posts
        },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((post) => post._id !== postId)
          };
        }
      );
      options?.onSuccess?.(...args);
    }
  });
};

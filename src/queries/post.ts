import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query';
import { createPost, deletePost, getPosts, getUserPosts, likePost } from '../api';
import { Post, PostGeneratedImage } from '../types';
import { STALE_TIME } from '../utils';

type PostsOptions = Omit<UseSuspenseQueryOptions<Post[], Error, Post[]>, 'queryKey' | 'queryFn'>;
type CreatePostOptions = Omit<UseMutationOptions<Post, Error, PostGeneratedImage>, 'mutationFn'>;
type LikePostOptions = Omit<UseMutationOptions<Post>, 'mutationFn'>;
type DeletePostOptions = Omit<UseMutationOptions, 'mutationFn'>;

export const postKeys = {
  posts: ['posts'] as const,
  userPosts: (userId: string) => ['posts', userId] as const
};

export const usePosts = (options?: PostsOptions) =>
  useSuspenseQuery({
    queryKey: postKeys.posts,
    queryFn: () => getPosts(),
    staleTime: STALE_TIME,
    ...options
  });

export const useUserPosts = (userId: string, options?: PostsOptions) =>
  useSuspenseQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => getUserPosts(userId),
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
      const userId = res.user._id;

      queryClient.setQueryData<Post[]>(postKeys.posts, (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return [res, ...oldPosts];
      });

      queryClient.setQueryData<Post[]>(postKeys.userPosts(userId), (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return [res, ...oldPosts];
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

      const previous = queryClient.getQueriesData<Post[]>({
        queryKey: postKeys.posts
      });

      queryClient.setQueriesData<Post[]>({ queryKey: postKeys.posts }, (oldPosts) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((post) => {
          if (post._id === postId) {
            const newLikes = post.likes.includes(userId)
              ? post.likes.filter((like) => like !== userId)
              : [...post.likes, userId];
            return { ...post, likes: newLikes };
          }
          return post;
        });
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
      queryClient.setQueriesData<Post[]>(
        {
          queryKey: postKeys.posts
        },
        (oldPosts) => {
          if (!oldPosts) return oldPosts;
          return oldPosts.filter((post) => post._id !== postId);
        }
      );
      options?.onSuccess?.(...args);
    }
  });
};

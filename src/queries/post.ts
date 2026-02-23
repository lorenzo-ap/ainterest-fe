import {
	type UseMutationOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery
} from '@tanstack/react-query';
import { createPost, deletePost, getPosts, getUserPosts, likePost } from '../api';
import type { PostGeneratedImage, PostModel } from '../types';
import { STALE_TIME } from '../utils';

type PostsOptions = Omit<UseSuspenseQueryOptions<PostModel[], Error, PostModel[]>, 'queryKey' | 'queryFn'>;
type CreatePostOptions = Omit<UseMutationOptions<PostModel, Error, PostGeneratedImage>, 'mutationFn'>;
type LikePostOptions = Omit<UseMutationOptions<PostModel>, 'mutationFn'>;
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
			const userId = res.user.id;

			queryClient.setQueryData<PostModel[]>(postKeys.posts, (oldPosts) => {
				if (!oldPosts) return oldPosts;
				return [res, ...oldPosts];
			});

			queryClient.setQueryData<PostModel[]>(postKeys.userPosts(userId), (oldPosts) => {
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

			const previous = queryClient.getQueriesData<PostModel[]>({
				queryKey: postKeys.posts
			});

			queryClient.setQueriesData<PostModel[]>({ queryKey: postKeys.posts }, (oldPosts) => {
				if (!oldPosts) return oldPosts;

				return oldPosts.map((post) => {
					if (post.id === postId) {
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
			if (!context?.previous) return;

			for (const [key, data] of context.previous) {
				queryClient.setQueryData(key, data);
			}
		}
	});
};

export const useDeletePost = (postId: string, options?: DeletePostOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: () => deletePost(postId),
		onSuccess: (...args) => {
			queryClient.setQueriesData<PostModel[]>(
				{
					queryKey: postKeys.posts
				},
				(oldPosts) => {
					if (!oldPosts) return oldPosts;
					return oldPosts.filter((post) => post.id !== postId);
				}
			);
			options?.onSuccess?.(...args);
		}
	});
};

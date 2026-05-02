import {
	type UseMutationOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery
} from '@tanstack/react-query';
import { createComment, getComments } from '../api';
import type { CommentModel, PostModel } from '../types';
import { STALE_TIME } from '../utils';
import { postKeys } from './post';

export const commentKeys = {
	all: ['comments'] as const,
	comments: (postId: string) => ['comments', postId] as const
};

type CommentsOptions = Omit<UseSuspenseQueryOptions<CommentModel[], Error, CommentModel[]>, 'queryKey' | 'queryFn'>;
type CreateCommentOptions = Omit<
	UseMutationOptions<CommentModel, Error, { postId: string; text: string }>,
	'mutationFn'
>;

export const useComments = (postId: string, options?: CommentsOptions) =>
	useSuspenseQuery({
		queryKey: commentKeys.comments(postId),
		queryFn: () => getComments(postId),
		staleTime: STALE_TIME,
		...options
	});

export const useCreateComment = (options?: CreateCommentOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: ({ postId, text }) => createComment(postId, text),
		onSuccess: (...args) => {
			const [res, { postId }] = args;

			queryClient.setQueryData<CommentModel[]>(commentKeys.comments(postId), (oldComments) => {
				if (!oldComments) return [res];
				return [...oldComments, res];
			});

			queryClient.setQueriesData<PostModel[]>({ queryKey: postKeys.posts }, (oldPosts) => {
				if (!oldPosts) return oldPosts;
				return oldPosts.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							commentsCount: (post.commentsCount || 0) + 1
						};
					}
					return post;
				});
			});

			options?.onSuccess?.(...args);
		}
	});
};

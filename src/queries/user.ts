import {
	type UseMutationOptions,
	type UseQueryOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery
} from '@tanstack/react-query';
import { getCurrentUser, getUserByUsername, updateCurrentUser } from '../api';
import type { UserModel } from '../types';
import { STALE_TIME } from '../utils';

type CurrentUserOptions = Omit<UseQueryOptions<UserModel, Error, UserModel>, 'queryKey' | 'queryFn'>;
type UpdateCurrentUserOptions = Omit<UseMutationOptions<UserModel, Error, UserModel>, 'mutationFn'>;
type UserByUsernameOptions = Omit<UseSuspenseQueryOptions<UserModel, Error, UserModel>, 'queryKey' | 'queryFn'>;

export const userKeys = {
	current: ['user', 'current'] as const,
	user: (username: string) => ['user', username] as const
};

export const useCurrentUser = (options?: CurrentUserOptions) =>
	useQuery({
		queryKey: userKeys.current,
		queryFn: () => getCurrentUser(),
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
		refetchOnWindowFocus: false,
		enabled: false,
		...options
	});

export const useUpdateCurrentUser = (options?: UpdateCurrentUserOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: (user) => updateCurrentUser(user),
		onSuccess: (...args) => {
			const [data] = args;
			queryClient.setQueryData(userKeys.current, data);
			options?.onSuccess?.(...args);
		}
	});
};

export const useUserByUsername = (username: string, options?: UserByUsernameOptions) =>
	useSuspenseQuery({
		queryKey: userKeys.user(username),
		queryFn: () => getUserByUsername(username),
		staleTime: STALE_TIME,
		...options
	});

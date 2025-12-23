import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query';
import { getCurrentUser, getUserByUsername, updateCurrentUser } from '../api';
import { User } from '../types';
import { STALE_TIME } from '../utils';

type CurrentUserOptions = Omit<UseQueryOptions<User, Error, User>, 'queryKey' | 'queryFn'>;
type UpdateCurrentUserOptions = Omit<UseMutationOptions<User, Error, User>, 'mutationFn'>;
type UserByUsernameOptions = Omit<UseSuspenseQueryOptions<User, Error, User>, 'queryKey' | 'queryFn'>;

export const userKeys = {
  current: ['user', 'current'] as const,
  user: (username: string) => ['user', username] as const
};

export const useCurrentUser = (options?: CurrentUserOptions) =>
  useQuery({
    queryKey: userKeys.current,
    queryFn: () => getCurrentUser(),
    staleTime: Infinity,
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

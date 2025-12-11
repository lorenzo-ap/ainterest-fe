import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getCurrentUser, getUserByUsername, updateCurrentUser } from '../api';
import { User } from '../types';
import { STALE_TIME } from '../utils';

type CurrentUserOptions = Omit<UseQueryOptions<AxiosResponse<User>, Error, User>, 'queryKey' | 'queryFn'>;
type UpdateCurrentUserOptions = Omit<UseMutationOptions<AxiosResponse<User>, Error, User>, 'mutationFn'>;
type UserByUsernameOptions = Omit<UseSuspenseQueryOptions<AxiosResponse<User>, Error, User>, 'queryKey' | 'queryFn'>;

export const userKeys = {
  current: ['user', 'current'] as const,
  user: (username: string) => ['user', username] as const
};

export const useCurrentUser = (options?: CurrentUserOptions) =>
  useQuery({
    queryKey: userKeys.current,
    queryFn: () => getCurrentUser(),
    select: (res) => res.data,
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
    select: (res) => res.data,
    staleTime: STALE_TIME,
    ...options
  });

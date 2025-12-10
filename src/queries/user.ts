import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getCurrentUser, getUserByUsername, updateCurrentUser } from '../api';
import { User } from '../types';
import { STALE_TIME } from '../utils';

type UseCurrentUserOptions = Omit<UseQueryOptions<AxiosResponse<User>, Error, User>, 'queryKey' | 'queryFn'>;
type UseUpdateCurrentUserOptions = Omit<UseMutationOptions<AxiosResponse<User>, Error, User>, 'mutationFn'>;
type UseUserByUsernameOptions = Omit<UseQueryOptions<AxiosResponse<User>, Error, User>, 'queryKey' | 'queryFn'>;

export const userKeys = {
  current: ['user', 'current'] as const,
  user: (username: string) => ['user', username] as const
};

export const useCurrentUser = (options?: UseCurrentUserOptions) =>
  useQuery({
    queryKey: userKeys.current,
    queryFn: () => getCurrentUser(),
    select: (res) => res.data,
    staleTime: Infinity,
    retry: false,
    enabled: false,
    ...options
  });

export const useUpdateCurrentUser = (options?: UseUpdateCurrentUserOptions) => {
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

export const useUserByUsername = (username: string, options?: UseUserByUsernameOptions) =>
  useQuery({
    queryKey: userKeys.user(username),
    queryFn: () => getUserByUsername(username),
    select: (res) => res.data,
    staleTime: STALE_TIME,
    ...options
  });

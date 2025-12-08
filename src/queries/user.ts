import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getCurrentUser, updateUser } from '../api';
import { User } from '../types';

export const userKeys = {
  all: ['users'] as const,
  current: ['users', 'current'] as const
};

export const useCurrentUser = (
  options?: Omit<UseQueryOptions<AxiosResponse<User>, Error, User>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: userKeys.current,
    queryFn: () => getCurrentUser(),
    select: (response) => response.data,
    staleTime: Infinity,
    retry: false,
    enabled: false,
    ...options
  });

export const useUpdateUser = (options?: UseMutationOptions<AxiosResponse<User>, Error, User>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (user) => updateUser(user),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

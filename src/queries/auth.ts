import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { signIn, signOut, signUp } from '../api';
import { SignInForm, SignUpForm, User } from '../types';
import { userKeys } from './user';

export const useSignIn = (options?: UseMutationOptions<AxiosResponse<User>, Error, SignInForm>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (body) => signIn(body),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

export const useSignUp = (options?: UseMutationOptions<AxiosResponse<User>, Error, SignUpForm>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (body) => signUp(body),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

export const useSignOut = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => signOut(),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(userKeys.current, { data: null });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

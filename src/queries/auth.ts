import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { signIn, signOut, signUp } from '../api';
import { SignInForm, SignUpForm, User } from '../types';
import { userKeys } from './user';

type UseSignInOptions = UseMutationOptions<AxiosResponse<User>, Error, SignInForm>;
type UseSignUpOptions = UseMutationOptions<AxiosResponse<User>, Error, SignUpForm>;

export const useSignIn = (options?: UseSignInOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (body) => signIn(body),
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(...args);
    }
  });
};

export const useSignUp = (options?: UseSignUpOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (body) => signUp(body),
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(...args);
    }
  });
};

export const useSignOut = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => signOut(),
    onSuccess: (...args) => {
      queryClient.setQueryData(userKeys.current, { data: null });
      options?.onSuccess?.(...args);
    }
  });
};

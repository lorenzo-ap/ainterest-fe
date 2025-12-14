import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { googleSignIn, signIn, signOut, signUp } from '../api';
import { SignInForm, SignUpForm, User } from '../types';
import { userKeys } from './user';

type SignInOptions = UseMutationOptions<AxiosResponse<User>, Error, SignInForm>;
type GoogleSignInOptions = UseMutationOptions<AxiosResponse<User>, Error, string>;
type SignUpOptions = UseMutationOptions<AxiosResponse<User>, Error, SignUpForm>;

export const useSignIn = (options?: SignInOptions) => {
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

export const useGoogleSignIn = (options?: GoogleSignInOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (credential) => googleSignIn(credential),
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.setQueryData(userKeys.current, data);
      options?.onSuccess?.(...args);
    }
  });
};

export const useSignUp = (options?: SignUpOptions) => {
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

import {
	type UseMutationOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery
} from '@tanstack/react-query';
import {
	getAuthenticationOptions,
	getRegistrationOptions,
	listPasskeys,
	revokePasskey,
	verifyAuthentication,
	verifyRegistration
} from '../api';
import type {
	AuthenticationOptionsResponse,
	AuthenticationVerifiedResponse,
	PasskeyCredential,
	RegistrationOptionsResponse,
	RegistrationVerifiedResponse
} from '../types/passkeys';
import { STALE_TIME } from '../utils';
import { postKeys } from './post';
import { userKeys } from './user';

export const passkeyKeys = {
	all: ['passkeys'] as const,
	passkeys: () => [...passkeyKeys.all, 'passkeys'] as const
};

export const usePasskeys = (
	options?: Omit<UseSuspenseQueryOptions<PasskeyCredential[], Error>, 'queryKey' | 'queryFn'>
) =>
	useSuspenseQuery({
		queryKey: passkeyKeys.passkeys(),
		queryFn: () => listPasskeys(),
		staleTime: STALE_TIME,
		...options
	});

export const useGetRegistrationOptions = (options?: UseMutationOptions<RegistrationOptionsResponse, Error, string>) =>
	useMutation({
		...options,
		mutationFn: (password) => getRegistrationOptions({ password })
	});

export const useVerifyRegistration = (
	options?: UseMutationOptions<RegistrationVerifiedResponse, Error, { name: string; credential: unknown }>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: ({ name, credential }) => verifyRegistration({ name, credential }),
		onSuccess: (...args) => {
			const [data] = args;
			queryClient.setQueryData<PasskeyCredential[]>(passkeyKeys.passkeys(), (oldPasskeys) => {
				if (!oldPasskeys) return [data.passkey];
				return [...oldPasskeys, data.passkey];
			});
			options?.onSuccess?.(...args);
		}
	});
};

export const useGetAuthenticationOptions = (
	options?: UseMutationOptions<AuthenticationOptionsResponse, Error, string>
) =>
	useMutation({
		...options,
		mutationFn: (email) => getAuthenticationOptions({ email })
	});

export const useVerifyAuthentication = (
	options?: UseMutationOptions<AuthenticationVerifiedResponse, Error, { email: string; credential: unknown }>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: ({ email, credential }) => verifyAuthentication({ email, credential }),
		onSuccess: (...args) => {
			const [data] = args;
			queryClient.setQueryData(userKeys.current, data);
			queryClient.invalidateQueries({ queryKey: postKeys.posts });
			options?.onSuccess?.(...args);
		}
	});
};

export const useRevokePasskey = (options?: UseMutationOptions<void, Error, string>) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: (credentialId) => revokePasskey(credentialId),
		onSuccess: (...args) => {
			const [, credentialId] = args;
			queryClient.setQueryData<PasskeyCredential[]>(passkeyKeys.passkeys(), (oldPasskeys) => {
				if (!oldPasskeys) return oldPasskeys;
				return oldPasskeys.filter((pk) => pk.credentialId !== credentialId);
			});
			options?.onSuccess?.(...args);
		}
	});
};

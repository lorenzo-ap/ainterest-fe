import {
	type UseMutationOptions,
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery
} from '@tanstack/react-query';
import {
	getAuthenticationOptions,
	getPasskeys,
	getRegistrationOptions,
	revokePasskey,
	verifyAuthentication,
	verifyRegistration
} from '../api';
import type {
	AuthenticationOptionsRequest,
	AuthenticationOptionsResponse,
	AuthenticationVerifiedResponse,
	AuthenticationVerifyRequest,
	PasskeyCredential,
	RegistrationOptionsRequest,
	RegistrationOptionsResponse,
	RegistrationVerifiedResponse,
	RegistrationVerifyRequest
} from '../types/passkeys';
import { postKeys } from './post';
import { userKeys } from './user';

type PasskeysQueryOptions = Omit<UseSuspenseQueryOptions<PasskeyCredential[]>, 'queryKey' | 'queryFn'>;
type RegistrationOptionsMutationOptions = Omit<
	UseMutationOptions<RegistrationOptionsResponse, Error, RegistrationOptionsRequest>,
	'mutationFn'
>;
type VerifyRegistrationMutationOptions = Omit<
	UseMutationOptions<RegistrationVerifiedResponse, Error, RegistrationVerifyRequest>,
	'mutationFn'
>;
type GetAuthenticationOptionsMutationOptions = Omit<
	UseMutationOptions<AuthenticationOptionsResponse, Error, AuthenticationOptionsRequest>,
	'mutationFn'
>;
type VerifyAuthenticationMutationOptions = Omit<
	UseMutationOptions<AuthenticationVerifiedResponse, Error, AuthenticationVerifyRequest>,
	'mutationFn'
>;
type RevokePasskeyMutationOptions = Omit<UseMutationOptions, 'mutationFn'>;

export const passkeyKeys = {
	passkeys: ['passkeys'] as const
};

export const usePasskeys = (options?: PasskeysQueryOptions) =>
	useSuspenseQuery({
		queryKey: passkeyKeys.passkeys,
		queryFn: () => getPasskeys(),
		staleTime: Number.POSITIVE_INFINITY,
		...options
	});

export const useRegistrationOptions = (options?: RegistrationOptionsMutationOptions) =>
	useMutation({
		...options,
		mutationFn: (body) => getRegistrationOptions(body)
	});

export const useVerifyRegistration = (options?: VerifyRegistrationMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: (body) => verifyRegistration(body),
		onSuccess: (...args) => {
			const [data] = args;
			queryClient.setQueryData<PasskeyCredential[]>(passkeyKeys.passkeys, (oldPasskeys) => {
				if (!oldPasskeys) return [data.passkey];
				return [...oldPasskeys, data.passkey];
			});
			options?.onSuccess?.(...args);
		}
	});
};

export const useGetAuthenticationOptions = (options?: GetAuthenticationOptionsMutationOptions) =>
	useMutation({
		...options,
		mutationFn: (body) => getAuthenticationOptions(body)
	});

export const useVerifyAuthentication = (options?: VerifyAuthenticationMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: (body) => verifyAuthentication(body),
		onSuccess: (...args) => {
			const [data] = args;
			queryClient.setQueryData(userKeys.current, data);
			queryClient.invalidateQueries({ queryKey: postKeys.posts });
			options?.onSuccess?.(...args);
		}
	});
};

export const useRevokePasskey = (credentialId: string, options?: RevokePasskeyMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: () => revokePasskey(credentialId),
		onSuccess: (...args) => {
			queryClient.setQueryData<PasskeyCredential[]>(passkeyKeys.passkeys, (oldPasskeys) => {
				if (!oldPasskeys) return oldPasskeys;
				return oldPasskeys.filter((pk) => pk.credentialId !== credentialId);
			});
			options?.onSuccess?.(...args);
		}
	});
};

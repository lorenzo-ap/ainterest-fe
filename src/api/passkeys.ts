import { apis } from '../assets/apis/apis';
import type {
	AuthenticationOptionsResponse,
	AuthenticationVerifiedResponse,
	PasskeyCredential,
	RegistrationOptionsResponse,
	RegistrationVerifiedResponse
} from '../types/passkeys';
import { req } from './axios';

export const getRegistrationOptions = async (body: { password: string }) => {
	const res = await req.post<RegistrationOptionsResponse>(`v1/${apis.auth}/passkeys/registration/options`, body);
	return res.data;
};

export const verifyRegistration = async (body: { name: string; credential: unknown }) => {
	const res = await req.post<RegistrationVerifiedResponse>(`v1/${apis.auth}/passkeys/registration/verify`, body);
	return res.data;
};

export const getAuthenticationOptions = async (body: { email: string }) => {
	const res = await req.post<AuthenticationOptionsResponse>(`v1/${apis.auth}/passkeys/authentication/options`, body, {
		skipErrorToast: true
	});
	return res.data;
};

export const verifyAuthentication = async (body: { email: string; credential: unknown }) => {
	const res = await req.post<AuthenticationVerifiedResponse>(`v1/${apis.auth}/passkeys/authentication/verify`, body);
	return res.data;
};

export const listPasskeys = async () => {
	const res = await req.get<PasskeyCredential[]>(`v1/${apis.auth}/passkeys`);
	return res.data;
};

export const revokePasskey = async (credentialId: string) => {
	const res = await req.delete(`v1/${apis.auth}/passkeys/${credentialId}`);
	return res.data;
};

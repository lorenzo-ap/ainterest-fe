import { apis } from '../assets/apis/apis';
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
import { req } from './axios';

export const getRegistrationOptions = async (body: RegistrationOptionsRequest) => {
	const res = await req.post<RegistrationOptionsResponse>(`v1/${apis.auth}/passkeys/registration/options`, body);
	return res.data;
};

export const verifyRegistration = async (body: RegistrationVerifyRequest) => {
	const res = await req.post<RegistrationVerifiedResponse>(`v1/${apis.auth}/passkeys/registration/verify`, body);
	return res.data;
};

export const getAuthenticationOptions = async (body: AuthenticationOptionsRequest) => {
	const res = await req.post<AuthenticationOptionsResponse>(`v1/${apis.auth}/passkeys/authentication/options`, body, {
		skipErrorToast: true
	});
	return res.data;
};

export const verifyAuthentication = async (body: AuthenticationVerifyRequest) => {
	const res = await req.post<AuthenticationVerifiedResponse>(`v1/${apis.auth}/passkeys/authentication/verify`, body);
	return res.data;
};

export const getPasskeys = async () => {
	const res = await req.get<PasskeyCredential[]>(`v1/${apis.auth}/passkeys`);
	return res.data;
};

export const revokePasskey = async (credentialId: string) => {
	const res = await req.delete(`v1/${apis.auth}/passkeys/${credentialId}`);
	return res.data;
};

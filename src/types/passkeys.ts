import type {
	AuthenticationResponseJSON,
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialRequestOptionsJSON,
	RegistrationResponseJSON
} from '@simplewebauthn/browser';
import type { UserModel } from './user';

export interface PasskeyCredential {
	credentialId: string;
	name: string;
	createdAt: string;
	lastUsedAt: string | null;
	transports: string[];
	backedUp: boolean;
}

export type AddPasskeyForm = {
	passkeyName: string;
	password: string;
};

export type RegistrationOptionsResponse = PublicKeyCredentialCreationOptionsJSON;

export interface RegistrationOptionsRequest {
	password: string;
}

export type AuthenticationOptionsResponse = PublicKeyCredentialRequestOptionsJSON;

export interface AuthenticationOptionsRequest {
	email: string;
}

export type RegistrationVerifiedResponse = UserModel & { passkey: PasskeyCredential };

export interface RegistrationVerifyRequest {
	name: string;
	credential: RegistrationResponseJSON;
}

export type AuthenticationVerifiedResponse = UserModel & { passkey: PasskeyCredential };

export interface AuthenticationVerifyRequest {
	email: string;
	credential: AuthenticationResponseJSON;
}

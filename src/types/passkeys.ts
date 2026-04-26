import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialRequestOptionsJSON
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

export type RegistrationOptionsResponse = PublicKeyCredentialCreationOptionsJSON;

export type AuthenticationOptionsResponse = PublicKeyCredentialRequestOptionsJSON;

export type RegistrationVerifiedResponse = UserModel & { passkey: PasskeyCredential };

export type AuthenticationVerifiedResponse = UserModel & { passkey: PasskeyCredential };

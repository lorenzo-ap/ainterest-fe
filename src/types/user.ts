export interface UserModel {
	id: string;
	username: string;
	email: string;
	photo?: string;
	role: UserRole;
	accessToken: string;
}

export const UserRole = {
	ADMIN: 'admin',
	USER: 'user'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const PASSWORD_REQUIREMENTS = [
	{ re: /.{8}/, key: 'minLength' },
	{ re: /[A-Z]/, key: 'uppercase' },
	{ re: /[a-z]/, key: 'lowercase' },
	{ re: /[0-9]/, key: 'number' },
	{ re: /[!@#$%^&*]/, key: 'special' }
] as const;

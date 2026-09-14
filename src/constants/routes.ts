/** Every path in the product, in one place. */
export const routes = {
	explore: '/',
	create: '/create',
	profile: (username: string) => `/u/${username}`,
	resetPassword: (token: string) => `/reset-password/${token}`
} as const;

/** Paths the product used to answer on — kept so old links and emails still land. */
export const legacyRoutes = {
	create: '/generate-image',
	profile: '/account/:username'
} as const;

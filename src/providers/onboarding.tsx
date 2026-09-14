import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ainterest:onboarded';

type OnboardingContextValue = {
	opened: boolean;
	open: () => void;
	close: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/**
 * Shows the three-step explainer once, on a visitor's first run, and keeps it
 * available afterwards from the account menu.
 */
export const OnboardingProvider = ({ children }: PropsWithChildren) => {
	const [opened, setOpened] = useState(false);

	useEffect(() => {
		// first run only, and only over the gallery — never on top of a task
		if (localStorage.getItem(STORAGE_KEY) || window.location.pathname !== '/') return;

		// let the gallery paint first — the explainer lands on top of real work
		const timer = setTimeout(() => setOpened(true), 800);
		return () => clearTimeout(timer);
	}, []);

	const close = useCallback(() => {
		localStorage.setItem(STORAGE_KEY, '1');
		setOpened(false);
	}, []);

	const value = useMemo(() => ({ opened, open: () => setOpened(true), close }), [opened, close]);

	return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
	const context = useContext(OnboardingContext);

	if (!context) {
		throw new Error('useOnboarding must be used within an OnboardingProvider');
	}

	return context;
};

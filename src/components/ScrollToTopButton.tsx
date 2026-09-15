import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpIcon } from './ui';

export const ScrollToTopButton = () => {
	const { t } = useTranslation();

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => setIsVisible(window.scrollY > 600);

		toggleVisibility();
		window.addEventListener('scroll', toggleVisibility, { passive: true });
		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	return (
		<button
			aria-hidden={!isVisible}
			aria-label={t('components.scroll_to_top_button.title')}
			className={`fixed right-4 bottom-[calc(var(--tabbar-total)+1rem)] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-pop transition-all duration-300 hover:text-ink md:bottom-6 md:h-10 md:w-10 ${
				isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
			}`}
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			tabIndex={isVisible ? 0 : -1}
			type='button'
		>
			<ArrowUpIcon size={17} />
		</button>
	);
};

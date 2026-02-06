import { ActionIcon, Tooltip } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ScrollToTopButton = () => {
	const { t } = useTranslation();

	const [isVisible, setIsVisible] = useState(false);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener('scroll', toggleVisibility);
		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	return (
		<div className='fixed bottom-4 left-4 z-50'>
			<div
				className={`transition-all duration-300 ease-in-out ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
				}`}
			>
				<Tooltip label={t('components.scroll_to_top_button.title')} position='left' withArrow>
					<ActionIcon
						aria-label={t('components.scroll_to_top_button.title')}
						className='shadow-lg transition-shadow hover:shadow-xl'
						color='violet'
						onClick={scrollToTop}
						radius='md'
						size={42}
					>
						<IconArrowUp size={18} />
					</ActionIcon>
				</Tooltip>
			</div>
		</div>
	);
};

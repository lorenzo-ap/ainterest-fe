import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const ErrorPage = () => {
	const { t } = useTranslation();

	return (
		<div className='mx-auto flex min-h-[calc(100dvh-var(--header-h))] max-w-page flex-col items-center justify-center px-5 py-20 text-center'>
			<p className='eyebrow'>404</p>

			<h1 className='mt-6 font-display text-display-md text-ink'>
				{t('pages.error.title_lead')} <em className='text-brand italic'>{t('pages.error.title_accent')}</em>
			</h1>

			<p className='mt-5 max-w-sm text-[15px] text-ink-3 leading-relaxed'>{t('pages.error.description')}</p>

			<Link
				className='mt-9 inline-flex h-11 items-center rounded-full bg-brand px-6 font-medium text-[15px] text-white transition-opacity duration-200 hover:opacity-90'
				to='/'
			>
				{t('pages.error.back_to_explore')}
			</Link>
		</div>
	);
};

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../constants';
import { useAuthModals } from '../../../providers';
import { useCurrentUser } from '../../../queries';

/**
 * The pitch, for people who haven't signed in yet. Once you have an account
 * this is a tool, not a landing page — the gallery starts at the top instead.
 */
export const Hero = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { data: currentUser } = useCurrentUser();
	const { openSignIn } = useAuthModals();

	if (currentUser) return null;

	const startCreating = () => {
		if (!currentUser) {
			openSignIn();
			return;
		}

		navigate(routes.create);
	};

	return (
		<section className='mx-auto w-full max-w-gallery px-5 pt-9 pb-9 sm:px-8 sm:pt-16 sm:pb-12'>
			<h1 className='max-w-4xl animate-rise font-display text-display-lg text-ink'>
				{t('pages.home.headline_lead')} <em className='text-brand italic'>{t('pages.home.headline_accent')}</em>
			</h1>

			<div className='mt-8 flex animate-rise flex-wrap items-center gap-x-5 gap-y-3' style={{ animationDelay: '80ms' }}>
				<button
					className='h-12 rounded-full bg-brand px-7 font-medium text-[15px] text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]'
					onClick={startCreating}
					type='button'
				>
					{t('pages.home.start_creating')}
				</button>

				<p className='text-[15px] text-ink-3'>{t('pages.home.subheadline')}</p>
			</div>
		</section>
	);
};

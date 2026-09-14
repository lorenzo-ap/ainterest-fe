import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppButton, Spinner } from '../../components/ui';
import { useAuthModals } from '../../providers';
import { useCurrentUser } from '../../queries';

export const ProtectedRoute = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { openSignIn } = useAuthModals();
	const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

	if (isCurrentUserLoading) {
		return (
			<div className='flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center'>
				<Spinner className='text-brand' size={22} />
			</div>
		);
	}

	if (!currentUser) {
		return (
			<div className='mx-auto flex min-h-[calc(100dvh-var(--header-h))] max-w-page flex-col items-center justify-center px-5 py-20 text-center'>
				<h1 className='max-w-lg font-display text-display-sm text-ink'>
					{t('pages.components.protected_route.title')}
				</h1>

				<p className='mt-5 max-w-sm text-[15px] text-ink-3 leading-relaxed'>
					{t('pages.components.protected_route.description')}
				</p>

				<div className='mt-9 flex flex-wrap items-center justify-center gap-2.5'>
					<AppButton onClick={openSignIn}>{t('common.sign_in')}</AppButton>
					<AppButton onClick={() => navigate('/')} variant='outline'>
						{t('pages.components.protected_route.go_to_home')}
					</AppButton>
				</div>
			</div>
		);
	}

	return <Outlet />;
};

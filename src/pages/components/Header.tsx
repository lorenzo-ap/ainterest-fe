import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../../components/ui';
import { routes } from '../../constants';
import { useAuthModals } from '../../providers';
import { useCurrentUser } from '../../queries';
import { Notifications } from './notifications';
import { UserMenu } from './UserMenu';

type NavLinkProps = {
	to: string;
	label: string;
	active: boolean;
	icon?: ReactNode;
};

const NavLink = ({ to, label, active, icon }: NavLinkProps) => (
	<Link
		className={`relative flex items-center gap-1.5 py-2 font-medium text-[15px] transition-colors duration-150 ${
			active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
		}`}
		to={to}
	>
		{icon}
		{label}
		<span
			className={`absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-brand transition-opacity duration-200 ${
				active ? 'opacity-100' : 'opacity-0'
			}`}
		/>
	</Link>
);

export const Header = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const { openSignIn } = useAuthModals();

	const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const lang = localStorage.getItem('lang');
		localStorage.setItem('lang', lang || 'en');
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 right-0 left-0 z-40 h-[var(--header-total)] border-b pt-[env(safe-area-inset-top,0px)] transition-colors duration-300 ${
				scrolled ? 'frost-strong border-line' : 'frost border-transparent'
			}`}
		>
			<div className='mx-auto flex h-header max-w-gallery items-center gap-4 px-5 sm:px-8'>
				<Logo />

				<nav className='ml-8 hidden items-center gap-7 md:flex'>
					<NavLink active={pathname === '/'} label={t('nav.explore')} to='/' />
					<NavLink active={pathname === routes.create} label={t('nav.create')} to={routes.create} />
				</nav>

				<div className='ml-auto flex items-center gap-1'>
					{currentUser ? (
						<Notifications />
					) : (
						<button
							className='h-9 rounded-full bg-ink px-4 font-medium text-[14px] text-bg transition-opacity duration-150 hover:opacity-85 disabled:opacity-50'
							disabled={isCurrentUserLoading}
							onClick={openSignIn}
							type='button'
						>
							{t('common.sign_in')}
						</button>
					)}

					<UserMenu onSignIn={openSignIn} />
				</div>
			</div>
		</header>
	);
};

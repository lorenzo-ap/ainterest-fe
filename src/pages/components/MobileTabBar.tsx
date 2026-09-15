import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { GridIcon, PlusIcon, UserIcon } from '../../components/ui';
import { routes } from '../../constants';
import { useAuthModals } from '../../providers';
import { useCurrentUser } from '../../queries';

type TabProps = {
	label: string;
	icon: ReactNode;
	active: boolean;
	to?: string;
	onClick?: () => void;
};

const Tab = ({ label, icon, active, to, onClick }: TabProps) => {
	const className = `flex h-full w-20 flex-col items-center justify-center gap-1 text-[10px] tracking-wide transition-colors duration-150 ${
		active ? 'text-ink' : 'text-ink-3'
	}`;

	const content = (
		<>
			{icon}
			<span>{label}</span>
		</>
	);

	if (to) {
		return (
			<Link className={className} to={to}>
				{content}
			</Link>
		);
	}

	return (
		<button className={className} onClick={onClick} type='button'>
			{content}
		</button>
	);
};

/**
 * Mobile navigation. Not a shrunken desktop header — a real tab bar with
 * creation as the accented centre action.
 */
export const MobileTabBar = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const { openSignIn } = useAuthModals();

	const { data: currentUser } = useCurrentUser();

	const isProfile = pathname.startsWith('/u/');
	const isCreate = pathname === routes.create;

	// The height carries the home-indicator inset too — with a bare `h-tabbar` the
	// padding eats into the row instead of sitting below it.
	return (
		<nav className='frost-strong fixed right-0 bottom-0 left-0 z-40 h-[var(--tabbar-total)] border-line border-t pb-[env(safe-area-inset-bottom,0px)] md:hidden'>
			<div className='flex h-tabbar items-center justify-around px-2'>
				<Tab active={pathname === '/'} icon={<GridIcon size={21} />} label={t('nav.explore')} to='/' />

				<Link
					aria-label={t('nav.create')}
					className={`-mt-1 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
						isCreate ? 'bg-brand text-white' : 'bg-brand-tint-strong text-brand active:scale-95'
					}`}
					to={routes.create}
				>
					<PlusIcon size={22} />
				</Link>

				{currentUser ? (
					<Tab
						active={isProfile}
						icon={<UserIcon size={21} />}
						label={t('nav.profile')}
						to={routes.profile(currentUser.username)}
					/>
				) : (
					<Tab active={false} icon={<UserIcon size={21} />} label={t('common.sign_in')} onClick={openSignIn} />
				)}
			</div>
		</nav>
	);
};

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser, useUserByUsername, useUserPosts } from '../../../queries';
import { UserRole } from '../../../types';
import { UserAvatar } from './UserAvatar';

export const ProfileHeaderSkeleton = () => (
	<header className='mx-auto max-w-gallery px-5 pt-7 pb-6 sm:px-8 sm:pt-12 sm:pb-8'>
		<div className='flex items-center gap-4 sm:gap-5'>
			<div className='h-[72px] w-[72px] rounded-full bg-inset sm:h-24 sm:w-24' />
			<div className='space-y-3'>
				<div className='h-8 w-40 rounded-md bg-inset sm:w-48' />
				<div className='h-3 w-32 rounded-md bg-inset sm:w-40' />
			</div>
		</div>
	</header>
);

type ProfileHeaderProps = {
	username: string;
};

/** Identity, a line of numbers, then the work. Nothing else. */
export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
	const { t } = useTranslation();

	const { data: currentUser } = useCurrentUser();
	const { data: user } = useUserByUsername(username);
	const { data: posts } = useUserPosts(user.id);

	const isCurrentUser = currentUser?.username === username;
	const appreciations = posts.reduce((total, post) => total + post.likesCount, 0);

	useEffect(() => {
		document.title = `${username} · AInterest`;
	}, [username]);

	return (
		<header className='mx-auto max-w-gallery px-5 pt-7 pb-6 sm:px-8 sm:pt-12 sm:pb-8'>
			<div className='flex items-center gap-4 sm:gap-5'>
				<UserAvatar isCurrentUser={isCurrentUser} user={user} />

				<div className='min-w-0'>
					<div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
						<h1 className='break-all font-display text-3xl text-ink sm:text-5xl'>{user.username}</h1>

						{user.role === UserRole.ADMIN && (
							<span className='rounded-full bg-brand-tint-strong px-2.5 py-1 font-mono text-[10px] text-brand uppercase tracking-widest'>
								Admin
							</span>
						)}
					</div>

					<p className='mt-2.5 font-mono text-[11px] text-ink-3 tracking-wide'>
						{t('pages.user_profile.stats.creations', { count: posts.length })}
						<span className='mx-2 opacity-50'>·</span>
						{t('pages.user_profile.stats.appreciations', { count: appreciations })}
					</p>
				</div>
			</div>
		</header>
	);
};

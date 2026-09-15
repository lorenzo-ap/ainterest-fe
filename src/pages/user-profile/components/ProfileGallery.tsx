import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DiscoveryBar, Gallery } from '../../../components';
import { routes } from '../../../constants';
import { usePostsFiltering } from '../../../hooks';
import { useCurrentUser, useUserByUsername, useUserPosts } from '../../../queries';

type ProfileGalleryProps = {
	username: string;
};

export const ProfileGallery = ({ username }: ProfileGalleryProps) => {
	const { t } = useTranslation();

	const { data: currentUser } = useCurrentUser();
	const { data: user } = useUserByUsername(username);
	const { data: userPosts } = useUserPosts(user.id);

	const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
		usePostsFiltering(userPosts);

	const isCurrentUser = currentUser?.username === username;

	return (
		<section className='mx-auto max-w-gallery px-5 pb-24 sm:px-8'>
			{!!userPosts.length && (
				<div className='frost-strong sticky top-[var(--header-total)] z-30 -mx-5 border-line border-b px-5 py-4 sm:-mx-8 sm:px-8'>
					<DiscoveryBar
						count={filteredPosts.length}
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onResetFilters={resetFilters}
						onResetSearch={resetSearch}
						onSearchChange={handleSearchChange}
						placeholder={t('pages.components.search_posts_input.enter_prompt')}
						searchText={searchText}
					/>
				</div>
			)}

			<div className='pt-6'>
				<Gallery
					emptyAction={
						isCurrentUser && !searchText ? (
							<Link
								className='inline-flex h-11 items-center rounded-full bg-brand px-5 font-medium text-[14px] text-white transition-opacity hover:opacity-90'
								to={routes.create}
							>
								{t('pages.user_profile.generate_image')}
							</Link>
						) : undefined
					}
					emptyHint={
						searchText
							? t('components.render_posts.no_posts_hint')
							: t(isCurrentUser ? 'pages.user_profile.empty_hint_self' : 'pages.user_profile.empty_hint')
					}
					emptyTitle={searchText ? t('components.render_posts.no_posts_found') : t('pages.user_profile.empty_title')}
					posts={filteredPosts}
				/>
			</div>
		</section>
	);
};

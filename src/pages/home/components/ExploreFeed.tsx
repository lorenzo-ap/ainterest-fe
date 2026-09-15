import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DiscoveryBar, Gallery } from '../../../components';
import { routes } from '../../../constants';
import { usePostsFiltering } from '../../../hooks';
import { useAuthModals } from '../../../providers';
import { commentKeys, postKeys, useCurrentUser, usePosts } from '../../../queries';
import { Hero } from './Hero';

export const ExploreFeed = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: posts } = usePosts();
	const { data: currentUser } = useCurrentUser();
	const { openSignIn } = useAuthModals();

	const { mutate: refreshPosts, isPending: isRefreshing } = useMutation({
		mutationFn: () =>
			queryClient.refetchQueries({
				queryKey: postKeys.posts,
				type: 'active'
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: commentKeys.all
			});
		}
	});

	const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
		usePostsFiltering(posts, { searchByUsername: true });

	const startCreating = () => {
		if (!currentUser) {
			openSignIn();
			return;
		}

		navigate(routes.create);
	};

	return (
		<>
			<Hero />

			<section className='mx-auto max-w-gallery px-5 pb-24 sm:px-8' id='feed'>
				<div className='frost-strong sticky top-[var(--header-total)] z-30 -mx-5 border-line border-b px-5 py-4 sm:-mx-8 sm:px-8'>
					<DiscoveryBar
						count={filteredPosts.length}
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onRefresh={refreshPosts}
						onResetFilters={resetFilters}
						onResetSearch={resetSearch}
						onSearchChange={handleSearchChange}
						placeholder={t('pages.components.search_posts_input.enter_prompt_or_username')}
						refreshing={isRefreshing}
						searchText={searchText}
					/>
				</div>

				{searchText && (
					<p className='pt-6 text-[15px] text-ink-3'>
						{t('components.render_posts.showing_results_for')} <span className='text-ink'>“{searchText}”</span>
					</p>
				)}

				<div className='pt-6'>
					<Gallery
						emptyAction={
							searchText ? (
								<button
									className='h-11 rounded-full border border-line px-5 font-medium text-[14px] text-ink-2 transition-colors hover:bg-hover hover:text-ink'
									onClick={resetSearch}
									type='button'
								>
									{t('components.render_posts.clear_search')}
								</button>
							) : (
								<button
									className='h-11 rounded-full bg-brand px-5 font-medium text-[14px] text-white transition-opacity hover:opacity-90'
									onClick={startCreating}
									type='button'
								>
									{t('pages.home.start_creating')}
								</button>
							)
						}
						emptyHint={searchText ? t('components.render_posts.no_posts_hint') : t('pages.home.empty_hint')}
						emptyTitle={searchText ? t('components.render_posts.no_posts_found') : t('pages.home.empty_title')}
						loading={isRefreshing}
						posts={filteredPosts}
					/>
				</div>
			</section>
		</>
	);
};

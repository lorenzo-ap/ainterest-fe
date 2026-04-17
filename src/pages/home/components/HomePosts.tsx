import { ActionIcon, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Filters, RenderPosts } from '../../../components';
import { usePostsFiltering } from '../../../hooks';
import { postKeys, usePosts } from '../../../queries';
import { SearchPostsInput } from '../../components';

export const HomePosts = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data: posts } = usePosts();

	const { mutate: refreshPosts, isPending: isManualRefreshPending } = useMutation({
		mutationFn: () =>
			queryClient.refetchQueries({
				queryKey: postKeys.posts,
				type: 'active'
			})
	});

	const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
		usePostsFiltering(posts, { searchByUsername: true });

	return (
		<>
			{!!posts.length && (
				<div className='mt-8 flex items-end gap-x-2'>
					<SearchPostsInput
						handleSearchChange={handleSearchChange}
						loading={isManualRefreshPending}
						placeholder={t('pages.components.search_posts_input.enter_prompt_or_username')}
						resetSearch={resetSearch}
						searchText={searchText}
					/>

					<Tooltip label={t('pages.home.refresh_posts')} withArrow>
						<ActionIcon
							aria-label={t('pages.home.refresh_posts')}
							color='violet'
							loading={isManualRefreshPending}
							onClick={() => {
								refreshPosts();
							}}
							radius='md'
							size={42}
						>
							<IconRefresh size={20} />
						</ActionIcon>
					</Tooltip>

					<Filters
						disabled={isManualRefreshPending}
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onReset={resetFilters}
					/>
				</div>
			)}

			<RenderPosts loading={isManualRefreshPending} posts={filteredPosts} searchText={searchText} />
		</>
	);
};

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Filters, RenderPosts } from '../../../components';
import { usePostsFiltering } from '../../../hooks';
import { usePosts } from '../../../queries';
import { SearchPostsInput } from '../../components';

export const HomePosts = () => {
	const { t } = useTranslation();

	const { data: posts, isFetching, refetch } = usePosts();

	const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
		usePostsFiltering(posts, { searchByUsername: true });

	return (
		<>
			{!!posts.length && (
				<div className='mt-8 flex items-end gap-x-2'>
					<SearchPostsInput
						handleSearchChange={handleSearchChange}
						loading={isFetching}
						placeholder={t('pages.components.search_posts_input.enter_prompt_or_username')}
						resetSearch={resetSearch}
						searchText={searchText}
					/>

					<Tooltip label={t('pages.home.refresh_posts')} withArrow>
						<ActionIcon
							aria-label={t('pages.home.refresh_posts')}
							color='violet'
							loading={isFetching}
							onClick={() => {
								refetch();
							}}
							radius='md'
							size={42}
						>
							<IconRefresh size={20} />
						</ActionIcon>
					</Tooltip>

					<Filters
						disabled={isFetching}
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onReset={resetFilters}
					/>
				</div>
			)}

			<RenderPosts loading={isFetching} posts={filteredPosts} searchText={searchText} />
		</>
	);
};

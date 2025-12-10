import { ActionIcon, Skeleton, Text, Title, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Filters, RenderPosts, ScrollToTopButton } from '../../components';
import { usePostsFiltering } from '../../hooks';
import { usePosts } from '../../queries';
import { SearchPostsInput } from '../components';

export const HomePage = () => {
  const { t } = useTranslation();

  const { data: posts, isLoading, isFetching, refetch } = usePosts();

  const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
    usePostsFiltering(posts, { searchByUsername: true });

  return (
    <>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-5 md:flex-row'>
          <div>
            <Title order={1}>{t('pages.home.heading')}</Title>

            <Text className='mt-2 opacity-60'>{t('pages.home.subheading')}</Text>
          </div>
        </div>

        {isLoading ? (
          <Skeleton radius='md' height={42} className='mt-14' />
        ) : (
          !!posts?.length && (
            <div className='mt-8 flex items-end gap-x-2'>
              <SearchPostsInput
                placeholder={t('pages.components.search_posts_input.enter_prompt_or_username')}
                loading={isFetching}
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                resetSearch={resetSearch}
              />

              <Tooltip label={t('pages.home.refresh_posts')} withArrow>
                <ActionIcon
                  size={42}
                  color='violet'
                  radius='md'
                  onClick={() => {
                    resetSearch();
                    refetch();
                  }}
                  loading={isFetching}
                  aria-label={t('pages.home.refresh_posts')}
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
          )
        )}

        <RenderPosts posts={filteredPosts} searchText={searchText} loading={isFetching} />
      </div>

      <ScrollToTopButton />
    </>
  );
};

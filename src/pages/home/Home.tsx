import { ActionIcon, Skeleton, Text, Title, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Filters, RenderPosts, ScrollToTopButton } from '../../components';
import { useFetchPosts, useSearchPosts } from '../../hooks';
import { selectPosts, selectPostsFilters, selectSearchedPosts, selectSearchText } from '../../redux/selectors';
import { resetPostsFilters, resetPostsSearch, setPosts, setPostsFilters, setPostsSearchText } from '../../redux/slices';
import { SearchPostsInput } from '../components';

export const HomePage = () => {
  const { t } = useTranslation();

  const posts = useSelector(selectPosts);

  const { fetchPosts, loading, firstLoad } = useFetchPosts();
  const { searchText, searchedPosts, handleSearchChange, resetSearchedPosts } = useSearchPosts(
    selectSearchText,
    selectSearchedPosts,
    setPostsSearchText,
    resetPostsSearch
  );

  return (
    <>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-5 md:flex-row'>
          <div>
            <Title order={1}>{t('pages.home.heading')}</Title>

            <Text className='mt-2 opacity-60'>{t('pages.home.subheading')}</Text>
          </div>
        </div>

        {firstLoad && loading ? (
          <Skeleton radius='md' height={42} className='mt-14' />
        ) : (
          !!posts.length && (
            <div className='mt-8 flex items-end gap-x-2'>
              <SearchPostsInput
                placeholder={t('pages.components.search_posts_input.enter_prompt_or_username')}
                loading={loading}
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                resetSearch={resetSearchedPosts}
              />

              <Tooltip label={t('pages.home.refresh_posts')} withArrow>
                <ActionIcon
                  size={42}
                  color='violet'
                  radius='md'
                  onClick={() => {
                    resetSearchedPosts();
                    fetchPosts();
                  }}
                  loading={loading}
                  aria-label={t('pages.home.refresh_posts')}
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>

              <Filters
                postsSelector={selectPosts}
                setPosts={setPosts}
                filtersStateSelector={selectPostsFilters}
                setFiltersState={setPostsFilters}
                resetFilters={resetPostsFilters}
              />
            </div>
          )
        )}

        <RenderPosts posts={searchText ? searchedPosts : posts} searchText={searchText} loading={loading} />
      </div>

      <ScrollToTopButton />
    </>
  );
};

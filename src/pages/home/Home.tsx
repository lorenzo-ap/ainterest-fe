import { ActionIcon, CloseButton, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RenderCards, ScrollToTopButton, Sort } from '../../components';
import { useFetchPosts, useSearchPosts } from '../../hooks';
import { setPosts } from '../../redux/slices';
import { RootState } from '../../redux/store';

export const HomePage = () => {
  const posts = useSelector((state: RootState) => state.posts.allPosts);

  const { fetchPosts, loading } = useFetchPosts();
  const { searchText, searchedPosts, handleSearchChange, resetSearch } = useSearchPosts(posts, true);

  return (
    <section className='mx-auto max-w-7xl'>
      <div className='flex flex-col items-start justify-between gap-5 md:flex-row'>
        <div>
          <Title order={1}>The Community Showcase</Title>

          <Text className='mt-2 max-w-[500px] opacity-60'>
            Browse through a collection of imaginative and visually stunning images generated by AI
          </Text>
        </div>
      </div>

      {!!posts.length && (
        <div className='mt-8 flex items-end gap-x-2'>
          <TextInput
            flex={1}
            size='md'
            radius='md'
            label='Search posts'
            placeholder='Enter prompt or username'
            disabled={loading}
            value={searchText}
            onChange={handleSearchChange}
            rightSection={
              searchText && (
                <Tooltip withArrow label='Clear'>
                  <CloseButton onClick={resetSearch} />
                </Tooltip>
              )
            }
          />

          <Tooltip label='Refresh posts' withArrow>
            <ActionIcon
              size={42}
              color='violet'
              radius='md'
              onClick={fetchPosts}
              loading={loading}
              aria-label='Refresh'
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>

          <Sort posts={posts} setPosts={setPosts} />
        </div>
      )}

      <div className='mt-3'>
        {searchText && (
          <Title className='mb-3 font-medium' order={2} size={'h3'}>
            <span className='opacity-60'>Showing results for</span> <span className='opacity-100'>{searchText}</span>
          </Title>
        )}

        <RenderCards title='No posts found' posts={searchText ? searchedPosts : posts} loading={loading} />
      </div>

      <ScrollToTopButton />
    </section>
  );
};

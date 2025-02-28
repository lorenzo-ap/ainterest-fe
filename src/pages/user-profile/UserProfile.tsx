import { Button, CloseButton, Skeleton, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from '../../api';
import { RenderCards, ScrollToTopButton } from '../../components';
import { useSearchPosts } from '../../hooks';
import { setUserPosts } from '../../redux/slices';
import { RootState, store } from '../../redux/store';
import { User } from '../../types';
import { UserProfileAvatar } from './components/UserProfileAvatar';

export const UserProfilePage = () => {
  const params = useParams();
  const [stateUser, setStateUser] = useState<User | null>(null);
  const loggedInUser = useSelector((state: RootState) => state.user);
  const userPosts = useSelector((state: RootState) => state.posts.userPosts.posts);
  const { searchText, searchedPosts, handleSearchChange, resetSearch } = useSearchPosts(userPosts);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setUserLoading(true);

    getUserByUsername(params.username || '')
      .then((res) => {
        const stateUser = res.data;
        setStateUser(stateUser);
        document.title = stateUser.username;
        setIsCurrentUser(loggedInUser?._id === stateUser._id);

        setPostsLoading(true);
        getUserPosts(stateUser._id)
          .then((res) => {
            store.dispatch(setUserPosts(res.data));
          })
          .finally(() => setPostsLoading(false));
      })
      .finally(() => setUserLoading(false));
  }, [loggedInUser, params.username]);

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
          <div className='flex items-center gap-x-3'>
            {userLoading ? (
              <Skeleton height={80} circle />
            ) : (
              <UserProfileAvatar user={loggedInUser} stateUser={stateUser} isCurrentUser={isCurrentUser} />
            )}

            {userLoading ? (
              <div className='space-y-2'>
                <Skeleton height={24} width={150} radius='sm' />
                <Skeleton height={16} width={200} radius='sm' />
              </div>
            ) : (
              <div>
                <Title>{stateUser?.username}</Title>
                {isCurrentUser && <Text opacity={0.5}>{loggedInUser?.email}</Text>}
              </div>
            )}
          </div>

          {isCurrentUser && (
            <div className='flex gap-x-3'>
              <Button
                className='transition-opacity duration-75 hover:opacity-90'
                component={Link}
                to='/generate-image'
                variant='gradient'
                gradient={{ from: 'violet', to: 'blue', deg: 90 }}
                size='lg'
                rightSection={<IconArrowRight size={20} />}
                leftSection={<IconPhotoAi size={20} />}
              >
                Generate image
              </Button>
            </div>
          )}
        </div>

        {postsLoading ? (
          <Skeleton radius='md' height={42} className='mt-10 md:mt-16' />
        ) : (
          !!userPosts.length && (
            <TextInput
              className='mt-4 md:mt-8'
              flex={1}
              size='md'
              radius='md'
              label='Search posts'
              placeholder='Enter prompt'
              disabled={postsLoading || !userPosts.length}
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
          )
        )}

        <div className='mt-3'>
          {searchText && (
            <Title className='mb-3 font-medium' order={2} size={'h3'}>
              <span className='opacity-60'>Showing results for</span> <span className='opacity-100'>{searchText}</span>
            </Title>
          )}

          <RenderCards title='No posts found' posts={searchText ? searchedPosts : userPosts} loading={postsLoading} />
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
};

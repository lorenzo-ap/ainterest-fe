import { Badge, Button, Skeleton, Text, Title } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Filters, RenderPosts, ScrollToTopButton } from '../../components';
import { usePostsFiltering } from '../../hooks';
import { useCurrentUser, useUserByUsername, useUserPosts } from '../../queries';
import { UserRole } from '../../types';
import { SearchPostsInput } from '../components';
import { UserProfileAvatar } from './components/UserProfileAvatar';

export const UserProfilePage = () => {
  const { t } = useTranslation();
  const params = useParams<{ username: string }>();

  const { data: currentUser } = useCurrentUser();
  const { data: user, isLoading: userLoading, isSuccess } = useUserByUsername(params.username || '', {});
  const { data: userPosts, isLoading: postsLoading } = useUserPosts(user?._id || '', {
    enabled: isSuccess
  });

  const isCurrentUser = currentUser?._id === user?._id;

  const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
    usePostsFiltering(userPosts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isSuccess && user) {
      document.title = user.username;
    }
  }, [isSuccess, user]);

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
          <div className='flex items-center gap-x-3'>
            {userLoading ? (
              <Skeleton height={82} circle />
            ) : (
              <UserProfileAvatar user={user} isCurrentUser={isCurrentUser} />
            )}

            {userLoading ? (
              <div className='space-y-2'>
                <Skeleton height={24} width={150} radius='sm' />
                <Skeleton height={16} width={200} radius='sm' />
              </div>
            ) : (
              <div>
                <div className='flex items-center gap-2'>
                  <Title>{user?.username}</Title>

                  {user?.role === UserRole.ADMIN && (
                    <Badge color='violet' variant='light' size='md' radius='xl' className='font-semibold uppercase'>
                      Admin
                    </Badge>
                  )}
                </div>

                <Text opacity={0.5}>{user?.email}</Text>
              </div>
            )}
          </div>

          {isCurrentUser && (
            <div className='flex gap-x-3 max-md:w-full'>
              <Button
                className='transition-opacity duration-75 hover:opacity-90 max-md:w-full'
                component={Link}
                to='/generate-image'
                variant='gradient'
                gradient={{ from: 'violet', to: 'blue', deg: 90 }}
                size='lg'
                rightSection={<IconArrowRight size={20} />}
                leftSection={<IconPhotoAi size={20} />}
              >
                {t('pages.user_profile.generate_image')}
              </Button>
            </div>
          )}
        </div>

        {!isSuccess || postsLoading ? (
          <Skeleton radius='md' height={42} className='mt-11 md:mt-14' />
        ) : (
          !!userPosts?.length && (
            <div className='mt-4 flex items-end gap-x-2 md:mt-7'>
              <SearchPostsInput
                placeholder={t('pages.components.search_posts_input.enter_prompt')}
                loading={postsLoading}
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                resetSearch={resetSearch}
              />

              <Filters filters={filters} onFiltersChange={handleFiltersChange} onReset={resetFilters} />
            </div>
          )
        )}

        <RenderPosts posts={filteredPosts} searchText={searchText} loading={!isSuccess || postsLoading} />
      </div>

      <ScrollToTopButton />
    </>
  );
};

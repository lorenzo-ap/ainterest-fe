import { Button, CloseButton, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { postService } from '../../services/post';
import { Post } from '../../types/post.interface';
import RenderCards from '../Home/components/RenderCards';

const ProfilePage = () => {
  const location = useLocation();
  const stateUser = location.state;

  const [searchText, setSearchText] = useState<string>('');
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);

  const user = useSelector((state: RootState) => state.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsCurrentUser(user?._id === stateUser._id);

    setLoading(true);

    postService
      .getUserPosts(stateUser._id || user?._id)
      .then((res) => setPosts(res.data.reverse()))
      .finally(() => setLoading(false));
  }, [user, stateUser._id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value.trim()) {
      setSearchText('');
      return;
    }

    setSearchText(value);

    const searchResults = posts.filter((post) => post.prompt.toLowerCase().includes(value.trim().toLowerCase()));

    setSearchedPosts(searchResults);
  };

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-start justify-between gap-y-4'>
          <div className='flex items-center gap-x-3'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-700 object-cover text-3xl font-bold text-white'>
              {stateUser?.username[0].toUpperCase()}
            </div>

            <div>
              <Title className='mb-1'>@{stateUser.username}</Title>
              {isCurrentUser && <Text>{user?.email}</Text>}
            </div>
          </div>

          {isCurrentUser && (
            <div className='flex gap-x-3'>
              <Button
                component={Link}
                to='/generate-image'
                color='violet'
                size='lg'
                rightSection={<IconArrowRight size={20} />}
                leftSection={<IconPhotoAi size={20} />}
              >
                Generate image
              </Button>
            </div>
          )}
        </div>

        <TextInput
          className='m5-4 md:mt-8'
          flex={1}
          size='md'
          radius='md'
          label='Search posts'
          placeholder='Enter prompt'
          disabled={loading}
          value={searchText}
          onChange={handleSearchChange}
          rightSection={
            searchText && (
              <Tooltip withArrow label='Clear'>
                <CloseButton onClick={() => setSearchText('')} />
              </Tooltip>
            )
          }
        />

        <div className='mt-3'>
          {searchText && (
            <Title className='mb-3 font-medium' order={2} size={'h3'}>
              <span className='opacity-60'>Showing results for</span> <span className='opacity-100'>{searchText}</span>
            </Title>
          )}

          <div className='grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
            {searchText ? (
              <RenderCards posts={searchedPosts} title='No search results found' isLoading={loading} />
            ) : (
              <RenderCards posts={posts} title='No posts found' isLoading={loading} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

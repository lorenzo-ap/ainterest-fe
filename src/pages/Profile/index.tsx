import { ActionIcon, Button, CheckIcon, CloseButton, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconArrowRight, IconPhotoAi, IconPhotoPlus, IconX } from '@tabler/icons-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { postService } from '../../services/post';
import { userService } from '../../services/user';
import { Post } from '../../types/post.interface';
import RenderCards from '../Home/components/RenderCards';

const ProfilePage = () => {
  const location = useLocation();
  const stateUser = location.state;

  const user = useSelector((state: RootState) => state.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [previewUploadedPhoto, SetPreviewUploadedPhoto] = useState<string | undefined>('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    setUserPhoto(selectedFile);
    SetPreviewUploadedPhoto(objectUrl);
  };

  const editUser = () => {
    if (!userPhoto) return;

    setImageLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(userPhoto);

    reader.onload = () => {
      const base64String = reader.result?.toString().replace('data:', '').replace(/^.+,/, '');

      userService
        .editUser({
          ...stateUser,
          photo: base64String
        })
        .then(() => {
          setUserPhoto(null);
          SetPreviewUploadedPhoto('');

          postService.getPosts();
        })
        .finally(() => {
          setImageLoading(false);
        });
    };
  };

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-y-4'>
          <div className='flex items-center gap-x-3'>
            <div className='group relative rounded-full'>
              <input id='uploadImage' className='hidden' type='file' onChange={handleFileChange} accept='image/*' />

              <label
                className='relative flex h-20 w-20 cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full bg-green-700 object-cover text-4xl font-bold text-white'
                htmlFor='uploadImage'
                style={{ pointerEvents: isCurrentUser ? 'auto' : 'none' }}
              >
                {stateUser?.photo || userPhoto ? (
                  <img
                    className='rounded-full'
                    src={previewUploadedPhoto || (isCurrentUser ? user?.photo : stateUser?.photo)}
                  />
                ) : (
                  stateUser?.username[0].toUpperCase()
                )}

                {!userPhoto && isCurrentUser && (
                  <div className='pointer-events-none absolute -bottom-20 left-1/2 flex h-full w-full -translate-x-1/2 items-start justify-center rounded-full bg-black bg-opacity-50 pt-1.5 transition-all group-hover:-bottom-12'>
                    <IconPhotoPlus size={16} />
                  </div>
                )}
              </label>

              {userPhoto && (
                <div>
                  <Tooltip withArrow label='Remove image'>
                    <ActionIcon
                      className='absolute bottom-0 left-0 rounded-full'
                      variant='default'
                      size={20}
                      type='button'
                      onClick={() => {
                        setUserPhoto(null);
                        SetPreviewUploadedPhoto('');
                      }}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip withArrow label='Save image'>
                    <ActionIcon
                      className='absolute bottom-0 right-0 rounded-full'
                      variant='default'
                      size={20}
                      type='button'
                      loading={imageLoading}
                      onClick={editUser}
                    >
                      <CheckIcon size={10} />
                    </ActionIcon>
                  </Tooltip>
                </div>
              )}
            </div>

            <div>
              <Title className='mb-1'>@{stateUser.username}</Title>
              {isCurrentUser && <Text>{user?.email}</Text>}
            </div>
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

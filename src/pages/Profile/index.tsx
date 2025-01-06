import { ActionIcon, Text, Title, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { setUser } from '../../redux/slices/userSlice';
import { RootState, store } from '../../redux/store';
import { postService } from '../../services/post';
import { toastService } from '../../services/toast';
import { Post } from '../../types/post.interface';
import RenderCards from '../Home/components/RenderCards';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateUser = location.state;

  const [signOutConfirmModalOpened, { open: openSignOutConfirmModal, close: closeSignOutConfirmModal }] =
    useDisclosure(false);

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
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [user, stateUser._id]);

  const signOut = () => {
    closeSignOutConfirmModal();

    localStorage.removeItem('jwt-token');
    store.dispatch(setUser(null));

    navigate('/');
    toastService.success('Signed out successfully');
  };

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-5 flex items-start justify-between'>
          <div>
            <Title className='mb-1'>@{stateUser.username}</Title>
            {isCurrentUser && <Text>{user?.email}</Text>}
          </div>

          {isCurrentUser && (
            <Tooltip withArrow label='Sign Out'>
              <ActionIcon
                variant='light'
                radius={'md'}
                size={36}
                color='red'
                onClick={openSignOutConfirmModal}
                aria-label='Sign Out'
              >
                <IconLogout2 size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>

        <div className='grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
          <RenderCards posts={posts} title='No posts found' isLoading={loading} />
        </div>
      </div>

      <ConfirmModal
        title='Sign Out'
        message='Are you sure you want to sign out?'
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};

export default ProfilePage;

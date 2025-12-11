import { Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostsSkeleton, ScrollToTopButton } from '../../components';
import { UserHeader, UserHeaderSkeleton } from './components/UserHeader';
import { UserPosts } from './components/UserPosts';

export const UserProfilePage = () => {
  const params = useParams<{ username: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!params.username) {
    navigate('/');
    return;
  }

  return (
    <>
      <div className='relative mx-auto max-w-7xl'>
        <Suspense fallback={<UserHeaderSkeleton />}>
          <UserHeader username={params.username} />
        </Suspense>

        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts username={params.username} />
        </Suspense>
      </div>

      <ScrollToTopButton />
    </>
  );
};

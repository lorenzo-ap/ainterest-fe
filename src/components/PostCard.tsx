import { ActionIcon, Avatar, Loader, Text, Tooltip } from '@mantine/core';
import {
  IconCircleXFilled,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconPhotoDown,
  IconTrash
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../redux';
import { postService } from '../services/posts';
import { toastService } from '../services/toast';
import { Post } from '../types';
import { downloadImage } from '../utils';

export const PostCard = ({ _id, prompt, photo, createdAt, user, likes }: Post) => {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user);

  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    setUsername(location.pathname.split('/').reverse()[0]);
  }, [location.pathname]);

  const deletePost = (postId: string) => {
    setDeletePostLoading(true);

    postService.deleteUserPost(postId).finally(() => {
      setDeletePostLoading(false);
      toastService.success('Post deleted successfully!');
    });
  };

  return (
    <div className='border-color card group relative aspect-square overflow-y-hidden rounded-xl border shadow-card'>
      <div className='relative h-full w-full'>
        {loading && (
          <div className='absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-black/15'>
            <Loader color='white' size='xl' />
          </div>
        )}

        {!loading && (
          <div
            className={`${showInfo ? 'opacity-100' : 'md:group-hover:opacity-100'} absolute inset-0 z-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-700`}
          />
        )}

        <img
          className={`h-auto w-full rounded-xl object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          src={photo}
          alt={prompt}
          onLoad={() => {
            setLoading(false);
          }}
        />
      </div>

      {!loading && (
        <>
          <button
            className='absolute right-3 top-3 z-10 md:hidden'
            type='button'
            onClick={() => {
              setShowInfo((prev) => !prev);
            }}
          >
            {showInfo ? (
              <IconCircleXFilled className='text-slate-300' size={40} />
            ) : (
              <IconInfoCircle className='text-slate-300' size={40} />
            )}
          </button>

          <div
            className={`absolute flex max-h-[75%] flex-col md:-bottom-full md:group-hover:bottom-0 ${showInfo ? '-bottom-0' : '-bottom-full'} left-0 right-0 m-2 rounded-md bg-[#10131F] p-4 transition-all duration-500`}
          >
            <div className='flex flex-col items-start justify-between gap-y-1.5'>
              <div className='flex items-center justify-between self-stretch'>
                <Text className='text-xs text-slate-300'>
                  {new Date(createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false
                  })}
                </Text>

                <div className='flex gap-1'>
                  <Tooltip label='Download image' withArrow>
                    <ActionIcon
                      variant='transparent'
                      p={0}
                      size={18}
                      onClick={() => {
                        downloadImage(_id, photo);
                      }}
                    >
                      <IconPhotoDown className='text-slate-400' size={18} />
                    </ActionIcon>
                  </Tooltip>

                  {user._id === currentUser?._id && (
                    <Tooltip label='Delete image' withArrow>
                      <ActionIcon
                        variant='transparent'
                        p={0}
                        size={18}
                        loading={deletePostLoading}
                        loaderProps={{ color: 'white' }}
                        onClick={() => {
                          deletePost(_id);
                        }}
                      >
                        <IconTrash className='text-red-400' size={18} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </div>
              </div>

              <Text className='prompt max-h-[100px] overflow-y-scroll pr-0.5 text-white max-lg:text-sm'>{prompt}</Text>
            </div>

            <div className='mt-2.5 flex items-center justify-between'>
              <Link
                className='flex items-center gap-x-1.5 hover:opacity-85'
                to={`/account/${user.username}`}
                state={user}
                style={{ pointerEvents: username === user.username ? 'none' : 'auto' }}
              >
                <Avatar key={user.username} src={user.photo} name={user.username} color='initials' size={30}>
                  {user.username[0].toUpperCase()}
                </Avatar>
                <Text className='text-sm text-white'>{user.username}</Text>
              </Link>

              <div className='flex items-center gap-x-2'>
                <div className='flex items-center gap-x-1'>
                  <button
                    type='button'
                    disabled={!currentUser}
                    onClick={() => {
                      postService.reactToPost(_id, currentUser?._id || '');
                    }}
                  >
                    <Tooltip label={likes.includes(currentUser?._id) ? 'Remove like' : 'Like'} withArrow>
                      {likes.includes(currentUser?._id) ? (
                        <IconHeartFilled className='text-slate-300' size={24} color='firebrick' />
                      ) : (
                        <IconHeart className='text-slate-300' size={24} />
                      )}
                    </Tooltip>
                  </button>

                  {likes.length > 0 && <Text className='text-sm text-white'>{likes.length}</Text>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

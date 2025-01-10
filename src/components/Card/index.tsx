import { ActionIcon, Avatar, Text, Tooltip } from '@mantine/core';
import { IconCircleXFilled, IconHeart, IconHeartFilled, IconInfoCircle, IconPhotoDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { postService } from '../../services/post';
import { Post } from '../../types/post.interface';
import { downloadImage } from '../../utils';

const Card = ({ _id, prompt, photo, createdAt, user, likes }: Post) => {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user);

  const [showInfo, setShowInfo] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    setUsername(location.pathname.split('/').reverse()[0]);
  }, [location.pathname]);

  return (
    <div className='card group relative overflow-y-hidden rounded-xl shadow-card'>
      <div
        className={`absolute left-0 top-0 h-full w-full ${showInfo ? 'bg-slate-800/[.5]' : 'bg-transparent'} transition-colors duration-500 md:group-hover:bg-slate-800/[.5]`}
      />

      <img className='h-auto w-full rounded-xl object-cover' src={photo} alt={prompt} />

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
          </div>
          <Text className='text-md prompt max-h-[100px] overflow-y-scroll pr-0.5 text-white'>{prompt}</Text>
        </div>

        <div className='mt-3 flex items-center justify-between gap-2'>
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
                  postService.likePost(_id);
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
    </div>
  );
};

export default Card;

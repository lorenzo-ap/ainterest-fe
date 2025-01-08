import { Text, Tooltip } from '@mantine/core';
import { IconDownload, IconInfoSquareRounded, IconSquareRoundedXFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Post } from '../../types/post.interface';
import { downloadImage } from '../../utils';

const Card = ({ _id, prompt, photo, createdAt, user }: Post) => {
  const [showInfo, setShowInfo] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user);

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
          <IconSquareRoundedXFilled className='text-slate-300' size={40} />
        ) : (
          <IconInfoSquareRounded className='text-slate-300' size={40} />
        )}
      </button>

      <div
        className={`absolute flex max-h-[75%] flex-col md:-bottom-full md:group-hover:bottom-0 ${showInfo ? '-bottom-0' : '-bottom-full'} left-0 right-0 m-2 rounded-md bg-[#10131F] p-4 transition-all duration-500`}
      >
        <div className='flex flex-col items-start justify-between gap-y-1.5'>
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
          <Text className='text-md prompt max-h-[100px] overflow-y-auto text-white'>{prompt}</Text>
        </div>

        <div className='mt-3 flex items-center justify-between gap-2'>
          <Link
            className='flex items-center gap-2'
            to='/account'
            state={user}
            style={{ pointerEvents: currentUser?._id === user._id ? 'none' : 'auto' }}
          >
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-green-700 object-cover text-xs font-bold text-white'>
              {user.photo ? <img className='rounded-full' src={user.photo} /> : user.username[0].toUpperCase()}
            </div>

            <Text className='text-sm text-white'>{user.username}</Text>
          </Link>

          <button
            type='button'
            onClick={() => {
              downloadImage(_id, photo);
            }}
          >
            <Tooltip label='Download image' withArrow>
              <IconDownload className='text-slate-300' size={24} />
            </Tooltip>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

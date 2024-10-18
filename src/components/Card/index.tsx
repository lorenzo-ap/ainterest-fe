import { useState } from 'react';
import { IconDownload, IconInfoSquareRounded, IconSquareRoundedXFilled } from '@tabler/icons-react';

import { Post } from '../../types/post.interface';
import { downloadImage } from '../../utils';
import { Tooltip } from '@mantine/core';

const Card = ({ _id, name, prompt, photo }: Post) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className='rounded-xl group relative shadow-card hover:shadow-card-hover card overflow-y-hidden'>
      <div
        className={`absolute top-0 left-0 w-full h-full ${showInfo ? 'bg-slate-800' : 'bg-transparent'} bg-opacity-50 transition-colors duration-300`}
      />

      <img className='w-full h-auto object-cover rounded-xl' src={photo} alt={prompt} />

      <button
        className='absolute top-3 right-3 md:hidden z-10'
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
        className={`md:-bottom-full md:group-hover:bottom-0 flex flex-col max-h-[75%] absolute ${showInfo ? '-bottom-0' : '-bottom-full'} left-0 right-0 bg-[#10131F] m-2 p-4 rounded-md transition-all duration-300`}
      >
        <p className='text-white text-md overflow-y-auto prompt max-h-[50%]'>{prompt}</p>

        <div className='mt-5 flex justify-between items-center gap-2'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
              {name[0]}
            </div>

            <p className='text-white text-sm'>{name}</p>
          </div>

          <button type='button' onClick={() => downloadImage(_id, photo)}>
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

import { Post } from '../../types/post.interface';

import { download } from '../../assets';
import { downloadImage } from '../../utils';

const Card = ({ _id, name, prompt, photo }: Post) => {
  return (
    <div className='rounded-xl group relative shadow-card hover:shadow-card-hover card overflow-y-hidden'>
      <img className='w-full h-auto object-cover rounded-xl' src={photo} alt={prompt} />

      <div className='group-hover:bottom-0 flex flex-col max-h-[94.5%] absolute -bottom-3/4 left-0 right-0 bg-[#10131F] m-2 p-4 rounded-md transition-all duration-300'>
        <p className='text-white text-md overflow-y-auto prompt'>{prompt}</p>

        <div className='mt-5 flex justify-between items-center gap-2'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold'>
              {name[0]}
            </div>

            <p className='text-white text-sm'>{name}</p>
          </div>

          <button
            className='outline-none bg-transparent border-none'
            type='button'
            onClick={() => downloadImage(_id, photo)}
          >
            <img className='w-6 h-6 object-contain invert' src={download} alt='Download' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

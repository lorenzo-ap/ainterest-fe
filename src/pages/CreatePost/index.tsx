import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

import CreatePostForm from './components/CreatePostForm';

const CreatePost = () => {
  return (
    <section className='max-w-7xl mx-auto flex flex-col items-start'>
      <Link
        className='font-inter font-medium bg-[#6469FF] text-white px-3.5 py-2 rounded-md flex items-center gap-x-1'
        to='/'
      >
        <IoIosArrowBack className='inline-block' />
        Go back
      </Link>

      <div className='mt-8'>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>

        <p className='mt-2 text-[#666E75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images through AI and share them with the community
        </p>
      </div>

      <CreatePostForm />
    </section>
  );
};

export default CreatePost;

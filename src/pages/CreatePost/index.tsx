import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { RiAiGenerate, RiShareBoxLine } from 'react-icons/ri';

import { preview } from '../../assets';
import { FormField, Loader } from '../../components';
import { getRandomPrompt } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types/post.interface';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  });
  const [generatingImage, setGeneratingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!form.prompt.trim()) return;

    setGeneratingImage(true);

    const headers = {
      'x-rapidapi-key': import.meta.env.VITE_X_RAPIDAPI_KEY,
      'x-rapidapi-host': 'imageai-generator.p.rapidapi.com',
      'Content-Type': 'application/json'
    };

    const data = {
      negative_prompt: 'white',
      prompt: form.prompt,
      width: 512,
      height: 512,
      hr_scale: 2
    };

    axios
      .post('https://imageai-generator.p.rapidapi.com/image', data, { headers })
      .then((response) => setForm({ ...form, photo: `data:image/png;base64,${response.data}` }))
      .catch((error) => console.error(error))
      .finally(() => setGeneratingImage(false));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.prompt.trim() || !form.photo.trim()) return;

    setIsLoading(true);

    axios
      .post<Post>(`${import.meta.env.VITE_API_URL}/api/v1/post`, form)
      .then(() => navigate('/'))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);

    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className='max-w-7xl mx-auto flex flex-col items-start'>
      <Link
        className=' font-inter font-medium bg-[#6469FF] text-white px-3.5 py-2 rounded-md flex items-center gap-x-1'
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

      <form className='mt-10 max-w-4xl' onSubmit={handleSubmit}>
        <div className='flex flex-col md:flex-row justify-between gap-5'>
          <div className='flex flex-col gap-5 flex-grow md:order-1 order-0 min-w-96'>
            <FormField
              labelName='Your name'
              type='text'
              name='name'
              placeholder='John Doe'
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName='Prompt'
              type='text'
              name='prompt'
              placeholder='The long-lost Star Wars 1990 Japanese Anime'
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />

            <div className='flex items-center gap-3'>
              <button
                className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center flex-grow flex justify-center items-center'
                type='button'
                onClick={generateImage}
                disabled={generatingImage}
              >
                {generatingImage ? (
                  'Generating...'
                ) : (
                  <>
                    Generate <RiAiGenerate className='inline-block ms-1.5 text-lg' />
                  </>
                )}
              </button>

              <button
                className='text-white bg-[#6469FF] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center xs:flex hidden flex-grow justify-center items-center'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? (
                  'Sharing...'
                ) : (
                  <>
                    Share with the community <RiShareBoxLine className='inline-block ms-1.5 text-lg' />
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-96 md:h-96 flex justify-center items-center'>
              {form.photo ? (
                <img className='w-full h-full object-cover rounded-lg' src={form.photo} alt={form.prompt} />
              ) : (
                <img className='w-9/12 h-9/12 object-contain opacity-40' src={preview} alt='Preview' />
              )}

              {generatingImage && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg p-3'>
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <p className='mt-2 text-[#666E75] text-sm'>
            Once you have created the image you want, you can share it with others in the community.
            <span className='text-red-500'>*</span>
          </p>

          <button
            className='mt-4 text-white bg-[#6469FF] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center inline-block xs:hidden'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              'Sharing...'
            ) : (
              <>
                Share with the community <RiShareBoxLine className='inline-block ms-1.5 text-lg' />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;

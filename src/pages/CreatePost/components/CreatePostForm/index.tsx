import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { RiAiGenerate } from 'react-icons/ri';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import * as yup from 'yup';
import { TbPhotoShare } from 'react-icons/tb';

import { preview } from '../../../../assets';
import { FormField, Loader } from '../../../../components';
import { Post } from '../../../../types/post.interface';
import { getRapidApiHeaders, getRandomPrompt } from '../../../../utils';

interface Form {
  name: string;
  prompt: string;
}

interface TranslateApiResponse {
  code: number;
  texts: string;
  tl: string;
}

const CreatePostForm = () => {
  const navigate = useNavigate();

  const [generatedImageData, setGeneratedImageData] = useState<Omit<Post, '_id' | 'name'> | null>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isImageMissing, setIsImageMissing] = useState(false);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('this field is required')
      .min(2, 'must be at least 2 characters')
      .max(50, 'must be at most 50 characters'),
    prompt: yup
      .string()
      .required('this field is required')
      .min(3, 'must be at least 3 characters')
      .max(150, 'must be at most 150 characters')
  });

  const { register, handleSubmit, setValue, watch, formState, trigger, clearErrors } = useForm<Form>({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const form = watch();

  const generateAndSetImage = (prompt: string, translatedPrompt: string) => {
    const headers = getRapidApiHeaders('imageai-generator.p.rapidapi.com');
    const body = {
      negative_prompt: 'white',
      prompt: translatedPrompt,
      width: 512,
      height: 512,
      hr_scale: 2
    };

    axios
      .post<string>('https://imageai-generator.p.rapidapi.com/image', body, { headers })
      .then((response) => {
        setGeneratedImageData({ prompt, photo: `data:image/png;base64,${response.data}` });
        setIsImageMissing(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsGenerating(false));
  };

  const onGenerate = () => {
    clearErrors(['name']);
    setIsImageMissing(false);

    if (!form.prompt?.trim()) {
      trigger('prompt');
      return;
    }

    setIsGenerating(true);

    const prompt = form.prompt;
    const headers = getRapidApiHeaders('ai-translate.p.rapidapi.com');
    const body = {
      texts: [form.prompt],
      tls: ['en'],
      sl: 'auto'
    };

    axios
      .post<TranslateApiResponse[]>('https://ai-translate.p.rapidapi.com/translates', body, {
        headers
      })
      .then((response) => generateAndSetImage(prompt, response.data[0].texts))
      .catch((error) => console.error(error));
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!generatedImageData?.photo) {
      setIsImageMissing(true);
      return;
    }

    handleSubmit(sharePost)();
  };

  const sharePost: SubmitHandler<Form> = (formData) => {
    setIsSharing(true);
    setIsImageMissing(false);

    const body = { ...generatedImageData, name: formData.name };

    axios
      .post<Post>(`${import.meta.env.VITE_API_URL}/api/v1/post`, body)
      .then(() => navigate('/'))
      .catch((error) => console.error(error))
      .finally(() => setIsSharing(false));
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);

    setValue('prompt', randomPrompt, { shouldValidate: true });
  };

  return (
    <form className='mt-10 max-w-4xl' onSubmit={submitForm}>
      <div className='flex flex-col md:flex-row justify-between gap-5'>
        <div className='flex flex-col gap-5 flex-grow md:order-1 order-0 md:min-w-96'>
          <FormField
            name='name'
            labelName='Your name'
            type='text'
            placeholder='John Doe'
            register={register('name')}
            error={formState.errors.name?.message}
          />

          <FormField
            name='prompt'
            labelName='Prompt'
            type='text'
            placeholder='The long-lost Star Wars 1990 Japanese Anime'
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
            register={register('prompt')}
            error={formState.errors.prompt?.message}
          />

          <div className='flex items-center gap-3'>
            <button
              className='text-white bg-pink-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center flex-grow flex justify-center items-center'
              type='button'
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
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
              disabled={isSharing || isGenerating}
            >
              {isSharing ? (
                'Sharing...'
              ) : (
                <>
                  Share with the community <TbPhotoShare className='inline-block ms-1.5 text-lg' />
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <div
            className={`relative bg-gray-50 border text-gray-900 text-sm rounded-xl ${isImageMissing ? 'border-red-500' : 'border-gray-300'} w-full md:w-96 md:h-96 flex justify-center items-center`}
          >
            {generatedImageData?.photo ? (
              <img
                className='w-full h-full object-cover rounded-lg'
                src={generatedImageData?.photo}
                alt={form.prompt}
              />
            ) : (
              <img className='w-9/12 h-9/12 object-contain opacity-40' src={preview} alt='Preview' />
            )}

            {isGenerating && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg p-3'>
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      {isImageMissing && <p className='text-red-500 text-xs mt-1.5'>* an image should be successfully generated</p>}

      <div className='mt-6'>
        <p className='mt-2 text-[#666E75] text-sm'>
          Once you have created the image you want, you can share it with others in the community.
        </p>

        <button
          className='mt-4 text-white bg-[#6469FF] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center inline-block xs:hidden'
          type='submit'
          disabled={isSharing || isGenerating}
        >
          {isSharing ? (
            'Sharing...'
          ) : (
            <>
              Share with the community <TbPhotoShare className='inline-block ms-1.5 text-lg' />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;

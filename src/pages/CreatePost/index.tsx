import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Textarea, TextInput } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconBrandOpenai, IconChevronLeft, IconPhotoUp } from '@tabler/icons-react';

import { Post } from '../../types/post.interface';
import { AppDispatch } from '../../redux/store';
import { getRandomPrompt, getRapidApiHeaders } from '../../utils';
import { APIResponse, TranslateAPIResponse } from '../../types/api-response.interface';
import { addPost } from '../../redux/slices/postsSlice';
import GeneratedImage from './components/GeneratedImage';

export interface CreatePostForm {
  name: string;
  prompt: string;
}

const CreatePost = () => {
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

  const { register, handleSubmit, setValue, watch, formState, trigger, clearErrors } = useForm<CreatePostForm>({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const form = watch();
  const dispatch: AppDispatch = useDispatch();

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
      .post<TranslateAPIResponse[]>('https://ai-translate.p.rapidapi.com/translates', body, {
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

  const sharePost: SubmitHandler<CreatePostForm> = (formData) => {
    setIsSharing(true);
    setIsImageMissing(false);

    const body = { ...generatedImageData, name: formData.name };

    axios
      .post<APIResponse<Post>>(`${import.meta.env.VITE_API_URL}/api/v1/post`, body)
      .then((post) => {
        dispatch(addPost(post.data.data));
        navigate('/');
      })
      .catch((error) => console.error(error))
      .finally(() => setIsSharing(false));
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);

    setValue('prompt', randomPrompt, { shouldValidate: true });
  };

  return (
    <section className='max-w-7xl mx-auto flex flex-col items-start'>
      <div className='flex flex-col lg:flex-row justify-between items-center lg:items-start w-full gap-5'>
        <form className='max-w-xl lg:max-w-md xl:max-w-lg' onSubmit={submitForm}>
          <Button component={Link} to='/' color='violet' size='compact-md' leftSection={<IconChevronLeft size={18} />}>
            Go back
          </Button>

          <div className='mt-8'>
            <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>

            <p className='mt-2 mb-5 md:mb-8 text-[#666E75] text-[16px] max-w-[500px]'>
              Create imaginative and visually stunning images through AI and share them with the community
            </p>
          </div>

          <GeneratedImage
            {...{
              imageSource: generatedImageData?.photo,
              imageAlt: form.prompt,
              isGenerating,
              isImageMissing,
              hiddenOnLargeScreen: true
            }}
          />

          <div className='flex flex-col md:flex-row justify-between gap-5'>
            <div className='flex flex-col gap-5 flex-grow md:min-w-96'>
              <TextInput
                className='relative'
                label='Your name'
                placeholder='John Doe'
                error={formState.errors.name?.message}
                {...register('name')}
              />

              <Textarea
                className='relative'
                rows={8}
                label='Prompt'
                placeholder='The long-lost Star Wars 1990 Japanese Anime'
                error={formState.errors.prompt?.message}
                {...register('prompt')}
                inputContainer={(children) => (
                  <>
                    {children}

                    <Button
                      className='absolute top-0 right-0'
                      size='compact-xs'
                      variant='light'
                      color='dark'
                      onClick={handleSurpriseMe}
                    >
                      Surprise me
                    </Button>
                  </>
                )}
              />

              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                <Button
                  color='teal'
                  size='md'
                  rightSection={!isGenerating && <IconBrandOpenai size={20} />}
                  onClick={onGenerate}
                  disabled={isGenerating || isSharing}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>

                <Button
                  className='flex-grow-0 sm:flex-grow'
                  color='violet'
                  size='md'
                  type='submit'
                  rightSection={!isSharing && <IconPhotoUp size={20} />}
                  disabled={isGenerating || isSharing}
                >
                  {isSharing ? 'Sharing...' : 'Share with the community'}
                </Button>
              </div>
            </div>
          </div>

          <p className='mt-3 md:mt-6 text-[#666E75] text-sm'>
            Once you have created the image you want, you can share it with others in the community.
          </p>
        </form>

        <GeneratedImage
          {...{
            imageSource: generatedImageData?.photo,
            imageAlt: form.prompt,
            isGenerating,
            isImageMissing
          }}
        />
      </div>
    </section>
  );
};

export default CreatePost;

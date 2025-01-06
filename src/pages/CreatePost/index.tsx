import { Button, Text, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconBrandOpenai, IconPhotoUp } from '@tabler/icons-react';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/post';
import { toastService } from '../../services/toast';
import { TranslateAPIResponse } from '../../types/api-response.interface';
import { GeneratedImage } from '../../types/post.interface';
import { getRandomPrompt, getRapidApiHeaders } from '../../utils';
import GeneratedImageComponent from './components/GeneratedImage';

export interface CreatePostForm {
  prompt: string;
  generatedImage: GeneratedImage;
}

const CreatePost = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isImageMissing, setIsImageMissing] = useState(false);

  const navigate = useNavigate();

  const form = useForm<CreatePostForm>({
    mode: 'uncontrolled',
    initialValues: {
      prompt: '',
      generatedImage: {
        prompt: '',
        photo: ''
      }
    },

    validate: {
      prompt: (value) => {
        if (!value.trim()) {
          return 'Prompt is required';
        }

        if (value.length < 5) {
          return 'Prompt should be at least 5 characters long';
        }

        if (value.length > 200) {
          return 'Prompt should be at most 200 characters long';
        }
      }
    }
  });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.getValues().prompt);

    form.setFieldValue('prompt', randomPrompt);
  };

  const generateImage = (prompt: string, translatedPrompt: string) => {
    const headers = getRapidApiHeaders('imageai-generator.p.rapidapi.com');
    const body = {
      negative_prompt: null,
      prompt: translatedPrompt,
      width: 512,
      height: 512,
      hr_scale: 2
    };

    axios
      .post<string>('https://imageai-generator.p.rapidapi.com/image', body, { headers })
      .then((response) => {
        form.setFieldValue('generatedImage', { prompt, photo: `data:image/png;base64,${response.data}` });
        setIsImageMissing(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsGenerating(false));
  };

  const onGenerate = () => {
    const promptValidation = form.validateField('prompt');

    setIsImageMissing(false);

    if (promptValidation.hasError) {
      form.validateField('prompt');
      return;
    }

    setIsGenerating(true);

    const { prompt } = form.getValues();
    const headers = getRapidApiHeaders('ai-translate.p.rapidapi.com');
    const body = {
      texts: [prompt],
      tls: ['en'],
      sl: 'auto'
    };

    axios
      .post<TranslateAPIResponse[]>('https://ai-translate.p.rapidapi.com/translates', body, {
        headers
      })
      .then((response) => generateImage(prompt, response.data[0].texts[0]))
      .catch((error) => console.error(error));
  };

  const sharePost = (formData: CreatePostForm) => {
    form.clearFieldError('prompt');

    setIsSharing(true);
    setIsImageMissing(false);

    const body = { ...formData.generatedImage };

    postService
      .createPost(body)
      .then(() => {
        navigate(-1);

        toastService.success('Post shared successfully');
      })
      .catch((error) => console.error(error))
      .finally(() => setIsSharing(false));
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.getValues().generatedImage.photo) {
      form.clearFieldError('prompt');
      setIsImageMissing(true);
      return;
    }

    sharePost(form.getValues());
  };

  return (
    <section className='mx-auto flex max-w-7xl flex-col items-start'>
      <div className='flex w-full flex-col items-center justify-between gap-5 lg:flex-row lg:items-start'>
        <form className='max-w-xl lg:max-w-md xl:max-w-lg' onSubmit={submitForm}>
          <Button
            color='violet'
            size='compact-md'
            onClick={() => {
              navigate(-1);
            }}
            leftSection={<IconArrowLeft size={18} />}
          >
            Back
          </Button>

          <div className='mt-4 md:mt-8'>
            <Title order={1}>Create</Title>

            <Text className='mb-5 mt-2 max-w-[500px] opacity-60 lg:mb-8'>
              Create imaginative and visually stunning images through AI and share them with the community
            </Text>
          </div>

          <GeneratedImageComponent
            {...{
              imageSource: form.getValues().generatedImage.photo,
              imageAlt: form.getValues().prompt,
              isGenerating,
              isImageMissing,
              hiddenOnLargeScreen: true
            }}
          />

          <div className='flex flex-col justify-between gap-5 md:flex-row'>
            <div className='flex flex-grow flex-col gap-5 md:min-w-96'>
              <Textarea
                className='relative'
                rows={8}
                label='Prompt'
                placeholder='The long-lost Star Wars 1990 Japanese Anime'
                key={form.key('prompt')}
                {...form.getInputProps('prompt')}
                inputContainer={(children) => (
                  <>
                    {children}

                    <Button
                      className='absolute -top-0.5 right-0'
                      size='compact-xs'
                      variant='default'
                      color='dark'
                      onClick={handleSurpriseMe}
                    >
                      Surprise me
                    </Button>
                  </>
                )}
              />

              <div className='flex flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
                <Button
                  color='teal'
                  size='md'
                  rightSection={<IconBrandOpenai size={20} />}
                  onClick={onGenerate}
                  disabled={isGenerating || isSharing}
                >
                  Generate
                </Button>

                <Button
                  className='flex-grow-0 sm:flex-grow'
                  color='violet'
                  size='md'
                  type='submit'
                  rightSection={!isSharing && <IconPhotoUp size={20} />}
                  loading={isSharing}
                  disabled={isGenerating}
                >
                  Share with the community
                </Button>
              </div>
            </div>
          </div>

          <Text className='mt-3 text-sm opacity-60 md:mt-4'>
            Once you have created the image you want, you can share it with others in the community.
          </Text>
        </form>

        <GeneratedImageComponent
          {...{
            imageSource: form.getValues().generatedImage.photo,
            imageAlt: form.getValues().prompt,
            isGenerating,
            isImageMissing
          }}
        />
      </div>
    </section>
  );
};

export default CreatePost;

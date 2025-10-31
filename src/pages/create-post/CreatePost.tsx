import { Button, Select, Text, Textarea, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconPhotoUp, IconSparkles } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { generateImage } from '../../api';
import { useFormValidation } from '../../hooks';
import { postService } from '../../services/posts';
import { toastService } from '../../services/toast';
import { CreatePostForm } from '../../types';
import { getRandomPrompt } from '../../utils';
import { PostGeneratedImage } from './components';

const SIZE_OPTIONS = ['256x256', '512x512', '1024x1024'];

export const CreatePostPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isImageMissing, setIsImageMissing] = useState(false);

  const form = useForm<CreatePostForm>({
    mode: 'uncontrolled',
    initialValues: {
      prompt: '',
      size: '',
      postGeneratedImage: {
        prompt: '',
        photo: ''
      }
    },

    validate: {
      prompt: (value) => {
        if (!value.trim()) {
          return t('pages.generate_image.errors.prompt.required');
        }

        if (value.length < 5) {
          return t('pages.generate_image.errors.prompt.min_length');
        }

        if (value.length > 200) {
          return t('pages.generate_image.errors.prompt.max_length');
        }
      },
      size: (value) => {
        if (!value) {
          return t('pages.generate_image.errors.size.required');
        }
      }
    }
  });

  useFormValidation(form, i18n);

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.getValues().prompt);

    form.setFieldValue('prompt', randomPrompt);
  };

  const generatePostImage = (prompt: string, size: number) => {
    generateImage(prompt, size)
      .then((response) => {
        form.setFieldValue('postGeneratedImage', { prompt, photo: response.data.image });
        setIsImageMissing(false);
      })
      .catch((err: AxiosError<{ message: string; nsfw: boolean }>) => {
        if (!err.response?.data.nsfw) return;
        toastService.error(t('apis.generate.error'));
      })
      .finally(() => setIsGenerating(false));
  };

  const onGenerate = () => {
    const promptValidation = form.validateField('prompt');
    const sizeValidation = form.validateField('size');

    setIsImageMissing(false);

    if (promptValidation.hasError || sizeValidation.hasError) {
      form.validateField('prompt');
      form.validateField('size');
      return;
    }

    setIsGenerating(true);

    const size = +form.getValues().size.split('x')[0];
    const { prompt } = form.getValues();

    generatePostImage(prompt, size);
  };

  const sharePost = (formData: CreatePostForm) => {
    setIsSharing(true);
    setIsImageMissing(false);

    const body = { ...formData.postGeneratedImage };

    postService
      .createPost(body)
      .then(() => {
        navigate('/');

        toastService.success(t('apis.post.success'));
      })
      .finally(() => setIsSharing(false));
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.getValues().postGeneratedImage.photo) {
      form.clearFieldError('prompt');
      form.clearFieldError('size');
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
            {t('common.back')}
          </Button>

          <div className='mt-4 md:mt-8'>
            <Title order={1}>{t('pages.generate_image.heading')}</Title>

            <Text className='mb-5 mt-2 max-w-[500px] opacity-60 lg:mb-8'>{t('pages.generate_image.subheading')}</Text>
          </div>

          <PostGeneratedImage
            {...{
              imageSource: form.getValues().postGeneratedImage.photo,
              imageAlt: form.getValues().prompt,
              isGenerating,
              isImageMissing,
              hiddenOnLargeScreen: true
            }}
          />

          <div className='flex flex-col justify-between gap-5 md:flex-row'>
            <div className='flex flex-grow flex-col gap-3 md:min-w-96'>
              <Textarea
                className='relative'
                size='md'
                rows={8}
                label={t('pages.generate_image.prompt')}
                placeholder={t('pages.generate_image.prompt_example')}
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
                      {t('pages.generate_image.surprise_me')}
                    </Button>
                  </>
                )}
              />

              <Select
                size='md'
                label={t('pages.generate_image.size')}
                placeholder={t('pages.generate_image.size_example')}
                data={SIZE_OPTIONS}
                {...form.getInputProps('size')}
              />

              <div className='flex flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
                <Button
                  color='teal'
                  size='md'
                  leftSection={<IconSparkles size={20} />}
                  onClick={onGenerate}
                  disabled={isGenerating || isSharing}
                >
                  {t('pages.generate_image.generate')}
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
                  {t('pages.generate_image.share')}
                </Button>
              </div>
            </div>
          </div>

          <Text className='mt-3 text-sm opacity-60 md:mt-4'>{t('pages.generate_image.info')}</Text>
        </form>

        <PostGeneratedImage
          {...{
            imageSource: form.getValues().postGeneratedImage.photo,
            imageAlt: form.getValues().prompt,
            isGenerating,
            isImageMissing
          }}
        />
      </div>
    </section>
  );
};

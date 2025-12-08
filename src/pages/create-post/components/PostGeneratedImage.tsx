import { ActionIcon, Loader, Text, Tooltip } from '@mantine/core';
import { IconPhoto, IconPhotoDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../../queries';
import { downloadImage } from '../../../utils';

interface GeneratedImageProps {
  imageSource: string;
  imageAlt: string;
  isGenerating: boolean;
  isImageMissing: boolean;
  hiddenOnLargeScreen?: boolean;
}

export const PostGeneratedImage = (props: GeneratedImageProps) => {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUser();

  return (
    <div
      className={`mb-5 w-full max-w-xl lg:mb-0 lg:w-1/2 lg:max-w-full ${props.hiddenOnLargeScreen ? 'block lg:hidden' : 'hidden lg:block'}`}
    >
      <div
        className={`relative rounded-xl border ${props.isImageMissing ? 'border-[#E03131]' : 'border-color'} flex aspect-square items-center justify-center shadow-lg`}
      >
        {props.imageSource && !props.isGenerating && (
          <Tooltip label={t('components.post_card.download_image')} withArrow>
            <ActionIcon
              className='absolute right-4 top-4 z-10'
              variant='transparent'
              p={0}
              size={28}
              onClick={() => {
                downloadImage(props.imageAlt, props.imageSource, currentUser.username);
              }}
              aria-label={t('components.post_card.download_image')}
            >
              <IconPhotoDown className='text-slate-300' size={28} />
            </ActionIcon>
          </Tooltip>
        )}

        {props.imageSource ? (
          <img className='h-full w-full rounded-xl object-cover' src={props.imageSource} alt={props.imageAlt} />
        ) : (
          <IconPhoto className='opacity-50' size='256' color={props.isImageMissing ? '#E03131' : '#E5E7EB'} />
        )}

        {props.isGenerating && (
          <div
            className={`absolute inset-0 z-0 flex items-center justify-center rounded-xl p-3 ${props.imageSource ? 'bg-black/50' : 'bg-black/20'}`}
          >
            <Loader color='rgba(135, 232, 200, 1)' size={64} />
          </div>
        )}
      </div>

      {props.isImageMissing && (
        <Text className='mt-1.5 text-xs text-[#E03131]'>
          {t('pages.generate_image.errors.image_should_be_generated')}
        </Text>
      )}
    </div>
  );
};

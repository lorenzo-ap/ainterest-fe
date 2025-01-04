import { Loader, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

import styles from './index.module.scss';

interface GeneratedImageProps {
  imageSource: string | undefined;
  imageAlt: string;
  isGenerating: boolean;
  isImageMissing: boolean;
  hiddenOnLargeScreen?: boolean;
}

const GeneratedImage = ({
  imageSource,
  imageAlt,
  isGenerating,
  isImageMissing,
  hiddenOnLargeScreen
}: GeneratedImageProps) => {
  return (
    <div
      className={`mb-5 w-full max-w-xl lg:mb-0 lg:w-1/2 lg:max-w-full ${hiddenOnLargeScreen ? 'block lg:hidden' : 'hidden lg:block'}`}
    >
      <div
        className={`${styles.backgroundColor} relative rounded-xl border ${isImageMissing ? 'border-[#FA5252]' : styles.border} flex aspect-square items-center justify-center shadow-lg`}
      >
        {imageSource ? (
          <img className='h-full w-full rounded-xl object-cover' src={imageSource} alt={imageAlt} />
        ) : (
          <IconPhoto className='opacity-50' size='256' color={isImageMissing ? '#FA5252' : '#E5E7EB'} />
        )}

        {isGenerating && (
          <div className='absolute inset-0 z-0 flex items-center justify-center rounded-xl bg-[rgba(0,0,0,0.5)] p-3'>
            <Loader color='rgba(135, 232, 200, 1)' type='oval' size={64} />
          </div>
        )}
      </div>

      {isImageMissing && (
        <Text className='mt-1.5 text-xs text-[#FA5252]'>* an image should be successfully generated</Text>
      )}
    </div>
  );
};

export default GeneratedImage;

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
      className={`w-full max-w-xl lg:max-w-full lg:w-1/2 mb-5 lg:mb-0 ${hiddenOnLargeScreen ? 'block lg:hidden' : 'hidden lg:block'}`}
    >
      <div
        className={`${styles.backgroundColor} relative border rounded-xl ${isImageMissing ? 'border-[#FA5252]' : styles.border} flex justify-center items-center aspect-square shadow-lg`}
      >
        {imageSource ? (
          <img className='w-full h-full object-cover rounded-xl' src={imageSource} alt={imageAlt} />
        ) : (
          <IconPhoto className='opacity-50' size='256' />
        )}

        {isGenerating && (
          <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-xl p-3'>
            <Loader color='rgba(135, 232, 200, 1)' type='oval' size={64} />
          </div>
        )}
      </div>

      {isImageMissing && (
        <Text className='text-[#FA5252] text-xs mt-1.5'>* an image should be successfully generated</Text>
      )}
    </div>
  );
};

export default GeneratedImage;

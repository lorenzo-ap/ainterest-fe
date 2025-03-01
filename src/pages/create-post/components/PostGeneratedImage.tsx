import { Loader, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

interface GeneratedImageProps {
  imageSource: string | undefined;
  imageAlt: string;
  isGenerating: boolean;
  isImageMissing: boolean;
  hiddenOnLargeScreen?: boolean;
}

export const PostGeneratedImage = ({
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
        className={`relative rounded-xl border ${isImageMissing ? 'border-[#E03131]' : 'border-color'} flex aspect-square items-center justify-center shadow-lg`}
      >
        {imageSource ? (
          <img className='h-full w-full rounded-xl object-cover' src={imageSource} alt={imageAlt} />
        ) : (
          <IconPhoto className='opacity-50' size='256' color={isImageMissing ? '#E03131' : '#E5E7EB'} />
        )}

        {isGenerating && (
          <div
            className={`absolute inset-0 z-0 flex items-center justify-center rounded-xl p-3 ${imageSource ? 'bg-black/50' : 'bg-black/20'}`}
          >
            <Loader color='rgba(135, 232, 200, 1)' type='oval' size={64} />
          </div>
        )}
      </div>

      {isImageMissing && <Text className='mt-1.5 text-xs text-[#E03131]'>Image should be successfully generated</Text>}
    </div>
  );
};

import { Loader } from '@mantine/core';

import preview from '../../../../assets/preview.png';

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
        className={`relative bg-gray-50 border text-gray-900 rounded-xl ${isImageMissing ? 'border-[#FA5252]' : 'border-gray-300'} flex justify-center items-center aspect-square shadow-lg`}
      >
        {imageSource ? (
          <img className='w-full h-full object-cover rounded-lg' src={imageSource} alt={imageAlt} />
        ) : (
          <img className='w-9/12 h-9/12 object-contain opacity-40' src={preview} alt='Preview' />
        )}

        {isGenerating && (
          <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg p-3'>
            <Loader color='rgba(135, 232, 200, 1)' type='oval' size={64} />
          </div>
        )}
      </div>

      {isImageMissing && <p className='text-[#FA5252] text-xs mt-1.5'>* an image should be successfully generated</p>}
    </div>
  );
};

export default GeneratedImage;

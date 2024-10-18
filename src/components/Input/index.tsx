import { Button } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  className?: string;
  register?: UseFormRegisterReturn<'name' | 'prompt' | 'image'>;
  labelName: string;
  type: string;
  name: string;
  placeholder: string;
  error?: string | undefined;
  value?: string;
  isSurpriseMe?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSurpriseMe?: () => void;
}

const Input = (props: InputProps) => {
  const {
    className,
    register,
    labelName,
    type,
    name,
    placeholder,
    isSurpriseMe,
    handleSurpriseMe,
    value,
    handleChange,
    error
  } = props;

  return (
    <div className={isSurpriseMe ? 'h-full' : '' + ` ${className}`}>
      <div className='flex justify-between items-center gap-2 mb-2'>
        <div className='flex items-baseline gap-x-1.5'>
          <label className='block text-sm font-medium text-gray-900' htmlFor={name}>
            {labelName}
          </label>

          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>

        {isSurpriseMe && (
          <Button size='compact-xs' variant='light' color='dark' onClick={handleSurpriseMe}>
            Surprise me
          </Button>
        )}
      </div>

      {isSurpriseMe ? (
        <textarea
          id={name}
          className={`prompt bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${error ? 'border-red-500' : 'focus:ring-[#6469FF] focus:border-[#6469FF]'} outline-none block w-full p-3 resize-none h-32 md:h-[calc(100%-32px)]`}
          placeholder={placeholder}
          autoComplete='off'
          {...register}
        />
      ) : (
        <input
          id={name}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${error ? 'border-red-500' : 'focus:ring-[#6469FF] focus:border-[#6469FF]'} outline-none block w-full p-3`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete='off'
          {...register}
        />
      )}
    </div>
  );
};

export default Input;

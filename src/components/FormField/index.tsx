import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  register?: UseFormRegisterReturn<'name' | 'prompt' | 'image'>;
  labelName: string;
  type: string;
  name: string;
  placeholder: string;
  isSurpriseMe?: boolean;
  handleSurpriseMe?: () => void;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hasError?: boolean;
  error?: string | undefined;
}

const FormField = (props: FormFieldProps) => {
  const {
    register,
    labelName,
    type,
    name,
    placeholder,
    isSurpriseMe,
    handleSurpriseMe,
    value,
    handleChange,
    hasError,
    error
  } = props;

  return (
    <div className={`${isSurpriseMe ? 'h-full' : ''}`}>
      <div className='flex justify-between items-center gap-2 mb-2'>
        <div className='flex items-baseline gap-x-1.5'>
          <label className='block text-sm font-medium text-gray-900' htmlFor={name}>
            {labelName}
          </label>

          {error && <span className='text-red-500 text-xs'>{error}</span>}
        </div>

        {isSurpriseMe && (
          <button
            className='font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black'
            type='button'
            onClick={handleSurpriseMe}
          >
            Surprise me
          </button>
        )}
      </div>

      {isSurpriseMe ? (
        <textarea
          id={name}
          className={`'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${hasError ? 'border-red-500' : 'focus:ring-[#6469FF] focus:border-[#6469FF]'} outline-none block w-full p-3 resize-none h-32 md:h-[calc(100%-32px)] prompt'`}
          name={name}
          placeholder={placeholder}
          autoComplete='off'
          {...register}
        />
      ) : (
        <input
          id={name}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${hasError ? 'border-red-500' : 'focus:ring-[#6469FF] focus:border-[#6469FF]'} outline-none block w-full p-3 prompt`}
          type={type}
          placeholder={placeholder}
          autoComplete='off'
          value={value}
          onChange={handleChange}
          {...register}
        />
      )}
    </div>
  );
};

export default FormField;

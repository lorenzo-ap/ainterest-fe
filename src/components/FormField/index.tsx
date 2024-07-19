import { ChangeEvent } from 'react';

interface FormFieldProps {
    labelName: string;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    isSurpriseMe?: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSurpriseMe?: () => void;
}

const FormField = (props: FormFieldProps) => {
    const { labelName, type, name, placeholder, value, handleChange, isSurpriseMe, handleSurpriseMe } = props;

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-900" htmlFor={name}>
                    {labelName}
                </label>

                {isSurpriseMe && (
                    <button
                        className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounded-[5px] text-black"
                        type="button"
                        onClick={handleSurpriseMe}>
                        Surprise me
                    </button>
                )}
            </div>

            <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6469FF] focus:border-[#6469FF] outline-none block w-full p-3"
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

export default FormField;

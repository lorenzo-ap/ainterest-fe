import { type InputHTMLAttributes, type ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeOffIcon } from './icons';

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
	label: string;
	error?: string;
	/** Small action rendered inside the field, e.g. "Change". */
	action?: ReactNode;
};

const inputClass = (invalid: boolean) =>
	`h-12 w-full rounded-md border bg-inset px-4 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-3 read-only:text-ink-2 disabled:opacity-50 ${
		invalid
			? 'border-danger bg-danger-tint focus:ring-2 focus:ring-danger-tint'
			: 'border-transparent focus:border-brand focus:bg-transparent focus:ring-[3px] focus:ring-brand-tint-strong'
	}`;

/** One text field for the whole product — label, control, message. */
export const Field = ({ label, error, action, className = '', id, ...rest }: FieldProps) => {
	const generatedId = useId();
	const fieldId = id ?? generatedId;

	return (
		<div className={className}>
			<label className='eyebrow mb-2 block' htmlFor={fieldId}>
				{label}
			</label>

			<div className='relative'>
				<input aria-invalid={Boolean(error)} className={inputClass(Boolean(error))} id={fieldId} {...rest} />

				{action && <div className='absolute top-1/2 right-3 -translate-y-1/2'>{action}</div>}
			</div>

			{error && <p className='mt-2 text-[12px] text-danger'>{error}</p>}
		</div>
	);
};

/** The same field with a reveal toggle — our eye, not the library's. */
export const PasswordField = ({ label, error, className = '', id, ...rest }: Omit<FieldProps, 'action'>) => {
	const { t } = useTranslation();
	const generatedId = useId();
	const fieldId = id ?? generatedId;

	const [revealed, setRevealed] = useState(false);

	return (
		<div className={className}>
			<label className='eyebrow mb-2 block' htmlFor={fieldId}>
				{label}
			</label>

			<div className='relative'>
				<input
					aria-invalid={Boolean(error)}
					className={`${inputClass(Boolean(error))} pr-12`}
					id={fieldId}
					type={revealed ? 'text' : 'password'}
					{...rest}
				/>

				<button
					aria-label={t(revealed ? 'a11y.hide_password' : 'a11y.show_password')}
					className='icon-btn absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2'
					onClick={() => setRevealed((previous) => !previous)}
					tabIndex={-1}
					type='button'
				>
					{revealed ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
				</button>
			</div>

			{error && <p className='mt-2 text-[12px] text-danger'>{error}</p>}
		</div>
	);
};

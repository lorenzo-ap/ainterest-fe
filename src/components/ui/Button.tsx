import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'neutral' | 'outline' | 'ghost' | 'danger';

const VARIANTS: Record<Variant, string> = {
	primary: 'bg-brand text-white hover:opacity-90',
	neutral: 'bg-ink text-bg hover:opacity-85',
	outline: 'border border-line text-ink-2 hover:bg-hover hover:text-ink',
	ghost: 'text-ink-3 hover:bg-hover hover:text-ink',
	danger: 'text-danger hover:bg-danger-tint'
};

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: ReactNode;
};

/** The single button implementation: pill, 44px, one weight, five intents. */
export const AppButton = ({
	variant = 'primary',
	loading,
	fullWidth,
	leftIcon,
	className = '',
	children,
	disabled,
	...rest
}: AppButtonProps) => (
	<button
		className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-medium text-[15px] transition-all duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 ${
			VARIANTS[variant]
		} ${fullWidth ? 'w-full' : ''} ${className}`}
		disabled={disabled || loading}
		{...rest}
	>
		{loading ? <Spinner size={15} /> : leftIcon}
		{children}
	</button>
);

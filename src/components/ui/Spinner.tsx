type SpinnerProps = {
	size?: number;
	className?: string;
};

/** A hairline ring that inherits the current text colour. Replaces Mantine's loader. */
export const Spinner = ({ size = 16, className = '' }: SpinnerProps) => (
	<span
		aria-hidden
		className={`spinner ${className}`}
		style={{ width: size, height: size, borderWidth: size > 24 ? 2 : 1.5 }}
	/>
);

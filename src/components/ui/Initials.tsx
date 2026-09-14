// Written out in full so Tailwind keeps these component classes in the build.
const TONES = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'];

const toneFor = (name: string) => {
	let sum = 0;
	for (let i = 0; i < name.length; i++) {
		sum += name.charCodeAt(i);
	}

	return TONES[sum % TONES.length];
};

type InitialsProps = {
	name: string;
	src?: string;
	size?: number;
	className?: string;
};

/**
 * One avatar treatment for the whole product: a photo when there is one,
 * otherwise a single letter on a muted tone derived from the name.
 */
export const Initials = ({ name, src, size = 32, className = '' }: InitialsProps) => {
	const style = { width: size, height: size };

	if (src) {
		return (
			<img
				alt={name}
				className={`shrink-0 rounded-full object-cover ${className}`}
				loading='lazy'
				src={src}
				style={style}
			/>
		);
	}

	return (
		<span
			aria-hidden
			className={`avatar ${toneFor(name)} shrink-0 ${className}`}
			style={{ ...style, fontSize: Math.max(11, Math.round(size * 0.4)) }}
		>
			{name[0]?.toUpperCase()}
		</span>
	);
};

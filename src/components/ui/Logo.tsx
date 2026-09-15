import { Link } from 'react-router-dom';

type WordmarkProps = {
	className?: string;
};

/** The AInterest wordmark. Unchanged brand mark — violet "AI" + "nterest". */
export const Wordmark = ({ className = '' }: WordmarkProps) => (
	<span className={`select-none font-semibold text-[1.375rem] leading-none tracking-[-0.03em] ${className}`}>
		<span className='font-bold text-brand'>AI</span>
		<span className='text-ink'>nterest</span>
	</span>
);

export const Logo = ({ className = '' }: WordmarkProps) => (
	<Link
		aria-label='AInterest'
		/* the wordmark is only 26px tall — the padding is what makes it a comfortable tap */
		className={`-my-2 flex items-center py-2 transition-opacity duration-150 hover:opacity-70 ${className}`}
		to='/'
	>
		<Wordmark />
	</Link>
);

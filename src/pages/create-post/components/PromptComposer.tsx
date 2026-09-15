import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ShuffleIcon, Spinner } from '../../../components/ui';

export const SIZE_OPTIONS = ['256x256', '512x512', '1024x1024'] as const;

type PromptComposerProps = {
	prompt: string;
	size: string;
	maxLength: number;
	error?: string;
	isGenerating: boolean;
	disabled: boolean;
	onPromptChange: (value: string) => void;
	onSizeChange: (value: string) => void;
	onSurpriseMe: () => void;
	onGenerate: () => void;
};

/**
 * The centre of the studio: one comfortable place to say what you want,
 * with the controls that shape it sitting on the same surface.
 */
export const PromptComposer = (props: PromptComposerProps) => {
	const { t } = useTranslation();

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return;
		event.preventDefault();
		props.onGenerate();
	};

	return (
		<div className='w-full'>
			<div
				className={`rounded-xl border bg-surface p-2 shadow-pop transition-colors duration-200 focus-within:border-brand ${
					props.error ? 'border-danger' : 'border-line'
				}`}
			>
				<label className='sr-only' htmlFor='prompt'>
					{t('pages.generate_image.prompt')}
				</label>

				{/* two rows on a phone — three left a dead field under the placeholder */}
				<textarea
					className='w-full resize-none bg-transparent px-3.5 pt-3 pb-1.5 text-[16px] text-ink leading-relaxed outline-none placeholder:text-ink-3 sm:min-h-[5.75rem] sm:px-4 sm:pt-3.5 sm:pb-2 sm:text-[17px]'
					disabled={props.isGenerating}
					id='prompt'
					maxLength={props.maxLength}
					onChange={(event) => props.onPromptChange(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t('pages.generate_image.prompt_example')}
					rows={2}
					value={props.prompt}
				/>

				<div className='flex flex-wrap items-center gap-2 px-1.5 pt-1 pb-1 sm:px-2'>
					<button className='pill h-9' disabled={props.isGenerating} onClick={props.onSurpriseMe} type='button'>
						<ShuffleIcon size={15} />
						{t('pages.generate_image.surprise_me')}
					</button>

					<div className='flex items-center gap-0.5 rounded-full bg-inset p-0.5'>
						{SIZE_OPTIONS.map((option) => (
							<button
								aria-label={`${t('pages.generate_image.size')} ${option}`}
								aria-pressed={props.size === option}
								className={`h-8 rounded-full px-3 font-mono text-[11px] transition-colors duration-150 ${
									props.size === option ? 'bg-brand-tint-strong text-brand' : 'text-ink-3 hover:text-ink-2'
								}`}
								disabled={props.isGenerating}
								key={option}
								onClick={() => props.onSizeChange(option)}
								type='button'
							>
								{option.split('x')[0]}
							</button>
						))}
					</div>

					<span className='ml-auto hidden font-mono text-[11px] text-ink-3 sm:block'>
						{props.prompt.length}/{props.maxLength}
					</span>

					<button
						className='flex h-9 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 font-medium text-[14px] text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-40 sm:w-auto'
						disabled={props.disabled || props.isGenerating}
						onClick={props.onGenerate}
						type='button'
					>
						{props.isGenerating && <Spinner size={14} />}
						{t(props.isGenerating ? 'pages.generate_image.generating' : 'pages.generate_image.generate')}
					</button>
				</div>
			</div>

			{props.error && <p className='mt-2.5 px-1 text-[13px] text-danger'>{props.error}</p>}
		</div>
	);
};

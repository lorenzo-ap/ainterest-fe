import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon, DownloadIcon, ExpandIcon } from '../../../components/ui';
import { useCurrentUser } from '../../../queries';
import { downloadImage } from '../../../utils';

const STATUS_KEYS = ['interpreting', 'composing', 'rendering', 'finishing'] as const;

/** Words that mark real progress — the model is doing something, so say what. */
const GenerationStatus = () => {
	const { t } = useTranslation();
	const [step, setStep] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setStep((previous) => Math.min(previous + 1, STATUS_KEYS.length - 1));
		}, 2600);

		return () => clearInterval(timer);
	}, []);

	return (
		<span className='font-mono text-[12px] text-ink-2 tracking-wider' key={step}>
			{t(`pages.generate_image.status.${STATUS_KEYS[step]}`)}
		</span>
	);
};

type GenerationCanvasProps = {
	image: string;
	prompt: string;
	isGenerating: boolean;
	isImageMissing: boolean;
	/** Leaves room for the result actions without pushing the composer away. */
	compact?: boolean;
};

export const GenerationCanvas = (props: GenerationCanvasProps) => {
	const { t } = useTranslation();
	const { data: currentUser } = useCurrentUser();

	const [expanded, setExpanded] = useState(false);

	const hasImage = Boolean(props.image);

	return (
		<>
			<figure
				className={`group relative aspect-square w-[min(100%,max(260px,var(--canvas-room)))] shrink-0 overflow-hidden rounded-lg border transition-all duration-500 ${
					props.compact
						? '[--canvas-room:calc(100dvh-560px)] md:[--canvas-room:calc(100dvh-480px)]'
						: '[--canvas-room:calc(100dvh-430px)] md:[--canvas-room:calc(100dvh-330px)]'
				} ${props.isImageMissing ? 'border-danger' : 'border-line'} ${hasImage ? 'bg-bg-deep' : 'bg-inset'}`}
			>
				{/* idle: a quiet, breathing field of brand light */}
				{!(hasImage || props.isGenerating) && (
					<>
						<div
							className='absolute top-1/2 left-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/45 blur-[70px] dark:bg-brand/60'
							style={{ animation: 'ai-breathe 6s ease-in-out infinite' }}
						/>
						<figcaption className='absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center'>
							<span className='eyebrow'>{t('pages.generate_image.canvas.empty_label')}</span>
							<span className='max-w-xs text-[14px] text-ink-3'>{t('pages.generate_image.canvas.empty_hint')}</span>
						</figcaption>
					</>
				)}

				{hasImage && (
					<img
						alt={props.prompt}
						className='h-full w-full animate-reveal object-cover'
						key={props.image}
						src={props.image}
					/>
				)}

				{/* generating: the canvas is being exposed, not spinning */}
				{props.isGenerating && (
					<div className='absolute inset-0 overflow-hidden bg-bg-deep/80 backdrop-blur-md'>
						<div
							className='absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-brand/20 to-transparent'
							style={{ animation: 'ai-sweep 2.6s var(--ease) infinite' }}
						/>
						<div
							className='absolute top-1/2 left-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/35 blur-[90px]'
							style={{ animation: 'ai-breathe 3.2s ease-in-out infinite' }}
						/>

						<div className='absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6'>
							<GenerationStatus />
							<div className='h-px w-full max-w-[220px] overflow-hidden bg-line'>
								<div className='h-full w-1/3 animate-shimmer bg-brand' />
							</div>
						</div>
					</div>
				)}

				{hasImage && !props.isGenerating && (
					<div className='absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-md:opacity-100'>
						<button
							aria-label={t('components.post_card.download_image')}
							className='flex h-9 w-9 items-center justify-center rounded-sm bg-black/45 text-white/90 backdrop-blur transition-colors hover:bg-black/65'
							onClick={() => downloadImage(props.prompt, props.image, currentUser?.username || '')}
							type='button'
						>
							<DownloadIcon size={17} />
						</button>
						<button
							aria-label={t('components.post_card.maximize_image')}
							className='flex h-9 w-9 items-center justify-center rounded-sm bg-black/45 text-white/90 backdrop-blur transition-colors hover:bg-black/65'
							onClick={() => setExpanded(true)}
							type='button'
						>
							<ExpandIcon size={17} />
						</button>
					</div>
				)}
			</figure>

			{props.isImageMissing && (
				<p className='mt-3 text-[13px] text-danger'>{t('pages.generate_image.errors.image_should_be_generated')}</p>
			)}

			{expanded && (
				<div className='fixed inset-0 z-[200] flex animate-fade items-center justify-center bg-bg-deep/95 p-6 backdrop-blur-xl'>
					<button
						aria-label={t('common.close')}
						className='absolute inset-0 h-full w-full cursor-zoom-out'
						onClick={() => setExpanded(false)}
						type='button'
					/>

					<button
						aria-label={t('common.close')}
						className='icon-btn absolute top-5 right-5 h-10 w-10'
						onClick={() => setExpanded(false)}
						type='button'
					>
						<CloseIcon size={20} />
					</button>

					<img
						alt={props.prompt}
						className='pointer-events-none relative max-h-full max-w-full animate-reveal rounded-md object-contain shadow-float'
						src={props.image}
					/>
				</div>
			)}
		</>
	);
};

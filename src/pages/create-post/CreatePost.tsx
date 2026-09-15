import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppButton, ShareIcon } from '../../components/ui';
import { useFormValidation } from '../../hooks';
import { useCreatePost, useGenerateImage } from '../../queries';
import { toastService } from '../../services';
import type { CreatePostForm } from '../../types';
import { getRandomPrompt } from '../../utils';
import { GenerationCanvas, PromptComposer } from './components';

const PROMPT_MIN_LENGTH = 5;
const PROMPT_MAX_LENGTH = 200;

export const CreatePostPage = () => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const [isImageMissing, setIsImageMissing] = useState(false);

	const { mutate: generateImage, isPending: isGenerating } = useGenerateImage({
		onSuccess: (res, variables) => {
			form.setFieldValue('postGeneratedImage', { prompt: variables.text, photo: res.image });
			setIsImageMissing(false);
		},
		onError: (err) => {
			if (!err.response?.data.nsfw) return;
			toastService.error(t('apis.generate.error'));
		}
	});

	const { mutate: createPost, isPending: isSharing } = useCreatePost({
		onSuccess: () => {
			navigate('/');
			toastService.success(t('apis.post.success'));
		}
	});

	const form = useForm<CreatePostForm>({
		mode: 'controlled',
		initialValues: {
			prompt: '',
			size: '512x512',
			postGeneratedImage: {
				prompt: '',
				photo: ''
			}
		},

		validate: {
			prompt: (value) => {
				const trimmed = value.trim();
				if (!trimmed) return t('pages.generate_image.errors.prompt.required');
				if (trimmed.length < PROMPT_MIN_LENGTH) return t('pages.generate_image.errors.prompt.min_length');
				if (trimmed.length > PROMPT_MAX_LENGTH) return t('pages.generate_image.errors.prompt.max_length');
			},
			size: (value) => (value ? undefined : t('pages.generate_image.errors.size.required'))
		}
	});

	useFormValidation(form, i18n);

	const values = form.getValues();
	const generated = values.postGeneratedImage;
	const hasResult = Boolean(generated.photo);

	const handleSurpriseMe = () => {
		form.setFieldValue('prompt', getRandomPrompt(values.prompt));
		form.clearFieldError('prompt');
	};

	const onGenerate = () => {
		setIsImageMissing(false);

		const validation = form.validate();
		if (validation.hasErrors) return;

		const { prompt, size: sizeStr } = form.getValues();
		const size = Number.parseInt(sizeStr.split('x')[0], 10);

		generateImage({ text: prompt, size });
	};

	const onShare = () => {
		if (!generated.photo) {
			form.clearErrors();
			setIsImageMissing(true);
			return;
		}

		setIsImageMissing(false);
		createPost(generated);
	};

	return (
		<div className='mx-auto flex min-h-[calc(100dvh-var(--header-total)-var(--tabbar-total))] w-full max-w-[1120px] flex-col px-5 pt-4 pb-8 sm:px-8 md:min-h-[calc(100dvh-var(--header-total))]'>
			{/* phone: canvas near the top, composer anchored at the bottom. Centring it
			    instead left the artwork floating in the middle of two voids. */}
			<div className='flex flex-1 flex-col items-center justify-start gap-4 py-2 sm:justify-center'>
				<GenerationCanvas
					compact={hasResult}
					image={generated.photo}
					isGenerating={isGenerating}
					isImageMissing={isImageMissing}
					prompt={generated.prompt || values.prompt}
				/>

				{hasResult && !isGenerating && (
					<div className='flex w-full max-w-[520px] animate-rise flex-col items-center gap-3'>
						<p className='max-w-full truncate text-center font-mono text-[12px] text-ink-3'>{generated.prompt}</p>

						<AppButton
							className='max-sm:w-full'
							leftIcon={<ShareIcon size={17} />}
							loading={isSharing}
							onClick={onShare}
						>
							{t('pages.generate_image.share')}
						</AppButton>
					</div>
				)}
			</div>

			<div className='flex justify-center'>
				<div className='w-full max-w-[860px]'>
					<PromptComposer
						disabled={isSharing}
						error={form.errors.prompt as string | undefined}
						isGenerating={isGenerating}
						maxLength={PROMPT_MAX_LENGTH}
						onGenerate={onGenerate}
						onPromptChange={(value) => {
							form.setFieldValue('prompt', value);
							form.clearFieldError('prompt');
						}}
						onSizeChange={(value) => form.setFieldValue('size', value)}
						onSurpriseMe={handleSurpriseMe}
						prompt={values.prompt}
						size={values.size}
					/>
				</div>
			</div>
		</div>
	);
};

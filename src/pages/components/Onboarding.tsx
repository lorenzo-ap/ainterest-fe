import { Modal } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../components/ui';
import { routes } from '../../constants';
import { useAuthModals, useOnboarding } from '../../providers';
import { postKeys, useCurrentUser } from '../../queries';
import type { PostModel } from '../../types';

const STEPS = ['explore', 'create', 'share'] as const;

export const Onboarding = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { opened, close } = useOnboarding();
	const { openSignIn } = useAuthModals();
	const { data: currentUser } = useCurrentUser();

	const [step, setStep] = useState(0);

	// read whatever the feed already loaded; never fetch just for this
	const posts = queryClient.getQueryData<PostModel[]>(postKeys.posts) ?? [];
	const artwork = posts[step]?.photo;

	const isLast = step === STEPS.length - 1;

	const finish = () => {
		close();
		setStep(0);
	};

	const startCreating = () => {
		finish();

		if (currentUser) {
			navigate(routes.create);
			return;
		}

		openSignIn();
	};

	return (
		<Modal onClose={finish} opened={opened} padding={0} size={520} withCloseButton={false}>
			<div className='relative aspect-[16/9] overflow-hidden bg-bg-deep'>
				{artwork ? (
					<img alt='' aria-hidden className='h-full w-full animate-fade object-cover' key={artwork} src={artwork} />
				) : (
					// no feed loaded yet — a wash of the brand instead of an empty slab
					<div className='h-full w-full bg-gradient-to-br from-brand/35 via-brand/10 to-transparent' />
				)}

				<div className='absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent' />
			</div>

			<div className='relative -mt-8 px-7 pb-7'>
				<p className='eyebrow'>
					{step + 1} / {STEPS.length}
				</p>

				<h2 className='mt-3 font-display text-[2rem] text-ink leading-tight'>
					{t(`components.onboarding.${STEPS[step]}.title`)}
				</h2>

				<p className='mt-2.5 min-h-[3.25rem] max-w-sm text-[15px] text-ink-2 leading-relaxed'>
					{t(`components.onboarding.${STEPS[step]}.body`)}
				</p>

				<div className='mt-7 flex items-center justify-between gap-4'>
					<div className='flex items-center gap-1.5'>
						{STEPS.map((name, index) => (
							<span
								className={`h-1.5 rounded-full transition-all duration-300 ${
									index === step ? 'w-5 bg-brand' : 'w-1.5 bg-line-strong'
								}`}
								key={name}
							/>
						))}
					</div>

					<div className='flex items-center gap-2'>
						{!isLast && (
							<AppButton onClick={finish} variant='ghost'>
								{t('components.onboarding.skip')}
							</AppButton>
						)}

						<AppButton onClick={isLast ? startCreating : () => setStep((previous) => previous + 1)}>
							{t(isLast ? 'components.onboarding.start' : 'common.continue')}
						</AppButton>
					</div>
				</div>
			</div>
		</Modal>
	);
};

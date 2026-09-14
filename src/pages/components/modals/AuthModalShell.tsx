import { Modal } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon, Wordmark } from '../../../components/ui';

type AuthModalShellProps = PropsWithChildren<{
	opened: boolean;
	onClose: () => void;
	title: string;
	description: string;
}>;

/**
 * One frame for every authentication moment: brand, a plain-spoken title,
 * and nothing else competing with the form.
 */
export const AuthModalShell = ({ opened, onClose, title, description, children }: AuthModalShellProps) => {
	const { t } = useTranslation();

	return (
		<Modal onClose={onClose} opened={opened} padding={0} size={440} withCloseButton={false}>
			<div className='relative px-7 pt-8 pb-9'>
				<button
					aria-label={t('common.close')}
					className='icon-btn absolute top-5 right-5 h-8 w-8'
					onClick={onClose}
					type='button'
				>
					<CloseIcon size={17} />
				</button>

				<header className='mb-7'>
					<Wordmark className='!text-[15px]' />
					<h2 className='mt-5 font-display text-[2rem] text-ink leading-tight'>{title}</h2>
					<p className='mt-2 text-[14px] text-ink-3 leading-relaxed'>{description}</p>
				</header>

				{children}
			</div>
		</Modal>
	);
};

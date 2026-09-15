import { Drawer, Popover } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { QueryBoundary } from '../../../components';
import { BellIcon } from '../../../components/ui';
import { NotificationDropdown, NotificationsSkeleton, NotificationsUnreadCount } from '.';

export const Notifications = () => {
	const { t } = useTranslation();
	const isMobile = useMediaQuery('(max-width: 767px)');
	const [opened, { open, close, toggle }] = useDisclosure(false);

	const trigger = (
		<button
			aria-label={t('pages.components.header.notifications')}
			className='icon-btn relative h-9 w-9'
			onClick={isMobile ? open : toggle}
			type='button'
		>
			<BellIcon size={19} />

			<QueryBoundary error={() => null} loading={null}>
				<NotificationsUnreadCount />
			</QueryBoundary>
		</button>
	);

	const panel = (
		<QueryBoundary
			error={(retry) => (
				<div className='flex w-full flex-col items-center gap-3 px-6 py-12 text-center md:w-96'>
					<p className='text-[14px] text-ink-3'>{t('components.error_state.notifications')}</p>
					<button className='text-[13px] text-brand transition-opacity hover:opacity-70' onClick={retry} type='button'>
						{t('components.error_state.retry')}
					</button>
				</div>
			)}
			loading={<NotificationsSkeleton fullWidth={isMobile} />}
		>
			<NotificationDropdown fullWidth={isMobile} onNavigate={close} />
		</QueryBoundary>
	);

	if (isMobile) {
		return (
			<>
				{trigger}

				<Drawer
					/*
					  Hug the list. Mantine sizes a bottom drawer by flex-basis, so the sheet
					  keeps its full height unless the basis is released too — and three
					  notifications in a full-height sheet is mostly empty surface.
					*/
					classNames={{ content: 'rounded-t-xl bg-surface !h-auto !max-h-[85%] !flex-none', body: 'p-0' }}
					onClose={close}
					opened={opened}
					padding={0}
					position='bottom'
					withCloseButton={false}
				>
					<div className='mx-auto mt-2.5 h-1 w-9 rounded-full bg-line-strong' />
					{panel}
				</Drawer>
			</>
		);
	}

	return (
		<Popover offset={10} onChange={(value) => !value && close()} opened={opened} position='bottom-end' shadow='lg'>
			<Popover.Target>{trigger}</Popover.Target>

			<Popover.Dropdown className='p-0'>{panel}</Popover.Dropdown>
		</Popover>
	);
};

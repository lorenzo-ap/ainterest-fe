import { useTranslation } from 'react-i18next';

export const NotificationsSkeleton = ({ fullWidth }: { fullWidth?: boolean }) => {
	const { t } = useTranslation();

	return (
		<div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-96'}`}>
			<header className='px-4 pt-4 pb-3'>
				<h3 className='eyebrow'>{t('pages.components.notifications.title')}</h3>
			</header>

			<div className='flex flex-col gap-1 px-2 pb-2'>
				{[1, 2, 3].map((item) => (
					<div className='flex items-center gap-3 px-2 py-2.5' key={item}>
						<div className='h-9 w-9 shrink-0 rounded-full bg-inset' />
						<div className='flex-1 space-y-2'>
							<div className='h-3 w-4/5 rounded-full bg-inset' />
							<div className='h-2.5 w-1/3 rounded-full bg-inset' />
						</div>
						<div className='h-11 w-11 shrink-0 rounded-sm bg-inset' />
					</div>
				))}
			</div>
		</div>
	);
};

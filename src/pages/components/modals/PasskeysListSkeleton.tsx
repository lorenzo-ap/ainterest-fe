import { Divider, Skeleton } from '@mantine/core';
import { Fragment } from 'react';

export const PasskeysListSkeleton = () => {
	return (
		<div className='overflow-hidden rounded-xl border border-color'>
			{[1, 2, 3].map((item, index) => (
				<Fragment key={item}>
					<div className='flex items-center justify-between p-3.5'>
						<div className='flex items-center gap-3'>
							<Skeleton height={32} radius='md' width={32} />
							<div className='space-y-1.5'>
								<Skeleton height={14} radius='sm' width={140} />
								<Skeleton height={12} radius='sm' width={100} />
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='flex flex-col items-end space-y-1.5 max-sm:hidden'>
								<Skeleton height={10} radius='sm' width={50} />
								<Skeleton height={12} radius='sm' width={80} />
							</div>
							<Skeleton height={28} radius='md' width={28} />
						</div>
					</div>
					{index < 2 && <Divider />}
				</Fragment>
			))}
		</div>
	);
};

export const PasskeysListSkeleton = () => (
	<ul className='flex flex-col gap-2'>
		{[1, 2].map((item) => (
			<li className='rounded-md bg-inset px-4 py-3.5' key={item}>
				<div className='h-3.5 w-32 rounded-full bg-hover' />
				<div className='mt-2.5 h-2.5 w-40 rounded-full bg-hover' />
			</li>
		))}
	</ul>
);

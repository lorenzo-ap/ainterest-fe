import { Title } from '@mantine/core';

export const ErrorPage = () => {
	return (
		<div className='flex h-[calc(100vh-141px)] items-center justify-center'>
			<Title c='violet' order={1} size={140}>
				404
			</Title>
		</div>
	);
};

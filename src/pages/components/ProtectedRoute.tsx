import { Button, Loader, Text, Title } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../queries';

export const ProtectedRoute = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

	if (isCurrentUserLoading) {
		return <Loader className='mx-auto mt-24 block' color='violet' size='lg' />;
	}

	if (!currentUser) {
		return (
			<div className='flex min-h-[calc(100vh-200px)] items-center justify-center'>
				<div className='max-w-md rounded-md p-12 text-center'>
					<IconLock className='mx-auto mb-4' color='#7950F2' size={64} stroke={1.5} />
					<Title className='mb-3' order={2}>
						{t('pages.components.protected_route.title')}
					</Title>
					<Text c='dimmed' className='mb-6' size='md'>
						{t('pages.components.protected_route.description')}
					</Text>
					<Button color='violet' onClick={() => navigate('/')} size='md'>
						{t('pages.components.protected_route.go_to_home')}
					</Button>
				</div>
			</div>
		);
	}

	return <Outlet />;
};

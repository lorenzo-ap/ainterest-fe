import { Button, Loader, Text, Title } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectAuthLoading, selectLoggedUser } from '../../redux/selectors';

export const ProtectedRoute = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectLoggedUser);

  if (isAuthLoading) {
    return <Loader color='violet' size='lg' className='mx-auto mt-24 block' />;
  }

  if (!user) {
    return (
      <div className='flex min-h-[calc(100vh-200px)] items-center justify-center'>
        <div className='max-w-md rounded-md p-12 text-center'>
          <IconLock size={64} className='mx-auto mb-4' stroke={1.5} color='#7950F2' />
          <Title order={2} className='mb-3'>
            {t('pages.components.protected_route.title')}
          </Title>
          <Text size='md' c='dimmed' className='mb-6'>
            {t('pages.components.protected_route.description')}
          </Text>
          <Button color='violet' size='md' onClick={() => navigate('/')}>
            {t('pages.components.protected_route.go_to_home')}
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

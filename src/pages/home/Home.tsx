import { Text, Title } from '@mantine/core';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PostsSkeleton, ScrollToTopButton } from '../../components';
import { HomePosts } from './components';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-start justify-between gap-5 md:flex-row'>
          <div>
            <Title>{t('pages.home.heading')}</Title>

            <Text className='mt-2 opacity-60'>{t('pages.home.subheading')}</Text>
          </div>
        </div>

        <Suspense fallback={<PostsSkeleton />}>
          <HomePosts />
        </Suspense>
      </div>

      <ScrollToTopButton />
    </>
  );
};

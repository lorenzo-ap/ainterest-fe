import { Divider, Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const NotificationsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className='flex max-h-[32rem] w-96 flex-col max-xs:w-[calc(100vw-2rem)]'>
      <div className='flex items-center justify-between px-4 py-3'>
        <h3 className='text-lg font-semibold'>{t('pages.components.notifications.title')}</h3>
      </div>

      <Divider />

      <div className='flex-1'>
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div className='flex items-center gap-3 p-3'>
              <Skeleton height={40} width={40} circle className='flex-shrink-0' />

              <div className='min-w-0 flex-1 space-y-2'>
                <div className='mt-1 space-y-3'>
                  <Skeleton height={14} width='55%' radius='sm' />
                  <Skeleton height={14} width='70%' radius='sm' className='xxs:hidden' />
                  <Skeleton height={12} width='40%' radius='sm' />
                </div>
              </div>

              <Skeleton height={48} width={48} radius='sm' className='flex-shrink-0' />
            </div>

            {item < 3 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

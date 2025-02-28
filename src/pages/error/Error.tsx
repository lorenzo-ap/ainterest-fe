import { Title } from '@mantine/core';

export const ErrorPage = () => {
  return (
    <div className='flex h-[calc(100vh-141px)] items-center justify-center'>
      <Title order={1} size={140} c='violet'>
        404
      </Title>
    </div>
  );
};

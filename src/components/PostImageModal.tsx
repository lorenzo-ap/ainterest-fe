import { ActionIcon, Modal } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface PostImageModalProps {
  opened: boolean;
  image: string;
  alt: string;
  close: () => void;
}

export const PostImageModal = (props: PostImageModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      centered
      radius='md'
      size='xl'
      padding={0}
      withCloseButton={false}
    >
      <ActionIcon
        className='absolute right-4 top-4'
        variant='default'
        size={24}
        onClick={props.close}
        aria-label={t('common.close')}
      >
        <IconX size={22} />
      </ActionIcon>

      <img className='w-full' src={props.image} alt={props.alt} />
    </Modal>
  );
};

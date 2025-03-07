import { Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string;
  confirm: () => void;
  close: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmModal = ({
  opened,
  title,
  message,
  confirm,
  close,
  confirmLabel = 'common.continue',
  cancelLabel = 'common.cancel'
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={<Text className='text-center text-2xl font-bold'>{title}</Text>}
      radius='md'
      padding='lg'
    >
      <Text className='mb-5' c='dimmed'>
        {t(message)}
      </Text>

      <div className='flex items-center justify-end gap-x-3'>
        <Button variant='subtle' color='red' onClick={close}>
          {t(cancelLabel)}
        </Button>

        <Button color='teal' onClick={confirm}>
          {t(confirmLabel)}
        </Button>
      </div>
    </Modal>
  );
};

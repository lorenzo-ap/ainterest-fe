import { Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string;
  confirm: () => void;
  close: () => void;
  confirmLabel: string;
  cancelLabel: string;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      title={<Text className='text-center text-2xl font-bold'>{props.title}</Text>}
      radius='md'
      padding='lg'
    >
      <Text className='mb-5' c='dimmed'>
        {t(props.message)}
      </Text>

      <div className='flex items-center justify-end gap-x-3'>
        <Button variant='subtle' color='red' onClick={props.close}>
          {t(props.cancelLabel || 'common.cancel')}
        </Button>

        <Button color='teal' onClick={props.confirm}>
          {t(props.confirmLabel || 'common.continue')}
        </Button>
      </div>
    </Modal>
  );
};

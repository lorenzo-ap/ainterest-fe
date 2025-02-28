import { Button, Modal, Text } from '@mantine/core';

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
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel'
}: ConfirmModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={<Text className='text-center text-2xl font-bold'>{title}</Text>}
      radius='md'
      padding='lg'
    >
      <Text className='mb-5' c='dimmed'>
        {message}
      </Text>

      <div className='flex items-center justify-end gap-x-3'>
        <Button variant='subtle' color='red' onClick={close}>
          {cancelLabel}
        </Button>

        <Button color='teal' onClick={confirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

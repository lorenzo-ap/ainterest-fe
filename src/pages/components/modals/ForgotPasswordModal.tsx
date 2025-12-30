import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '../../../hooks';
import { useForgotPassword } from '../../../queries';
import { toastService } from '../../../services';
import { ForgotPasswordForm } from '../../../types';

interface ForgotPasswordModalProps {
  opened: boolean;
  close: () => void;
  openSignInModal: () => void;
}

export const ForgotPasswordModal = (props: ForgotPasswordModalProps) => {
  const { t, i18n } = useTranslation();

  const form = useForm<ForgotPasswordForm>({
    mode: 'uncontrolled',
    initialValues: {
      email: ''
    },

    validate: {
      email: (value) => {
        if (!value) {
          return t('pages.components.modals.forgot_password.errors.email.required');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          return t('pages.components.modals.forgot_password.errors.email.invalid');
        }
      }
    }
  });

  useFormValidation(form, i18n);

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => {
      closeModal();
      toastService.success(t('apis.auth.success_forgot_password'));
    }
  });

  const closeModal = () => {
    props.close();
    form.reset();
  };

  const submit = (values: ForgotPasswordForm) => {
    forgotPassword(values);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={closeModal}
      title={<Text className='text-center text-2xl font-bold'>{t('common.forgot_password')}</Text>}
      radius='md'
      padding='lg'
    >
      <form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <TextInput size='md' label={t('common.email')} key={form.key('email')} {...form.getInputProps('email')} />

        <Button className='mt-2' color='violet' size='md' type='submit' loading={isPending}>
          {t('pages.components.modals.forgot_password.send_reset_link')}
        </Button>
      </form>

      <Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
        <Button
          className='p-0 hover:opacity-80'
          color='violet'
          variant='transparent'
          onClick={() => {
            closeModal();
            props.openSignInModal();
          }}
        >
          {t('pages.components.modals.forgot_password.back_to_sign_in')}
        </Button>
      </Text>
    </Modal>
  );
};

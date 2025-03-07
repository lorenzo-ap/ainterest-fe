import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../../services/auth';
import { toastService } from '../../../services/toast';
import { SignInForm } from '../../../types';

interface SignInModalProps {
  opened: boolean;
  close: () => void;
  openSignUpModal: () => void;
}

export const SignInModal = (props: SignInModalProps) => {
  const { t } = useTranslation();

  const form = useForm<SignInForm>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => {
        if (!value) {
          return t('pages.components.modals.sign_in.errors.email.required');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          return t('pages.components.modals.sign_in.errors.email.invalid');
        }
      },
      password: (value) => {
        if (!value) return t('pages.components.modals.sign_in.errors.password.required');
      }
    }
  });

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    props.close();
    form.reset();
  };

  const submit = (values: SignInForm) => {
    setLoading(true);

    authService
      .signIn(values)
      .then(() => {
        closeModal();

        toastService.success(t('apis.auth.success_sign_in'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={props.opened}
      onClose={closeModal}
      title={<Text className='text-center text-2xl font-bold'>{t('common.sign_in')}</Text>}
      radius='md'
      padding='lg'
    >
      <form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <TextInput label={t('common.email')} key={form.key('email')} {...form.getInputProps('email')} />
        <TextInput
          label={t('common.password')}
          type='password'
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button className='mt-2' color='teal' size='sm' type='submit' loading={loading}>
          {t('common.sign_in')}
        </Button>
      </form>

      <Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
        <span>{t('pages.components.modals.sign_in.dont_have_an_account')}</span>{' '}
        <Button
          className='p-0 underline-offset-2 hover:underline'
          color='teal'
          variant='transparent'
          onClick={() => {
            closeModal();
            props.openSignUpModal();
          }}
        >
          {t('common.sign_up')}
        </Button>
      </Text>
    </Modal>
  );
};

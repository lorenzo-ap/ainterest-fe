import { Button, Divider, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { useFormValidation } from '../../../hooks';
import { notificationKeys, useSignIn } from '../../../queries';
import { toastService } from '../../../services';
import { SignInForm } from '../../../types';

interface SignInModalProps {
  opened: boolean;
  close: () => void;
  openSignUpModal: () => void;
  openForgotPasswordModal: () => void;
}

export const SignInModal = (props: SignInModalProps) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

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

  useFormValidation(form, i18n);

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      closeModal();
      toastService.success(t('apis.auth.success_sign_in'));
      queryClient.invalidateQueries({
        queryKey: notificationKeys.notifications
      });
    }
  });

  const closeModal = () => {
    props.close();
    form.reset();
  };

  const submit = (values: SignInForm) => {
    signIn(values);
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
        <TextInput size='md' label={t('common.email')} key={form.key('email')} {...form.getInputProps('email')} />
        <PasswordInput
          size='md'
          label={t('common.password')}
          key={form.key('password')}
          {...form.getInputProps('password')}
          inputContainer={(children) => (
            <>
              {children}

              <Button
                className='absolute right-0 top-0 h-[1.563rem] p-0 text-xs font-medium hover:opacity-80'
                color='violet'
                variant='transparent'
                onClick={() => {
                  closeModal();
                  props.openForgotPasswordModal();
                }}
              >
                {t('pages.components.modals.sign_in.forgot_password')}
              </Button>
            </>
          )}
          className='relative'
        />

        <Button className='mt-2' color='violet' size='md' type='submit' loading={isPending}>
          {t('common.sign_in')}
        </Button>
      </form>

      <Divider label={t('pages.components.modals.sign_in.or_continue_with')} labelPosition='center' className='my-4' />

      <GoogleSignInButton onSuccess={closeModal} />

      <Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
        <span>{t('pages.components.modals.sign_in.dont_have_an_account')}</span>{' '}
        <Button
          className='p-0 hover:opacity-80'
          color='violet'
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

import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '../../../hooks';
import { authService } from '../../../services/auth';
import { toastService } from '../../../services/toast';
import { SignUpForm } from '../../../types';

interface SignUpModalProps {
  opened: boolean;
  close: () => void;
  openSignInModal: () => void;
}

export const SignUpModal = (props: SignUpModalProps) => {
  const { t, i18n } = useTranslation();

  const form = useForm<SignUpForm>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },

    validate: {
      username: (value) => {
        if (!value.trim()) {
          return t('pages.components.modals.sign_up.errors.username.required');
        }

        if (value.length < 3) {
          return t('pages.components.modals.sign_up.errors.username.minLength');
        }

        if (value.length > 20) {
          return t('pages.components.modals.sign_up.errors.username.maxLength');
        }
      },
      email: (value) => {
        if (!value) {
          return t('pages.components.modals.sign_up.errors.email.required');
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          return t('pages.components.modals.sign_up.errors.email.invalid');
        }
      },
      password: (value) => {
        if (!value) return t('pages.components.modals.sign_up.errors.password.required');

        const requirements = [
          { re: /.{8}/, key: 'minLength' },
          { re: /[A-Z]/, key: 'uppercase' },
          { re: /[a-z]/, key: 'lowercase' },
          { re: /[0-9]/, key: 'number' },
          { re: /[!@#$%^&*]/, key: 'special' }
        ];

        const failed = requirements.find((req) => !req.re.test(value));
        return failed ? t(`pages.components.modals.sign_up.errors.password.requirements.${failed.key}`) : null;
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return t('pages.components.modals.sign_up.errors.confirmPassword.required');
        }

        if (value !== values.password) {
          return t('pages.components.modals.sign_up.errors.confirmPassword.mismatch');
        }
      }
    }
  });

  const [loading, setLoading] = useState(false);

  useFormValidation(form, i18n);

  const closeModal = () => {
    props.close();
    form.reset();
  };

  const submit = (values: SignUpForm) => {
    setLoading(true);

    authService
      .signUp(values)
      .then(() => {
        closeModal();

        toastService.success(t('apis.auth.success_sign_up'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={props.opened}
      onClose={closeModal}
      title={<Text className='text-center text-2xl font-bold'>{t('common.sign_up')}</Text>}
      radius='md'
      padding='lg'
    >
      <form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <TextInput label={t('common.username')} key={form.key('username')} {...form.getInputProps('username')} />
        <TextInput label={t('common.email')} key={form.key('email')} {...form.getInputProps('email')} />
        <TextInput
          label={t('common.password')}
          type='password'
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <TextInput
          label={t('common.confirm_password')}
          type='password'
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button className='mt-2' color='teal' size='sm' type='submit' loading={loading}>
          {t('common.sign_up')}
        </Button>
      </form>

      <Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
        <span>{t('pages.components.modals.sign_up.already_have_an_account')}</span>{' '}
        <Button
          className='p-0 underline-offset-2 hover:underline'
          color='teal'
          variant='transparent'
          onClick={() => {
            closeModal();
            props.openSignInModal();
          }}
        >
          {t('common.sign_in')}
        </Button>
      </Text>
    </Modal>
  );
};

import { Button, Container, PasswordInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormValidation } from '../../hooks';
import { useResetPassword } from '../../queries';
import { toastService } from '../../services';
import { ResetPasswordForm } from '../../types';

export const ResetPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const params = useParams<{ token: string }>();

  useEffect(() => {
    if (!params.token) {
      toastService.error(t('pages.reset_password.errors.invalid_token'));
      navigate('/');
    }
  }, [params.token, navigate, t]);

  const form = useForm<ResetPasswordForm>({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: ''
    },

    validate: {
      password: (value) => {
        if (!value) return t('pages.reset_password.errors.password.required');

        const requirements = [
          { re: /.{8}/, key: 'minLength' },
          { re: /[A-Z]/, key: 'uppercase' },
          { re: /[a-z]/, key: 'lowercase' },
          { re: /[0-9]/, key: 'number' },
          { re: /[!@#$%^&*]/, key: 'special' }
        ];

        const failed = requirements.find((req) => !req.re.test(value));
        return failed ? t(`pages.reset_password.errors.password.requirements.${failed.key}`) : null;
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return t('pages.reset_password.errors.confirmPassword.required');
        }

        if (value !== values.password) {
          return t('pages.reset_password.errors.confirmPassword.mismatch');
        }
      }
    }
  });

  useFormValidation(form, i18n);

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      toastService.success(t('apis.auth.success_reset_password'));
      navigate('/');
    }
  });

  const submit = (values: ResetPasswordForm) => {
    if (!params.token) return;
    resetPassword({ token: params.token, ...values });
  };

  return (
    <Container size='xs' className='py-12'>
      <Text className='mb-2 text-center text-3xl font-bold'>{t('pages.reset_password.title')}</Text>
      <Text size='sm' c='dimmed' className='mb-6 text-center'>
        {t('pages.reset_password.description')}
      </Text>

      <form className='mx-auto flex max-w-screen-xxs flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <PasswordInput
          size='md'
          label={t('pages.reset_password.new_password')}
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          size='md'
          label={t('pages.reset_password.confirm_new_password')}
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button className='mt-2' color='violet' size='md' type='submit' loading={isPending}>
          {t('pages.reset_password.reset_password')}
        </Button>
      </form>
    </Container>
  );
};

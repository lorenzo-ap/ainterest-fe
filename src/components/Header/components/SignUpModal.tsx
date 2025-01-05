import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { authService } from '../../../services/auth';
import { toastService } from '../../../services/toast';

interface SignUpModalProps {
  opened: boolean;
  close: () => void;
  openSignInModal: () => void;
}

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpModal = ({ opened, close, openSignInModal }: SignUpModalProps) => {
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
          return 'Username is required';
        }

        if (value.length < 3) {
          return 'Username should be at least 3 characters long';
        }

        if (value.length > 20) {
          return 'Username should be at most 20 characters long';
        }
      },
      email: (value) => {
        if (!value) {
          return 'Email is required';
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          return 'Invalid email address';
        }
      },
      password: (value) => {
        if (!value) return 'Password is required';

        const requirements = [
          { re: /.{8}/, label: 'Password must be at least 8 characters long' },
          { re: /[A-Z]/, label: 'Must contain uppercase letter' },
          { re: /[a-z]/, label: 'Must contain lowercase letter' },
          { re: /[0-9]/, label: 'Must contain number' },
          { re: /[!@#$%^&*]/, label: 'Must contain special character (!@#$%^&*)' }
        ];

        const failed = requirements.find((req) => !req.re.test(value));
        return failed ? failed.label : null;
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return 'Please confirm your password';
        }

        if (value !== values.password) {
          return 'Passwords do not match';
        }
      }
    }
  });

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    close();
    form.reset();
  };

  const submit = (values: SignUpForm) => {
    setLoading(true);

    authService
      .signUp(values)
      .then(() => {
        closeModal();

        toastService.success('Signed up successfully');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title={<Text className='text-center text-2xl font-bold'>Sign Up</Text>}
      radius='md'
      padding='lg'
    >
      <form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <TextInput label='Username' key={form.key('username')} {...form.getInputProps('username')} />

        <TextInput label='Email' key={form.key('email')} {...form.getInputProps('email')} />

        <TextInput label='Password' type='password' key={form.key('password')} {...form.getInputProps('password')} />

        <TextInput
          label='Confirm password'
          type='password'
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button className='mt-2' color='teal' size='sm' type='submit' loading={loading}>
          Sign Up
        </Button>
      </form>

      <Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
        <span>Already have an account?</span>{' '}
        <Button
          className='p-0 underline-offset-2 hover:underline'
          color='teal'
          variant='transparent'
          onClick={() => {
            closeModal();
            openSignInModal();
          }}
        >
          Sign In
        </Button>
      </Text>
    </Modal>
  );
};

export default SignUpModal;

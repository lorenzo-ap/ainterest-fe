import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface SignInModalProps {
  opened: boolean;
  close: () => void;
  openSignUpModal: () => void;
}

export interface SignInForm {
  username: string;
  password: string;
}

const SignInModal = ({ opened, close, openSignUpModal }: SignInModalProps) => {
  const form = useForm<SignInForm>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: ''
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
      }
    }
  });

  const closeModal = () => {
    close();
    form.reset();
  };

  const submit = (values: SignInForm) => {
    console.log(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title={<Text className='text-center text-2xl font-bold'>Sign In</Text>}
      centered
      radius={10}
      padding={20}
    >
      <form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
        <TextInput label='Username' key={form.key('username')} {...form.getInputProps('username')} />
        <TextInput label='Password' type='password' key={form.key('password')} {...form.getInputProps('password')} />
        <Button className='mt-1' color='teal' size='sm' type='submit'>
          Sign In
        </Button>
      </form>

      <Text className='mt-3 flex items-center justify-center gap-x-1' size='sm'>
        <span>Don't have an account?</span>{' '}
        <Button
          className='p-0 underline-offset-2 hover:underline'
          color='teal'
          variant='transparent'
          onClick={() => {
            closeModal();
            openSignUpModal();
          }}
        >
          Sign up
        </Button>
      </Text>
    </Modal>
  );
};

export default SignInModal;

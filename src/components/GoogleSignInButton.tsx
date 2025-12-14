import { Button } from '@mantine/core';
import { GoogleLogin } from '@react-oauth/google';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleSignIn } from '../queries';
import { toastService } from '../services/toast';

type GoogleSignInButtonProps = {
  onSuccess: () => void;
};

export const GoogleSignInButton = ({ onSuccess }: GoogleSignInButtonProps) => {
  const { t } = useTranslation();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const { mutate: googleSignIn, isPending } = useGoogleSignIn({
    onSuccess: () => {
      onSuccess();
      toastService.success(t('apis.auth.success_sign_in'));
    }
  });

  const handleCustomButtonClick = () => {
    const button = googleButtonRef.current?.querySelector('[role="button"]') as HTMLElement;
    if (!button) return;
    button.click();
  };

  return (
    <>
      <Button
        variant='default'
        size='md'
        leftSection={<IconBrandGoogleFilled size={20} />}
        onClick={handleCustomButtonClick}
        loading={isPending}
        fullWidth
      >
        Continue with Google
      </Button>

      <div ref={googleButtonRef} className='hidden'>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) return;
            googleSignIn(credentialResponse.credential);
          }}
        />
      </div>
    </>
  );
};

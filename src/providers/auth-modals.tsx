import { useDisclosure } from '@mantine/hooks';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import { ForgotPasswordModal, SignInModal, SignUpModal } from '../pages/components/modals';

type AuthModalsContextValue = {
	openSignIn: () => void;
	openSignUp: () => void;
	openForgotPassword: () => void;
};

const AuthModalsContext = createContext<AuthModalsContextValue | null>(null);

/**
 * Auth lives in modals that can be summoned from anywhere: the header, the
 * mobile tab bar, a locked page, or a guest tapping "like" on someone's work.
 */
export const AuthModalsProvider = ({ children }: PropsWithChildren) => {
	const [signInOpened, signIn] = useDisclosure(false);
	const [signUpOpened, signUp] = useDisclosure(false);
	const [forgotPasswordOpened, forgotPassword] = useDisclosure(false);

	const value = useMemo(
		() => ({
			openSignIn: signIn.open,
			openSignUp: signUp.open,
			openForgotPassword: forgotPassword.open
		}),
		[signIn.open, signUp.open, forgotPassword.open]
	);

	return (
		<AuthModalsContext.Provider value={value}>
			{children}

			<SignInModal
				close={signIn.close}
				opened={signInOpened}
				openForgotPasswordModal={forgotPassword.open}
				openSignUpModal={signUp.open}
			/>
			<SignUpModal close={signUp.close} opened={signUpOpened} openSignInModal={signIn.open} />
			<ForgotPasswordModal close={forgotPassword.close} opened={forgotPasswordOpened} openSignInModal={signIn.open} />
		</AuthModalsContext.Provider>
	);
};

export const useAuthModals = () => {
	const context = useContext(AuthModalsContext);

	if (!context) {
		throw new Error('useAuthModals must be used within an AuthModalsProvider');
	}

	return context;
};

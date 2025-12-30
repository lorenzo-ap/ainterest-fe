export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export interface PasswordResponse {
  message: string;
}

export interface AccessToken {
  accessToken: string;
}

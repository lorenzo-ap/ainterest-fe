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

export interface AccessToken {
  accessToken: string;
}

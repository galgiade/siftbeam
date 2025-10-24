export interface SignUpAuthLocale {
  label: {
    title: string;
    email: string;
    password: string;
    confirmPassword: string;
    signUp: string;
    signIn: string;
    alreadyHaveAccount: string;
  };
  alert: {
    signUpSuccess: string;
    signUpFail: string;
    passwordMismatch: string;
    invalidEmail: string;
  };
}
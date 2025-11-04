import type { SignInLocale } from './signIn.d.ts';

const en: SignInLocale = {
  label: {
    back: "Back",
    submit: "Submit",
    loading: "Loading...",
    signInTitle: "Sign In",
    signInSubtitle: "Please sign in to your account",
    emailLabel: "Email Address",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    passwordDescription: "At least 8 characters with uppercase, lowercase, numbers, and symbols",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    signUp: "Sign Up",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account?",

    // 2FA
    verificationCodeLabel: "Verification Code",
    verificationCodePlaceholder: "Enter the 6-digit code",
    verificationCodeDescription: "Enter the verification code sent to your registered email",
    verifyCode: "Verify Code",
    verifyingCode: "Verifying...",
    resendCode: "Resend Code",
    resendingCode: "Resending...",
    codeExpired: "The verification code has expired",
    enterVerificationCode: "Enter verification code",
    twoFactorAuthTitle: "Two-Factor Authentication",
    twoFactorAuthDescription: "Enter the verification code sent to {email}",
    expirationTime: "Expiration Time",
    attemptCount: "Attempts",
    verificationSuccess: "✅ Authentication successful. Redirecting...",

    // Misc
    orDivider: "or",
    copyright: "© 2024 All rights reserved."
  },
  alert: {
    emailRequired: "Please enter your email address",
    passwordRequired: "Please enter your password",
    emailFormatInvalid: "Please enter a valid email address format",
    passwordFormatInvalid: "Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols",
    emailAndPasswordRequired: "Please enter your email address and password",
    signInFailed: "Sign in failed",
    accountNotConfirmed: "Account is not confirmed. Please complete email verification",
    authCodeRequired: "Authentication code input is required",
    newPasswordRequired: "New password setup is required",
    passwordResetRequired: "Password reset is required",
    nextStepRequired: "Next step is required: {step}",
    
    // 2FA errors
    verificationCodeRequired: "Please enter the verification code",
    verificationCodeInvalid: "The verification code is incorrect",
    verificationCodeExpired: "The verification code has expired. Please resend",
    resendCodeFailed: "Failed to resend the verification code",
    maxAttemptsReached: "Maximum number of attempts reached. Please request a new code.",
    emailSendFailed: "Failed to send email",
    verificationCodeNotFound: "Verification code not found or expired",
    remainingAttempts: "Remaining attempts",
    authErrors: {
      notAuthorized: "Email address or password is incorrect",
      userNotConfirmed: "Account is not confirmed. Please complete email verification",
      userNotFound: "User not found",
      passwordResetRequired: "Password reset is required",
      invalidParameter: "Invalid parameter entered",
      tooManyRequests: "Too many requests. Please try again later"
    }
  }
};

export default en;
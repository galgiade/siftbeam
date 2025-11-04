import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const en: ForgotPasswordLocale = {
  label: {
    back: "Back",
    submit: "Submit",
    loading: "Loading...",
    forgotPasswordTitle: "Reset Password",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email address",
    codeLabel: "Verification Code",
    codePlaceholder: "Enter verification code",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    sendCode: "Send Verification Code",
    updatePassword: "Update Password",
    backToEmail: "Back",
    resendCode: "Send New Code",
    emailDescription: "Please enter your email address. We will send a verification code.",
    codeDescription: "Please enter the verification code sent to your email and your new password.",
    redirectingMessage: "Redirecting to sign in page...",
    codeExpiryTitle: "Verification Code Expiry",
    remainingTime: "Time remaining: {time}",
    expiredMessage: "Expired. Please request a new code.",
    timeLimitMessage: "Please enter within 24 hours",
    expiredResendMessage: "The verification code has expired. Please request a new code."
  },
  alert: {
    emailRequired: "Please enter your email address",
    codeRequired: "Please enter the verification code",
    newPasswordRequired: "Please enter a new password",
    codeSent: "Verification code sent to your email",
    passwordResetSuccess: "Password has been successfully reset",
    passwordUpdated: "Password has been successfully updated!",
    codeExpired: "Expired",
    authErrors: {
      notAuthorized: "Email address or password is incorrect",
      userNotConfirmed: "Account is not confirmed. Please complete email verification",
      userNotFound: "User not found",
      passwordResetRequired: "Password reset is required",
      invalidParameter: "Invalid parameter entered",
      tooManyRequests: "Too many requests. Please try again later",
      signInFailed: "Sign in failed"
    },
    passwordResetErrors: {
      codeMismatch: "Verification code is incorrect. Please try again.",
      expiredCode: "Verification code has expired. Please request a new code.",
      invalidPassword: "Password is invalid. Please check password requirements.",
      limitExceeded: "Request limit reached. Please try again later.",
      genericError: "An error occurred. Please try again."
    }
  }
};

export default en;
export interface UserProfileLocale {
  label: {
    title: string;
    userName: string;
    email: string;
    department: string;
    position: string;
  };
  alert: {
    updateSuccess: string;
    updateFail: string;
    emailUpdateFail: string;
    emailUpdateSuccess: string;
    emailSent: string;
    noChange: string;
    noEmailChange: string;
    invalidEmailFormat: string;
    dbUpdateFail: string;
    dbUpdateError: string;
    invalidConfirmationCode: string;
    invalidConfirmationCodeFormat: string;
    expiredConfirmationCode: string;
    confirmFail: string;
    verificationCodeNotFound: string;
    verificationCodeStoreFailed: string;
    remainingAttempts: string;
  };
  modal: {
    modalTitle: string;
    description: string;
    codeLabel: string;
    confirm: string;
    cancel: string;
    resend: string;
    verifying: string;
  };
}
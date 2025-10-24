export default {
  label: {
    back: "뒤로",
    submit: "제출",
    loading: "로딩 중...",
    signInTitle: "로그인",
    signInSubtitle: "계정에 로그인하세요",
    emailLabel: "이메일 주소",
    emailPlaceholder: "example@email.com",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    passwordDescription: "대문자/소문자/숫자/기호를 포함하여 최소 8자",
    signIn: "로그인",
    signingIn: "로그인 중...",
    signUp: "회원가입",
    forgotPassword: "비밀번호를 잊으셨나요?",
    noAccount: "계정이 없으신가요?",

    // 2FA
    verificationCodeLabel: "인증 코드",
    verificationCodePlaceholder: "6자리 코드를 입력하세요",
    verificationCodeDescription: "등록된 이메일로 전송된 인증 코드를 입력하세요",
    verifyCode: "코드 확인",
    verifyingCode: "확인 중...",
    resendCode: "코드 재전송",
    resendingCode: "재전송 중...",
    codeExpired: "인증 코드가 만료되었습니다",
    enterVerificationCode: "인증 코드를 입력하세요",
    expirationTime: "만료 시간",
    attemptCount: "시도 횟수",
    verificationSuccess: "✅ 인증 성공. 리디렉션 중..."
  },
  alert: {
    emailRequired: "이메일 주소를 입력하세요",
    passwordRequired: "비밀번호를 입력하세요",
    emailFormatInvalid: "유효한 이메일 주소 형식을 입력하세요",
    passwordFormatInvalid: "비밀번호는 대문자/소문자/숫자/기호를 포함하여 최소 8자여야 합니다",
    emailAndPasswordRequired: "이메일과 비밀번호를 입력하세요",
    signInFailed: "로그인에 실패했습니다",
    accountNotConfirmed: "계정이 확인되지 않았습니다. 이메일 인증을 완료해주세요",
    authCodeRequired: "인증 코드 입력이 필요합니다",
    newPasswordRequired: "새 비밀번호 설정이 필요합니다",
    passwordResetRequired: "비밀번호 재설정이 필요합니다",
    nextStepRequired: "다음 단계가 필요합니다: {step}",
    
    // 2FA errors
    verificationCodeRequired: "인증 코드를 입력하세요",
    verificationCodeInvalid: "인증 코드가 올바르지 않습니다",
    verificationCodeExpired: "인증 코드가 만료되었습니다. 재전송하세요",
    resendCodeFailed: "인증 코드 재전송에 실패했습니다",
    maxAttemptsReached: "최대 시도 횟수에 도달했습니다. 새 코드를 요청하세요.",
    emailSendFailed: "이메일 전송에 실패했습니다",
    verificationCodeNotFound: "인증 코드를 찾을 수 없거나 만료되었습니다",
    remainingAttempts: "남은 시도 횟수",
    authErrors: {
      notAuthorized: "이메일 주소 또는 비밀번호가 올바르지 않습니다",
      userNotConfirmed: "계정이 확인되지 않았습니다. 이메일 인증을 완료해주세요",
      userNotFound: "사용자를 찾을 수 없습니다",
      passwordResetRequired: "비밀번호 재설정이 필요합니다",
      invalidParameter: "잘못된 파라미터가 입력되었습니다",
      tooManyRequests: "요청이 너무 많습니다. 잠시 후 다시 시도하세요"
    }
  }
} as const;



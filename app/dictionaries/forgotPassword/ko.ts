import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const ko: ForgotPasswordLocale = {
  label: {
    back: "뒤로",
    submit: "제출",
    loading: "로딩 중...",
    forgotPasswordTitle: "비밀번호 재설정",
    emailLabel: "이메일 주소",
    emailPlaceholder: "이메일 주소를 입력하세요",
    codeLabel: "인증 코드",
    codePlaceholder: "인증 코드를 입력하세요",
    newPasswordLabel: "새 비밀번호",
    newPasswordPlaceholder: "새 비밀번호를 입력하세요",
    sendCode: "인증 코드 보내기",
    updatePassword: "비밀번호 업데이트",
    backToEmail: "뒤로",
    resendCode: "새 코드 보내기",
    emailDescription: "이메일 주소를 입력해주세요. 인증 코드를 전송합니다.",
    codeDescription: "이메일로 전송된 인증 코드와 새 비밀번호를 입력하세요.",
    redirectingMessage: "로그인 페이지로 이동 중...",
    codeExpiryTitle: "인증 코드 유효시간",
    remainingTime: "남은 시간: {time}",
    expiredMessage: "만료되었습니다. 새 코드를 요청하세요.",
    timeLimitMessage: "24시간 이내에 입력해주세요",
    expiredResendMessage: "인증 코드가 만료되었습니다. 새 코드를 요청하세요."
  },
  alert: {
    emailRequired: "이메일 주소를 입력하세요",
    codeRequired: "인증 코드를 입력하세요",
    newPasswordRequired: "새 비밀번호를 입력하세요",
    codeSent: "이메일로 인증 코드를 전송했습니다",
    passwordResetSuccess: "비밀번호가 성공적으로 재설정되었습니다",
    passwordUpdated: "비밀번호가 성공적으로 업데이트되었습니다!",
    codeExpired: "만료됨",
    authErrors: {
      notAuthorized: "이메일 주소 또는 비밀번호가 올바르지 않습니다",
      userNotConfirmed: "계정이 확인되지 않았습니다. 이메일 인증을 완료해주세요",
      userNotFound: "사용자를 찾을 수 없습니다",
      passwordResetRequired: "비밀번호 재설정이 필요합니다",
      invalidParameter: "잘못된 파라미터가 입력되었습니다",
      tooManyRequests: "요청이 너무 많습니다. 잠시 후 다시 시도하세요",
      signInFailed: "로그인에 실패했습니다"
    },
    passwordResetErrors: {
      codeMismatch: "인증 코드가 올바르지 않습니다. 다시 시도하세요.",
      expiredCode: "인증 코드가 만료되었습니다. 새 코드를 요청하세요.",
      invalidPassword: "비밀번호가 유효하지 않습니다. 요구사항을 확인하세요.",
      limitExceeded: "요청 한도에 도달했습니다. 잠시 후 다시 시도하세요.",
      genericError: "오류가 발생했습니다. 다시 시도하세요."
    }
  }
};

export default ko;
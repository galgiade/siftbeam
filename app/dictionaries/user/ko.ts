// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const ko = {
  alert: {
    updateSuccess: "사용자 정보가 성공적으로 업데이트되었습니다.",
    updateFail: "사용자 정보 업데이트에 실패했습니다.",
    emailSent: "새 이메일 주소로 확인 코드가 전송되었습니다.",
    emailUpdateSuccess: "이메일 주소가 성공적으로 업데이트되었습니다.",
    emailUpdateFail: "이메일 주소 업데이트에 실패했습니다.",
    dbUpdateFail: "데이터베이스 업데이트에 실패했습니다.",
    dbUpdateError: "데이터베이스 업데이트 실패",
    confirmFail: "확인 코드가 잘못되었거나 데이터베이스 업데이트에 실패했습니다.",
    invalidConfirmationCode: "확인 코드가 잘못되었습니다. 올바른 6자리 코드를 입력해 주세요.",
    expiredConfirmationCode: "확인 코드가 만료되었습니다. 새 코드를 요청해 주세요.",
    userAlreadyExists: "이 이메일 주소는 이미 등록되어 있습니다. 다른 이메일 주소를 사용해 주세요.",
    usernameExists: "이 사용자 이름은 이미 사용 중입니다. 다른 사용자 이름을 사용해 주세요.",
    noEmailChange: "이메일 주소에 변경사항이 없습니다.",
    invalidEmailFormat: "잘못된 이메일 형식입니다. 올바른 이메일 주소를 입력해 주세요.",
    emailChangeCancelled: "이메일 주소 변경이 취소되었습니다.",
    emailChangeCancelFailed: "이메일 주소 변경 취소에 실패했습니다.",
    emailChangeReset: "확인되지 않은 이메일 주소 변경이 재설정되었습니다.",
    noChange: "사용자 이름에 변경사항이 없습니다.",
    resendLimitExceeded: "재전송 한도가 초과되었습니다. 나중에 다시 시도해 주세요.",
    resendFailed: "확인 코드 재전송에 실패했습니다. 다시 시도해 주세요.",
    invalidConfirmationCodeFormat: "6자리 확인 코드를 입력해 주세요.",
    confirmationAttemptLimitExceeded: "확인 시도 한도가 초과되었습니다. 나중에 다시 시도해 주세요.",
    authenticationFailed: "인증에 실패했습니다. 다시 로그인하고 시도해 주세요.",
    invalidUsernameFormat: "잘못된 사용자 이름 형식입니다. 올바른 사용자 이름을 입력해 주세요.",
    usernameChangeLimitExceeded: "사용자 이름 변경 한도가 초과되었습니다. 나중에 다시 시도해 주세요.",
    atLeastOneFieldRequired: "최소한 하나의 필드가 업데이트되어야 합니다",
    verificationCodeNotFound: "인증 코드를 찾을 수 없거나 만료되었습니다",
    remainingAttempts: "남은 시도 횟수",
    verificationCodeStoreFailed: "인증 코드 저장에 실패했습니다. IAM 권한을 확인해 주세요."
  },
  label: {
    title: "사용자 정보",
    userName: "사용자 이름",
    department: "부서",
    position: "직책",
    email: "이메일 주소"
  },
  modal: {
    modalTitle: "이메일 확인",
    description: "새 이메일 주소({email})로 전송된 확인 코드를 입력해 주세요.",
    codeLabel: "확인 코드",
    cancel: "취소",
    confirm: "확인",
    resend: "재전송",
    verifying: "확인 중..."
  }
}

export default ko;



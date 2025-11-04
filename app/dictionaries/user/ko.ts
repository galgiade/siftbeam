import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const ko: UserProfileLocale = {
  alert: {
    updateSuccess: "사용자 정보가 성공적으로 업데이트되었습니다.",
    updateFail: "사용자 정보 업데이트에 실패했습니다.",
    updateError: "업데이트 중 오류가 발생했습니다.",
    fieldUpdateSuccess: "{field}이(가) 성공적으로 업데이트되었습니다.",
    fieldUpdateFail: "{field} 업데이트에 실패했습니다.",
    emailSent: "새 이메일 주소로 확인 코드가 전송되었습니다.",
    emailUpdateSuccess: "이메일 주소가 성공적으로 업데이트되었습니다.",
    emailUpdateFail: "이메일 주소 업데이트에 실패했습니다.",
    dbUpdateFail: "데이터베이스 업데이트에 실패했습니다.",
    dbUpdateError: "데이터베이스 업데이트 실패",
    confirmFail: "확인 코드가 잘못되었거나 데이터베이스 업데이트에 실패했습니다.",
    invalidConfirmationCode: "확인 코드가 잘못되었습니다. 올바른 6자리 코드를 입력해 주세요.",
    expiredConfirmationCode: "확인 코드가 만료되었습니다. 새 코드를 요청해 주세요.",
    noEmailChange: "이메일 주소에 변경사항이 없습니다.",
    invalidEmailFormat: "잘못된 이메일 형식입니다. 올바른 이메일 주소를 입력해 주세요.",
    noChange: "사용자 이름에 변경사항이 없습니다.",
    invalidConfirmationCodeFormat: "6자리 확인 코드를 입력해 주세요.",
    verificationCodeNotFound: "인증 코드를 찾을 수 없거나 만료되었습니다",
    remainingAttempts: "남은 시도 횟수",
    verificationCodeStoreFailed: "인증 코드 저장에 실패했습니다. IAM 권한을 확인해 주세요.",
    codeStoreFailed: "코드 저장에 실패했습니다.",
    adminOnlyEdit: "관리자만 이 필드를 편집할 수 있습니다.",
    validEmailRequired: "유효한 이메일 주소를 입력하세요."
  },
  label: {
    title: "사용자 정보",
    userName: "사용자 이름",
    department: "부서",
    position: "직책",
    email: "이메일 주소",
    locale: "언어",
    role: "역할",
    edit: "편집",
    save: "저장",
    cancel: "취소",
    adminOnly: "(관리자만 가능)",
    readOnly: "(변경 불가)",
    editableFields: "편집 가능: 사용자명, 언어",
    adminOnlyFields: "관리자만 가능: 이메일, 부서, 직책",
    allFieldsEditable: "모든 필드를 편집할 수 있습니다",
    newEmailSent: "새 이메일 \"{email}\"로 인증 코드를 전송했습니다.",
    roleAdmin: "관리자",
    roleUser: "사용자",
    lastAdminRestriction: "마지막 관리자인 경우 역할 변경이 제한됩니다",
    lastAdminNote: "※ 조직에 관리자가 1명만 있는 경우 역할을 일반 사용자로 변경할 수 없습니다.",
    generalUserPermission: "일반 사용자 권한",
    adminPermission: "관리자 권한",
    verifyAndUpdate: "인증 및 업데이트",
    verificationCodePlaceholder: "인증 코드(6자리)"
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



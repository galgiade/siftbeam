export default {
  alert: {
    updateSuccess: "회사 정보가 업데이트되었습니다.",
    updateFail: "업데이트에 실패했습니다.",
    networkError: "네트워크 오류: {message}",
    required: '"{label}"은(는) 필수입니다.',
    fetchCustomerFailed: "고객 정보 가져오기에 실패했습니다",
    customerNotFound: "고객 정보를 찾을 수 없습니다",
    customerDeleted: "이 고객 계정은 삭제되었습니다",
    adminOnlyEditMessage: "회사 정보 편집은 관리자만 가능합니다. 편집 권한이 없습니다.",
    invalidEmail: "유효한 이메일 주소를 입력해주세요",
    invalidPhone: "유효한 전화번호를 입력해주세요",
    invalidPostalCode: "유효한 우편번호를 입력해주세요",
    nameTooLong: "회사명은 100자 이내로 입력해주세요",
    addressTooLong: "주소는 200자 이내로 입력해주세요",
    validationError: "입력 내용에 문제가 있습니다. 확인해주세요."
  },
  label: {
    title: "회사 정보",
    country: "국가",
    countryPlaceholder: "국가를 검색하여 선택",
    postal_code: "우편번호",
    state: "주/도",
    city: "도시",
    line2: "건물명",
    line1: "주소",
    name: "회사명",
    phone: "전화번호",
    email: "청구 이메일"
  },
  placeholder: {
    postal_code: "예: 12345",
    state: "예: 서울특별시",
    city: "예: 강남구",
    line2: "예: 10층 (선택사항)",
    line1: "예: 테헤란로 123",
    name: "예: (주)샘플컴퍼니",
    phone: "예: +82-2-1234-5678",
    email: "예: contact@example.co.kr"
  },
  button: {
    cancel: "취소"
  }
} as const;



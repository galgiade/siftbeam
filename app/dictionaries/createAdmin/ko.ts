import type { CreateAdminLocale } from './createAdmin.d.ts';

const ko: CreateAdminLocale = {
  label: {
    back: "뒤로",
    submit: "제출",
    loading: "로딩 중...",
    createAdminTitle: "관리자 계정 생성",
    userNameLabel: "사용자명",
    userNamePlaceholder: "홍길동",
    userNameDescription: "최소 2자 이상 입력하세요",
    departmentLabel: "부서",
    departmentPlaceholder: "영업부",
    positionLabel: "직책",
    positionPlaceholder: "매니저",
    languageLabel: "언어",
    languagePlaceholder: "언어를 선택하세요",
    japanese: "일본어",
    english: "영어",
    spanish: "스페인어",
    french: "프랑스어",
    german: "독일어",
    korean: "한국어",
    portuguese: "포르투갈어",
    indonesian: "인도네시아어",
    chinese: "중국어",
    createAdmin: "관리자 계정 생성",
    creating: "생성 중...",
    accountCreation: "계정 생성",
    companyInfo: "회사 정보",
    adminSetup: "관리자 설정",
    paymentSetup: "결제 설정"
  },
  alert: {
    userNameRequired: "사용자명을 입력하세요",
    userNameMinLength: "사용자명은 최소 2자 이상이어야 합니다",
    departmentRequired: "부서를 입력하세요",
    positionRequired: "직책을 입력하세요",
    invalidAuthInfo: "인증 정보가 올바르지 않습니다. 다시 로그인해주세요.",
    adminCreationFailed: "관리자 계정 생성에 실패했습니다",
    networkError: "네트워크 오류가 발생했습니다"
  }
};

export default ko;
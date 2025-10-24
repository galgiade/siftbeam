export default {
  label: {
    back: "뒤로",
    submit: "제출",
    loading: "로딩 중...",
    paymentSetupTitle: "결제 수단 설정",
    cardInfoLabel: "카드 정보",
    expiryLabel: "MM/YY",
    cvcLabel: "보안 코드",
    apply: "신청",
    processing: "처리 중...",
    goToMyPage: "마이페이지로",
    accountCreation: "계정 생성",
    companyInfo: "회사 정보",
    adminSetup: "관리자 설정",
    paymentSetup: "결제 수단 설정",
    paymentMethodSaved: "✓ 결제 수단이 성공적으로 저장되었습니다",
    defaultPaymentMethodSet: "이 카드가 기본 결제 수단으로 설정되었습니다.",
    subscriptionCreated: "✓ 구독이 성공적으로 생성되었습니다",
    automaticBillingEnabled: "사용량 기반 자동 결제가 활성화되었습니다.",
    saveInfoDescription: "정보를 안전하게 저장하여 향후 원클릭 구매 가능",
    linkCompatibleStores: "기본 사운드박스를 포함한 Link 호환 매장에서 빠르게 결제할 수 있습니다.",
    cardInfoEncrypted: "카드 정보는 암호화되어 안전하게 저장됩니다.",
    billingBasedOnUsage: "실제 청구는 사용량에 따라 나중에 이루어집니다.",
    authenticationFlowDescription: "보안상 카드 인증이 필요할 수 있습니다.",
    authenticationFlowSteps: "인증이 필요한 경우 은행 인증 화면이 표시됩니다. 인증을 완료해 주세요.",
    agreeNoticePrefix: "등록을 완료하면 ",
    and: "과 ",
    agreeNoticeSuffix: "에 동의한 것으로 간주됩니다.",
    terms: "이용약관",
    privacy: "개인정보처리방침"
  },
  alert: {
    expiryRequired: "만료일을 올바르게 입력해 주세요",
    cvcRequired: "보안 코드를 올바르게 입력해 주세요",
    cardInfoRequired: "카드 정보가 입력되지 않았습니다",
    setupIntentFailed: "Setup Intent 생성에 실패했습니다",
    paymentMethodFailed: "결제 수단 생성에 실패했습니다",
    unknownError: "알 수 없는 오류가 발생했습니다",
    customerInfoNotFound: "고객 정보를 가져올 수 없습니다.",
    defaultPaymentMethodFailed: "기본 결제 수단 설정에 실패했지만 카드 등록은 완료되었습니다",
    authenticationRequired: "카드 인증이 필요합니다. 인증을 완료해 주세요.",
    authenticationFailed: "카드 인증에 실패했습니다. 다시 시도해 주세요.",
    authenticationCancelled: "카드 인증이 취소되었습니다.",
    authenticationIncomplete: "카드 인증이 완료되지 않았습니다. 인증을 완료해 주세요."
  }
} as const;



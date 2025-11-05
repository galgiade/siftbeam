import type { UsageLimitLocale } from './usage-limit.d.ts';

const ko: UsageLimitLocale = {
  label: {
    // 공통
    save: "저장",
    cancel: "취소",
    edit: "편집",
    delete: "삭제",
    back: "뒤로",
    add: "추가",
    create: "생성",
    creating: "저장 중...",
    update: "업데이트",
    
    // 생성 페이지
    createUsageLimitTitle: "사용량 제한 생성",
    createUsageLimitDescription: "데이터 처리량 또는 비용 제한을 설정하고 초과 시 수행할 작업을 선택하세요.",
    usageLimitSettings: "사용량 제한 설정",
    exceedActionTitle: "초과 시 작업",
    selectAction: "작업 선택",
    notifyOnlyOption: "알림만",
    restrictOption: "서비스 중단",
    notifyOnlyDescription: "제한을 초과하면 알림 이메일이 전송됩니다. 서비스는 계속 사용 가능합니다.",
    restrictDescription: "제한을 초과하면 서비스가 중단됩니다. 알림 이메일도 함께 전송됩니다.",
    limitTypeTitle: "제한 유형",
    dataLimitOption: "데이터 제한",
    amountLimitOption: "금액 제한",
    dataLimitDescription: "데이터 처리량(MB/GB/TB) 기반 제한을 설정합니다.",
    amountLimitDescription: "처리 비용(USD) 기반 제한을 설정합니다.",
    dataLimitTitle: "데이터 제한 값",
    enterLimitValue: "제한 값 입력 (예: 100)",
    unit: "단위",
    monthlyDataLimitDescription: "월간 데이터 처리량이 이 값을 초과하면 작업이 실행됩니다.",
    amountLimitTitle: "금액 제한 값",
    enterAmountValue: "제한 값 입력 (예: 50)",
    monthlyAmountLimitDescription: "월간 처리 비용이 이 금액을 초과하면 작업이 실행됩니다.",
    notificationSettingsTitle: "알림 설정",
    enterEmailPlaceholder: "이메일 주소 입력 (예: example@company.com)",
    notificationEmailList: "알림 이메일 주소",
    notificationEmailCount: "알림 이메일 주소 ({count}개)",
    notifyOnlyEmailDescription: "제한을 초과하면 여기에 설정된 이메일 주소로 알림이 전송됩니다.",
    restrictEmailDescription: "제한을 초과하면 서비스가 중단되고 여기에 설정된 이메일 주소로 알림이 전송됩니다.",
    cancelButton: "취소",
    createNotifyLimit: "알림 제한 생성",
    createRestrictLimit: "제한 제한 생성",
    processingFeeOnly: "처리 수수료만",
    conversionApproximate: "≈",

    // 메인 화면
    limitUsageTitle: "사용량 제한",
    usageLimitManagement: "사용량 제한 관리",
    usageLimitDescription: "데이터 사용량 및 금액 제한을 설정하고 초과 시 작업을 관리합니다.",
    createLimit: "제한 생성",
    notificationTarget: "알림 수신자",
    detail: "상세",
    createdAt: "생성일",
    updatedAt: "업데이트일",
    limitValue: "제한 값",
    notificationRecipients: "알림 수신자",

    // 알림 유형
    notify: "알림",
    restrict: "중단",
    exceedAction: "초과 시 작업",
    notifyOnly: "알림만",
    notifyLimit: "알림 제한",
    restrictLimit: "중단 제한",
    notifyLimitDescription: "제한을 설정하면 초과 시 알림이 전송됩니다.",
    restrictLimitDescription: "제한을 설정하면 초과 시 서비스가 중단됩니다.",
    noNotifyLimits: "설정된 알림 제한이 없습니다",
    noRestrictLimits: "설정된 중단 제한이 없습니다",

    // 금액 및 사용량
    amount: "금액",
    usage: "사용량",
    editTarget: "편집 대상",
    limitType: "제한 유형",
    selectLimitType: "제한 유형 선택",
    dataLimitValue: "데이터 제한 값",
    amountLimitValue: "금액 제한 값 (USD)",
    dataLimitPlaceholder: "예: 100",
    amountLimitPlaceholder: "예: 50",
    orSeparator: "또는",
    noLimit: "제한 없음",

    // 수신자 관리
    recipients: "수신자",
    emailAddress: "이메일 주소",
    emailPlaceholder: "이메일 주소 입력",
    noRecipientsRegistered: "등록된 수신자가 없습니다",
    addEmailAddress: "알림 이메일 주소",
    minOneEmailRequired: "최소 하나의 알림 이메일 주소가 필요합니다.",

    // 생성 / 편집
    usageNotification: "사용량 알림",
    selectNotifyOrRestrict: "알림 또는 제한 선택",
    selectNotificationMethod: "알림 방법 선택",
    amountBasedNotification: "금액 기반 알림",
    usageBasedNotification: "사용량 기반 알림",
    enterAmount: "금액 입력",
    enterUsage: "사용량 입력",
    addNewRecipient: "새 수신자 추가",
    usageConversion: "사용량 변환",
    amountConversion: "금액 변환",
    createNewLimit: "새 사용량 제한 생성",
    editLimit: "사용량 제한 편집",
    dataLimit: "데이터 제한",
    amountLimit: "금액 제한",

    // 단위
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // 오류 화면
    errorOccurred: "오류가 발생했습니다",
    errorDetails: "오류 세부정보",
    reloadPage: "페이지 새로고침",
    backToAccount: "계정으로 돌아가기",
    contactSupport: "문제가 지속되면 지원팀에 문의하세요."
  },
  alert: {
    // 유효성 검사
    amountRequired: "사용 금액을 입력하세요",
    usageRequired: "사용량을 입력하세요",
    emailRequired: "이메일 주소를 입력하세요",
    invalidEmail: "유효한 이메일 주소를 입력하세요.",
    enterPositiveAmount: "0 이상의 숫자를 입력하세요",
    enterValidUsage: "0보다 크고 1024보다 작은 숫자를 입력하세요",
    enterPositiveDataLimit: "데이터 제한 값은 0보다 커야 합니다.",
    enterPositiveAmountLimit: "금액 제한 값은 0보다 커야 합니다.",
    emailAlreadyAdded: "이 이메일 주소는 이미 추가되었습니다.",
    minOneEmail: "최소 하나의 알림 이메일 주소가 필요합니다.",
    selectExceedAction: "초과 시 작업을 선택하세요.",
    selectLimitType: "제한 유형을 선택하세요.",
    dataLimitValueRequired: "데이터 제한 값은 0보다 커야 합니다.",
    dataLimitValueMax: "데이터 제한 값은 1,000,000 이하여야 합니다.",
    amountLimitValueRequired: "금액 제한 값은 0보다 커야 합니다.",
    amountLimitValueMax: "금액 제한 값은 100,000 이하여야 합니다.",
    minOneEmailRequired: "최소 하나의 알림 이메일 주소를 입력하세요.",
    notifyLimitCreated: "알림 제한이 성공적으로 생성되었습니다.",
    restrictLimitCreated: "제한 제한이 성공적으로 생성되었습니다.",
    errorPrefix: "오류:",
    unexpectedError: "예기치 않은 오류가 발생했습니다:",

    // 작업 결과
    createFailed: "사용량 제한 생성에 실패했습니다.",
    updateFailed: "사용량 제한 업데이트에 실패했습니다.",
    sendingError: "전송 중 오류가 발생했습니다.",
    savingInProgress: "저장 중...",
    createSuccess: "사용량 제한이 성공적으로 생성되었습니다.",
    updateSuccess: "사용량 제한이 성공적으로 업데이트되었습니다.",
    deleteSuccess: "사용량 제한이 성공적으로 삭제되었습니다.",
    deleteConfirm: "이 사용량 제한을 삭제하시겠습니까?",

    // 권한
    adminOnlyCreateMessage: "관리자만 사용량 제한을 생성할 수 있습니다. 관리자에게 문의하세요.",
    adminOnlyEditMessage: "관리자만 사용량 제한을 편집할 수 있습니다. 권한이 없습니다.",
    adminOnlyDeleteMessage: "관리자만 사용량 제한을 삭제할 수 있습니다. 권한이 없습니다.",

    // 오류
    loginRequired: "로그인이 필요합니다.",
    unknownError: "알 수 없는 오류가 발생했습니다.",
    accessDenied: "이 페이지에 접근할 권한이 없습니다. 관리자만 접근 가능합니다.",
    fetchFailed: "사용량 제한 데이터를 가져오는데 실패했습니다."
  }
};

export default ko;

import type { ServiceLocale } from './ServiceLocale.d.ts';

const ko: ServiceLocale = {
  page: {
    title: "서비스",
    description:
      "정책을 선택하고 파일을 업로드하여 처리를 실행할 수 있습니다. 처리된 데이터는 1년 동안 무료로 보관됩니다.",
    loading: "불러오는 중..."
  },
  error: {
    title: "오류가 발생했습니다",
    loginRequired: "로그인이 필요합니다.",
    processingHistoryFetchFailed: "처리 이력을 가져오지 못했습니다.",
    policiesFetchFailed: "정책 정보를 가져오지 못했습니다.",
    usageLimitsFetchFailed: "사용 제한 정보를 가져오지 못했습니다.",
    pageLoadFailed: "서비스 페이지를 불러오지 못했습니다.",
    suggestion1: "페이지를 새로고침해주세요.",
    suggestion2: "문제가 계속되면 지원팀에 문의하세요."
  },
  limits: {
    notifyLimit: {
      title: "알림 제한",
      limitValue: "제한값:",
      exceedAction: "초과 시 동작:",
      currentUsage: "현재 사용량:",
      notSet: "알림 제한이 설정되어 있지 않습니다",
      currentUsageLabel: "현재 사용량:",
      settingsCount: "설정된 알림 제한: {count}건",
      dataLimit: "데이터 제한: {value} {unit} ({bytes})",
      amountLimit: "금액 제한: ${amount}",
      noLimitValue: "제한값이 설정되어 있지 않습니다",
      amountConversionNote:
        "※ 금액 제한은 데이터 사용량으로 환산하여 표시합니다 (처리 요금: $0.00001/Byte, 1년 보관 포함)."
    },
    restrictLimit: {
      title: "중지 제한",
      limitValue: "제한값:",
      exceedAction: "초과 시 동작:",
      currentUsage: "현재 사용량:",
      notSet: "중지 제한이 설정되어 있지 않습니다",
      currentUsageLabel: "현재 사용량:",
      settingsCount: "설정된 중지 제한: {count}건",
      dataLimit: "데이터 제한: {value} {unit} ({bytes})",
      amountLimit: "금액 제한: ${amount}",
      noLimitValue: "제한값이 설정되어 있지 않습니다",
      amountConversionNote:
        "※ 금액 제한은 데이터 사용량으로 환산하여 표시합니다 (처리 요금: $0.00001/Byte, 1년 보관 포함)."
    },
    perMonth: "/월",
    notifyAction: "알림",
    restrictAction: "중지"
  },
  policySelection: {
    title: "정책 선택",
    label: "처리 정책을 선택하세요",
    placeholder: "정책을 선택하세요",
    noPolicies: "사용 가능한 정책이 없습니다"
  },
  fileUpload: {
    title: "파일 업로드",
    selectPolicyFirst: "먼저 정책을 선택하세요",
    noPoliciesAvailable: "사용 가능한 정책이 없습니다",
    dragAndDrop: "파일을 드래그 앤 드롭",
    orClickToSelect: "또는 클릭하여 선택",
    maxFiles: "최대 {max}개 파일, 각 100MB 이하",
    supportedFormats: "지원 형식: {formats}에 지정된 형식을 사용하세요",
    selectedFiles: "선택된 파일 ({count}/{max})",
    deleteAll: "모두 삭제",
    fileSizeLimit: "{name} 파일이 너무 큽니다. 100MB 이하의 파일을 선택하세요.",
    pending: "대기 중",
    uploading: "업로드 중",
    completed: "완료",
    error: "오류",
    startProcessing: "처리 시작",
    processing: "처리를 시작하는 중...",
    uploadComplete: "업로드 완료",
    uploadCompletedMessage: "{count}개의 파일을 업로드하고 AI 처리를 시작했습니다!",
    uploadNotAllowed: "업로드 불가",
    notifyLimitReached: "알림 제한에 도달했습니다",
    notifyLimitReachedMessage: "알림 제한({limit})에 도달했습니다. {count}건의 알림 이메일을 보냈습니다."
  },
  table: {
    id: "ID",
    userName: "사용자명",
    policyName: "정책명",
    usageAmountBytes: "사용량",
    status: "상태",
    errorDetail: "오류",
    createdAt: "시작일시",
    updatedAt: "업데이트일시",
    download: "다운로드",
    aiTraining: "AI 사용",
    delete: "삭제",
    ariaLabel: "데이터 처리 이력 테이블"
  },
  status: {
    in_progress: "진행 중",
    success: "완료",
    failed: "실패",
    canceled: "취소",
    deleted: "삭제됨",
    delete_failed: "삭제 실패"
  },
  notification: {
    uploadSuccess: "파일 업로드가 완료되었습니다. 데이터 처리를 시작합니다.",
    uploadError: "업로드에 실패했습니다.",
    uploadProcessingError: "업로드 처리 중 오류가 발생했습니다.",
    uploadFailed: "파일 업로드에 실패했습니다. 다시 시도하세요.",
    fetchFailed: "데이터를 가져오지 못했습니다.",
    aiTrainingChanged: "AI 학습 사용 권한이 변경되었습니다.",
    deleteCompleted: "파일 삭제가 완료되었습니다.",
    uploadCompleted: "업로드가 완료되었습니다.",
    uploadFailedGeneric: "업로드에 실패했습니다.",
    dataFetchFailed: "데이터를 가져오지 못했습니다.",
    notificationSent: "알림 이메일을 보냈습니다.",
    notificationFailed: "알림 전송에 실패했습니다.",
    notificationError: "알림 전송 중 오류가 발생했습니다.",
    dataUpdated: "데이터가 업데이트되었습니다."
  },
  filter: {
    userName: {
      placeholder: "사용자명으로 검색",
      ariaLabel: "사용자명 검색"
    },
    policyName: {
      placeholder: "정책명으로 검색",
      ariaLabel: "정책명 검색"
    },
    dateRange: {
      label: "날짜 범위",
      startDate: {
        placeholder: "시작 날짜",
        ariaLabel: "시작 날짜 선택"
      },
      endDate: {
        placeholder: "종료 날짜",
        ariaLabel: "종료 날짜 선택"
      },
      separator: "~"
    },
    minUsage: {
      label: "최소 사용량",
      placeholder: "최소",
      ariaLabel: "최소 사용량"
    },
    maxUsage: {
      label: "최대 사용량",
      placeholder: "최대",
      ariaLabel: "최대 사용량"
    },
    reset: "필터 초기화",
    rangeSeparator: "~",
    refresh: "데이터 새로고침",
    deleteSelected: "선택 항목 삭제"
  },
  policy: {
    select: "정책 선택",
    none: "생성된 정책이 없습니다.",
    create: "정책 만들기",
    noPolicies: "생성된 정책이 없습니다.",
    createPolicy: "정책 만들기"
  },
  deleteDialog: {
    title: "삭제 확인",
    warn1: "선택한 파일이 영구적으로 삭제됩니다.",
    warn2: "삭제 후에는 처리된 파일을 다운로드할 수 없습니다.",
    warn3: "또한 AI 학습에도 사용할 수 없습니다.",
    warn4: "이 작업은 취소할 수 없습니다. 주의하세요.",
    confirm: "정말 삭제하시겠습니까? \"DELETE\"를 입력하세요.",
    cancel: "취소",
    delete: "삭제"
  },
  limitUsage: {
    title: "사용 제한 현황",
    status: {
      normal: "정상",
      warning: "경고",
      exceeded: "제한 초과"
    },
    current: "현재:",
    limit: "제한:",
    noLimit: "제한 없음",
    exceedAction: {
      notify: "알림",
      restrict: "제한"
    },
    testNotification: "테스트 알림 보내기",
    limitTypes: {
      usage: "사용량 제한",
      amount: "금액 제한"
    },
    unknownCompany: "알 수 없는 회사"
  },
  tableEmpty: "데이터 처리 이력이 없습니다.",
  pagination: {
    prev: "이전",
    next: "다음"
  },
  displayCount: "총 {total}개 중 {shown}개 표시 (전체 {all}개)",
  processingHistory: {
    title: "처리 기록",
    count: "({count}건)",
    refresh: "새로고침",
    empty: "처리 기록이 없습니다.",
    emptyDescription: "파일을 업로드하고 처리를 시작하면 이곳에 기록이 표시됩니다.",
    noDownloadableFiles: "다운로드 가능한 파일이 없습니다.",
    noOutputFiles: "다운로드 가능한 출력 파일이 없습니다.",
    downloadFailed: "다운로드에 실패했습니다.",
    aiTrainingUpdateFailed: "AI 학습 사용 설정을 업데이트하지 못했습니다.",
    fileExpiredTooltip: "보관 기간(1년)이 지나 파일이 삭제되었습니다.",
    unknownUser: "알 수 없는 사용자",
    allow: "허용",
    deny: "거부",
    columns: {
      policy: "정책",
      user: "사용자",
      status: "상태",
      startTime: "시작 시간",
      fileSize: "파일 크기",
      aiTraining: "AI 사용",
      errorDetail: "오류 상세",
      download: "다운로드"
    }
  }
};

export default ko;
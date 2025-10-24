export default {
  "table": {
    "id": "ID",
    "userName": "사용자명",
    "policyName": "정책명",
    "usageAmountBytes": "사용량",
    "status": "상태",
    "errorDetail": "오류",
    "createdAt": "시작일시",
    "updatedAt": "업데이트일시",
    "download": "다운로드",
    "aiTraining": "AI 학습",
    "delete": "삭제",
    "ariaLabel": "데이터 처리 이력 테이블"
  },
  "status": {
    "in_progress": "처리중",
    "success": "완료",
    "failed": "실패",
    "canceled": "취소",
    "deleted": "삭제",
    "delete_failed": "삭제 실패"
  },
  "notification": {
    "uploadSuccess": "파일 업로드가 완료되었습니다. 데이터 처리를 시작합니다.",
    "uploadError": "업로드에 실패했습니다.",
    "uploadProcessingError": "업로드 처리 중 오류가 발생했습니다.",
    "uploadFailed": "파일 업로드에 실패했습니다. 다시 시도해 주세요.",
    "fetchFailed": "데이터를 가져오는데 실패했습니다.",
    "aiTrainingChanged": "AI 학습 권한이 변경되었습니다.",
    "deleteCompleted": "파일 삭제가 완료되었습니다.",
    "uploadCompleted": "업로드가 완료되었습니다.",
    "uploadFailedGeneric": "업로드에 실패했습니다.",
    "dataFetchFailed": "데이터를 가져오는데 실패했습니다.",
    "notificationSent": "알림 이메일이 성공적으로 전송되었습니다.",
    "notificationFailed": "알림 전송에 실패했습니다.",
    "notificationError": "알림 전송 중 오류가 발생했습니다.",
    "dataUpdated": "데이터가 성공적으로 업데이트되었습니다."
  },
  "filter": {
    "userName": {
      "placeholder": "사용자명으로 검색",
      "ariaLabel": "사용자명 검색"
    },
    "policyName": {
      "placeholder": "정책명으로 검색",
      "ariaLabel": "정책명 검색"
    },
    "dateRange": {
      "label": "날짜 범위",
      "startDate": {
        "placeholder": "시작 날짜",
        "ariaLabel": "시작 날짜 선택"
      },
      "endDate": {
        "placeholder": "종료 날짜",
        "ariaLabel": "종료 날짜 선택"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "최소 사용량",
      "placeholder": "최소",
      "ariaLabel": "최소 사용량"
    },
    "maxUsage": {
      "label": "최대 사용량",
      "placeholder": "최대",
      "ariaLabel": "최대 사용량"
    },
    "reset": "필터 재설정",
    "rangeSeparator": "~",
    "refresh": "데이터 새로고침",
    "deleteSelected": "선택한 항목 삭제"
  },
  "policy": {
    "select": "정책 선택",
    "none": "생성된 정책이 없습니다.",
    "create": "정책 생성",
    "noPolicies": "생성된 정책이 없습니다.",
    "createPolicy": "정책 생성"
  },
  "deleteDialog": {
    "title": "삭제 확인",
    "warn1": "선택된 파일이 영구적으로 삭제됩니다.",
    "warn2": "삭제 후에는 처리된 파일을 다운로드할 수 없습니다.",
    "warn3": "또한 AI 학습에도 사용할 수 없습니다.",
    "warn4": "이 작업은 취소할 수 없습니다. 주의해 주세요.",
    "confirm": "정말로 삭제하시겠습니까? '삭제'를 입력해 주세요.",
    "cancel": "취소",
    "delete": "삭제"
  },
  "limitUsage": {
    "title": "사용 제한 상태",
    "status": {
      "normal": "정상",
      "warning": "경고",
      "exceeded": "제한 초과"
    },
    "current": "현재:",
    "limit": "제한:",
    "noLimit": "제한 없음",
    "exceedAction": {
      "notify": "알림",
      "restrict": "제한"
    },
    "testNotification": "테스트 알림 전송",
    "limitTypes": {
      "usage": "사용량 제한",
      "amount": "금액 제한"
    },
    "unknownCompany": "알 수 없는 회사"
  },
  "tableEmpty": "데이터 처리 이력이 없습니다.",
  "pagination": {
    "prev": "이전",
    "next": "다음"
  },
  "displayCount": "{total}개 중 {shown}개 표시 (전체 {all}개)"
} as const;



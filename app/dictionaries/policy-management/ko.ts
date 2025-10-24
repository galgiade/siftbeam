export default {
  label: {
    policyList: "정책 목록",
    policyNotRegistered: "등록된 정책이 없습니다",
    policyName: "정책명",
    policyNamePlaceholder: "정책명",
    description: "정책 설명",
    descriptionPlaceholder: "정책 설명",
    allowedFileTypes: "허용 파일 형식:",
    selectFileTypes: "파일 형식 선택(복수)",
    fileTypes: {
      "image/jpeg": "JPEG 이미지",
      "image/png": "PNG 이미지",
      "image/gif": "GIF 이미지",
      "image/webp": "WebP 이미지",
      "application/pdf": "PDF 파일",
      "text/csv": "CSV 파일",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "엑셀 파일(.xlsx)",
      "application/vnd.ms-excel": "엑셀 파일(.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "워드 파일(.docx)",
      "application/msword": "워드 파일(.doc)",
      "text/plain": "텍스트 파일",
      "application/json": "JSON 파일",
      "application/zip": "ZIP 압축"
    }
  },
  alert: {
    required: "필수 입력 항목입니다",
    invalidEmail: "유효한 이메일 주소를 입력하세요",
    fileTypeRequired: "최소 하나 이상의 파일 형식을 선택하세요",
    adminOnlyEditMessage: "정책 편집은 관리자만 가능합니다. 편집 권한이 없습니다.",
    adminOnlyCreateMessage: "정책 생성은 관리자만 가능합니다. 관리자에게 문의하세요.",
    updateSuccess: "정책이 성공적으로 업데이트되었습니다",
    updateFailed: "정책 업데이트에 실패했습니다",
    validationError: "입력 내용을 확인해 주세요"
  },
  analysis: {
    title: "분석",
    description: "모델 × 데이터셋 평가 결과",
    noDataMessage: "분석 데이터가 없습니다",
    noDataForPolicyMessage: "선택된 정책에 대한 분석 데이터가 없습니다",
    paginationAriaLabel: "페이지네이션",
    displayCount: "표시",
    columns: {
      evaluationDate: "평가 날짜",
      policy: "정책",
      accuracy: "정확도",
      defectDetectionRate: "결함 탐지율",
      reliability: "신뢰성",
      responseTime: "응답 시간",
      stability: "안정성",
      actions: "작업"
    },
    actions: {
      view: "보기"
    }
  }
} as const;



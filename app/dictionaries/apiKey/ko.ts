import type { APIKeyLocale } from './apiKey.d';

const ko: APIKeyLocale = {
  title: 'API 키 관리',
  actions: {
    create: '생성',
    edit: '편집',
    delete: '삭제',
    save: '저장',
    cancel: '취소',
    back: '뒤로',
  },
  table: {
    apiName: 'API 이름',
    description: '설명',
    createdAt: '생성일',
    endpoint: '엔드포인트',
    actions: '작업',
  },
  modal: {
    title: 'API 키 편집',
    apiName: 'API 이름',
    description: '설명',
  },
  messages: {
    noData: '데이터가 없습니다',
    updateFailed: '업데이트 실패',
    deleteFailed: '삭제 실패',
    confirmDelete: '이 API 키를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
    createFailed: '생성 실패',
    idRequired: 'id가 필요합니다',
    deleteSuccess: '성공적으로 삭제되었습니다',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME이 설정되지 않았습니다',
    apiGatewayDeleteFailed: 'API Gateway 키 삭제에 실패했습니다',
    idAndApiNameRequired: 'id와 apiName은 필수입니다',
    updateSuccess: '성공적으로 업데이트되었습니다',
  },
  alerts: {
    adminOnlyCreate: '관리자만 생성할 수 있습니다',
    adminOnlyEdit: '관리자만 편집할 수 있습니다',
    adminOnlyDelete: '관리자만 삭제할 수 있습니다',
  },
  create: {
    title: 'API 키 발급',
    fields: {
      apiName: 'API 이름',
      apiDescription: 'API 설명',
      policy: 'API 유형 (정책)',
    },
    submit: 'API 키 발급',
    issuedNote: '키는 한 번만 표시됩니다. 안전한 곳에 저장하세요.',
    endpointLabel: '업로드 엔드포인트',
    instructions: '다음을 디바이스에 설정하세요.',
    apiKeyHeaderLabel: 'API 키 (헤더 x-api-key)',
    uploadExampleTitle: '업로드 예시 (PowerShell / PNG)',
    csvNote: 'CSV의 경우 Content-Type을 text/csv로 설정하세요. 다른 파일 유형에 맞게 조정하세요.',
    filePathNote: '파일 경로를 지정하세요',
  },
};

export default ko;
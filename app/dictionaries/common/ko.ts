import type { CommonLocale } from './common.d.ts';

const ko: CommonLocale = {
  common: {
    navigation: {
      home: '홈',
      about: '회사 소개',
      pricing: '요금',
      contact: '문의',
      signIn: '로그인',
      signUp: '회원가입',
      signOut: '로그아웃',
      dashboard: '대시보드',
      flow: '사용 방법',
      blog: '블로그',
      services: '서비스',
      myPage: '마이페이지',
      supportCenter: '지원 센터',
      faq: '자주 묻는 질문',
    },
    footer: {
      title: 'siftbeam',
      description:
        '엔터프라이즈 데이터 처리 서비스. 맞춤형 워크플로우로 비즈니스 데이터 작업을 자동화합니다.',
      links: {
        terms: '이용약관',
        privacy: '개인정보 처리방침',
        legalDisclosures: '전자상거래법에 따른 표기',
        blog: '블로그',
        faq: '자주 묻는 질문',
      },
      copyright: '주식회사 커넥트테크',
    },
    fileUploader: {
      dragAndDrop: '파일을 드래그 & 드롭',
      or: '또는',
      selectFile: '파일 선택',
      maxFilesAndSize: '최대 {maxFiles}개, {maxFileSize}MB 이하의 파일',
      supportedFormats: '지원 형식: 이미지, 동영상, 오디오, 문서 파일',
      pendingFiles: '업로드 대기 중 ({count}개)',
      uploadStart: '업로드 시작',
      uploading: '업로드 중...',
      uploadedFiles: '업로드 완료 ({count}개)',
      uploadComplete: '업로드 완료',
      uploadError: '업로드 오류',
      uploadFailed: '업로드에 실패했습니다',
      maxFilesExceeded: '최대 {maxFiles}개까지 업로드할 수 있습니다.',
      fileSizeExceeded: '파일 크기는 {maxFileSize}MB 이하여야 합니다.\n용량 초과 파일: {files}',
      oversizedFiles: '용량 초과 파일',
    },
  },
};

export default ko;

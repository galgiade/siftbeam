import type { FlowLocale } from './flow.d';

const ko: FlowLocale = {
  flow: {
    hero: {
      badge: '이용 흐름',
      title: '시작하기 – 이용 절차',
      subtitle:
        '회원가입부터 처리 결과 다운로드까지, 5단계로 안내드립니다.',
    },
    steps: {
      step1: {
        badge: 'STEP 1',
        tag: '바로 시작',
        title: '회원가입',
        description:
          '이메일과 비밀번호로 계정을 생성합니다. 인증은 안전하게 관리됩니다.',
      },
      step2: {
        badge: 'STEP 2',
        tag: '신규 주문 페이지',
        title: '요건 확인',
        description:
          '신규 주문 페이지에서 분석 목적, 사용 데이터, 출력 형식 등 요구 사항을 알려주세요.',
      },
      step3: {
        badge: 'STEP 3',
        tag: '약 2주',
        title: '처리 설정',
        description:
          '요구 사항을 바탕으로 최적의 처리 흐름을 구성합니다. 진행 상황은 대시보드에서 확인할 수 있습니다.',
      },
      step4: {
        badge: 'STEP 4',
        tag: '설정 완료 후',
        title: '처리 선택 및 업로드',
        description:
          '사용할 처리 유형을 선택하고 파일을 업로드합니다. 대용량 파일도 지원합니다.',
      },
      step5: {
        badge: 'STEP 5',
        tag: '자동 알림',
        title: '처리 완료 및 다운로드',
        description:
          '처리가 완료되면 알림이 전송됩니다. 결과 파일을 다운로드하고 필요 시 재실행할 수 있습니다.',
      },
    },
    notice:
      '기간은 참고용이며, 복잡도와 데이터 양에 따라 달라질 수 있습니다. 담당자가 상세 안내를 드립니다.',
    cta: {
      title: '지금 시작하기',
      description: '계정을 생성하고 원하는 분석을 요청하세요.',
      button: '회원가입으로 이동',
    },
  },
};

export default ko;

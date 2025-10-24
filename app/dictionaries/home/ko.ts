const ko = {
  hero: {
    title: "siftbeam",
    subtitle: "기업 데이터를 활용하여 AI의 힘으로 미래 비즈니스를 창출합니다",
    contact: "문의하기",
    buttons: {
      howTo: "사용 방법 보기",
      pricing: "요금 보기",
    }
  },
  features: {
    title: "고도화된 AI 기술이 실현하는 세 가지 가치",
    dataAnalysis: {
      title: "데이터 분석",
      description: "데이터를 안전하게 분석하여 고유한 패턴을 발견합니다.",
      points: [
        "정책 선택과 대용량 일괄 업로드",
        "이번 달 사용량 바와 초과 알림",
        "사용자/정책/날짜/사용량 필터",
        "ZIP 일괄 다운로드, 삭제, AI 학습 전환",
      ]
    },
    anomalyDetection: {
      title: "실시간 이상 감지",
      description: "고정밀 이상 감지로 비즈니스 리스크를 조기에 파악하고 대응합니다.",
      points: [
        "알림/제한 두 가지 모드 지원",
        "사용량/비용 기준 임계값 설정",
        "초과 시 알림 또는 자동 제한",
        "현재 사용량에 따른 적절한 제한 자동 표시",
      ]
    },
    customAI: {
      title: "맞춤형 AI 예측",
      description: "귀사의 데이터로 학습된 AI 모델이 미래 트렌드를 예측하고 의사결정을 지원합니다.",
      points: [
        "주요 지표: 정밀도/재현율/F1/오류율",
        "P95 지연과 같은 운영 지표",
        "보고서 링크 보기 및 검증",
        "정책별 필터 및 정렬",
      ]
    }
  },
  steps: {
    title: "간단 3단계로 시작하기",
    step1: {
      title: "안전한 데이터 연동",
      description: "암호화된 데이터를 드래그 앤 드롭 또는 API로 안전하게 업로드합니다. 이중 인증으로 완전한 보안을 보장합니다."
    },
    step2: {
      title: "AI 모델 커스터마이즈",
      description: "필요에 맞춘 고성능 AI 모델을 선택 및 조정합니다."
    },
    step3: {
      title: "실시간 분석",
      description: "직관적인 대시보드로 분석 결과를 실시간 시각화합니다. 사용량 기반 과금으로 비용을 최적화합니다."
    }
  },
  cta: {
    title: "비즈니스의 미래를 예측하는 힘을 손에",
    description: "최신 AI 기술로 비즈니스를 한 단계 끌어올리세요. 지금 바로 편하게 문의해주세요.",
    button: "문의하기",
    secondaryButton: "먼저 설정 단계 보기"
  }
} as const;

export default ko;



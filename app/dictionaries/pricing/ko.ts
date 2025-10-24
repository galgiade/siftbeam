import type { PricingLocale } from './pricing.d.ts';

const koPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: '투명한 요금제',
      titleMain: '간단하고 명확한',
      titleSub: '요금제',
      subtitle: '사용한 만큼만 지불하세요. 숨겨진 비용은 없습니다.',
    },
    cards: {
      processing: {
        title: '데이터 처리료',
        subtitle: '입력 파일 크기에 따라 (1년 보관 포함)',
        price: '$0.00001 / B',
        info: 'B당 0.001센트로 처리됩니다. 처리 후 데이터는 1년간 보관됩니다.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: '요금 계산 예시',
      description: '실제 사용 예시로 요금을 확인하세요',
      small: {
        title: '소규모 파일 예시',
        bullet: '100B 파일 1개 업로드',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (1년 보관 포함)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: '대규모 파일 예시',
        bullet: '2MB(2,097,152B) 파일 3개 업로드',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (1년 보관 포함)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: '총 데이터량:',
        feeProcessing: '처리료:',
        feeStorage: '보관료:',
        total: '합계:',
      },
    },
    cta: {
      title: '지금 시작하기',
      description: '투명하고 명확한 요금제로 안심하고 이용하세요. 처리 후 데이터는 1년간 무료로 보관됩니다.',
      button: '회원가입',
    },
    notice: '가격은 예고 없이 변경될 수 있습니다. 최신 정보는 본 페이지를 확인해 주세요. 처리 후 데이터는 1년간 보관되며, 그 후 자동으로 삭제됩니다.',
  },
};

export default koPricing;


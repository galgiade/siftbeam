import type LegalDisclosuresLocale from "./legalDisclosures";

const ko: LegalDisclosuresLocale = {
  title: "법적 고지사항 및 사업 조건",
  intro: "이 공개는 적용 가능한 소비자 보호 법률 및 규정에 따라 제공됩니다. ConnectTech Inc.(\"우리\", \"저희\", \"당사\")는 \"siftbeam\" 서비스에 관한 다음 정보를 제공합니다.",
  sections: {
    company: {
      title: "사업자 정보",
      items: [
        "사업자명: ConnectTech Inc.",
        "대표자: Kazuaki Matsui",
        "주소: Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japan",
        "전화번호: 요청 시 제공",
        "이메일: connectechceomatsui@gmail.com",
        "고객지원: 채팅 지원 (일반적으로 영업일 기준 3일 이내 응답)",
        "웹사이트: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "가격 및 서비스 요금",
      items: [
        "사용량 기반 요금제 (통화: USD)",
        "데이터 처리 요금: 바이트당 0.001 US 센트 (1년 보관 포함)",
        "처리된 데이터는 1년간 보관되며 이후 자동 삭제됩니다",
        "무료 티어, 최소 사용 요금 또는 설정 비용 없음",
        "가격은 합리적인 사전 통지 후 변경될 수 있습니다",
      ],
    },
    payment: {
      title: "결제 방법 및 조건",
      items: [
        "결제 방법: 신용카드 (Stripe를 통한)",
        "청구 주기: 매월 월말 마감 (당월 1일~말일 사용분)",
        "청구서 발행일: 익월 1일",
        "결제 시기: 청구서 발행 시 등록된 신용카드로 자동 결제",
        "반올림: Stripe의 통화 정밀도 및 최소 결제 단위에 따라 발생할 수 있습니다",
        "세금: 법률에 따라 추가 요금이 적용될 수 있습니다",
        "추가 요금: 인터넷 연결 비용 (고객 부담)",
      ],
    },
    service: {
      title: "서비스 제공",
      items: [
        "서비스 이용 가능 시점: 결제 확인 후 즉시",
        "시스템 요구사항: Google Chrome, Microsoft Edge 또는 Safari 최신 버전 권장",
      ],
    },
    cancellation: {
      title: "해지 및 환불",
      items: [
        "계정 설정을 통해 언제든지 해지 가능",
        "해지 요청 후 법적 준수, 지원 및 청구 목적으로 사용자 데이터를 최대 90일간 보관합니다",
        "보관 기간 중 서비스 접근은 비활성화되며 추가 요금은 발생하지 않습니다",
        "지원팀에 요청 시 즉시 삭제 가능 (추가 저장 요금 없음)",
        "90일 후 자동으로 완전 삭제 (백업 삭제는 추가 시간이 필요할 수 있음)",
        "디지털 서비스의 특성상 이미 제공된 서비스에 대한 환불은 제공되지 않습니다 (법률에서 요구하는 경우 제외)",
      ],
    },
    environment: {
      title: "시스템 요구사항",
      items: [
        "Google Chrome, Microsoft Edge 또는 Safari 최신 버전 권장",
        "인터넷 연결 필요",
      ],
    },
    restrictions: {
      title: "사용 제한",
      items: [
        "특별한 제한 없음",
      ],
    },
    validity: {
      title: "신청 유효 기간",
      items: [
        "특별한 유효 기간 없음",
      ],
    },
    specialConditions: {
      title: "특별 조건",
      items: [
        "무료 체험 및 특별 혜택은 당사 약관에 따릅니다",
      ],
    },
    businessHours: {
      title: "영업 시간 및 고객지원",
      items: [
        "고정된 영업 시간 없음",
        "채팅을 통한 지원만 제공, 일반적으로 영업일 기준 3일 이내 응답",
      ],
    },
    governingLaw: {
      title: "준거법 및 관할",
      items: [
        "일본 법률에 의해 규율됨",
        "분쟁은 하마마쓰 지방법원의 전속 관할에 따릅니다 (이용약관에 따라)",
      ],
    },
  },
  appendix: {
    lastUpdated: "2025년 11월 7일",
    company: {
      name: "ConnectTech Inc.",
      address: "Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default ko;

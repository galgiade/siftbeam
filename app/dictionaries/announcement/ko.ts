export const announcement = {
  locale: 'ko',
  hero: {
    title: '공지사항',
    subtitle: '최신 공지사항을 확인하세요',
  },
  table: {
    date: '날짜',
    category: '카테고리',
    title: '제목',
    priority: '우선순위',
    action: '작업',
    viewDetails: '상세보기',
    noAnnouncements: '공지사항이 없습니다',
  },
  category: {
    price: '가격',
    feature: '기능',
    other: '기타',
  },
  priority: {
    high: '높은 우선순위',
    medium: '중간 우선순위',
    low: '낮은 우선순위',
  },
  error: {
    fetchFailed: '공지사항을 가져오는데 실패했습니다',
    notFound: '공지사항을 찾을 수 없습니다',
  },
  detail: {
    backToList: '공지사항 목록으로 돌아가기',
    noContent: '콘텐츠가 없습니다',
  },
  categoryDisplay: {
    price: '가격',
    feature: '기능',
    other: '기타',
  },
} as const;

export default announcement;

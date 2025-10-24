export const announcement = {
  locale: 'ja',
  hero: {
    title: 'お知らせ一覧',
    subtitle: '最新のお知らせをご確認ください',
  },
  table: {
    date: '日付',
    category: 'カテゴリ',
    title: 'タイトル',
    priority: '優先度',
    action: '操作',
    viewDetails: '詳細を見る',
    noAnnouncements: 'お知らせがありません',
  },
  category: {
    price: '価格',
    feature: '機能',
    other: 'その他',
  },
  priority: {
    high: '高優先度',
    medium: '中優先度',
    low: '低優先度',
  },
  error: {
    fetchFailed: 'お知らせの取得に失敗しました',
    notFound: 'お知らせが見つかりませんでした',
  },
  detail: {
    backToList: 'お知らせ一覧に戻る',
    noContent: 'コンテンツがありません',
  },
  categoryDisplay: {
    price: '価格',
    feature: '機能',
    other: 'その他',
  },
} as const;

export default announcement;

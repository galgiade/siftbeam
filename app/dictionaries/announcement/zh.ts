export const announcement = {
  locale: 'zh',
  hero: {
    title: '公告',
    subtitle: '查看最新公告',
  },
  table: {
    date: '日期',
    category: '类别',
    title: '标题',
    priority: '优先级',
    action: '操作',
    viewDetails: '查看详情',
    noAnnouncements: '暂无公告',
  },
  category: {
    price: '价格',
    feature: '功能',
    other: '其他',
  },
  priority: {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  },
  error: {
    fetchFailed: '获取公告失败',
    notFound: '未找到公告',
  },
  detail: {
    backToList: '返回公告列表',
    noContent: '暂无内容',
  },
  categoryDisplay: {
    price: '价格',
    feature: '功能',
    other: '其他',
  },
} as const;

export default announcement;

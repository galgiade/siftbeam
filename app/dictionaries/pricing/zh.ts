import type { PricingLocale } from './pricing.d.ts';

const zhCNPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: '透明的定价',
      titleMain: '简单清晰',
      titleSub: '价格',
      subtitle: '只为实际使用付费。没有隐藏费用。',
    },
    cards: {
      processing: {
        title: '数据处理费',
        subtitle: '根据输入文件大小（包含1年存储）',
        price: '$0.00001 / B',
        info: '每B 0.001美分的处理费用。处理后的数据将保存1年。',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: '价格示例',
      description: '通过实际示例了解价格计算方式',
      small: {
        title: '小文件示例',
        bullet: '上传一个 100B 的文件',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001（包含1年存储）',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: '大文件示例',
        bullet: '上传三个 2MB（2,097,152B）的文件',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91（包含1年存储）',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: '总数据量:',
        feeProcessing: '处理费:',
        feeStorage: '存储费:',
        total: '合计:',
      },
    },
    cta: {
      title: '立即开始',
      description: '以简单透明的定价安心使用我们的服务。处理后的数据将免费保存1年。',
      button: '注册',
    },
    notice: '价格如有变动，恕不另行通知。请以本页面的最新信息为准。处理后的数据将保存1年，之后自动删除。',
  },
};

export default zhCNPricing;


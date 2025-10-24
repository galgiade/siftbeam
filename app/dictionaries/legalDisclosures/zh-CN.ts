import type LegalDisclosuresLocale from "./legalDisclosures";

const zhCN: LegalDisclosuresLocale = {
  title: "法律声明和商业条款",
  intro: "本披露根据适用的消费者保护法律法规提供。ConnectTech Inc.（\"我们\"、\"我们的\"、\"本公司\"）提供以下关于我们\"siftbeam\"服务的信息。",
  sections: {
    company: {
      title: "公司信息",
      items: [
        "公司名称: ConnectTech Inc.",
        "代表: Kazuaki Matsui",
        "地址: 日本静冈县滨松市中央区和合町315-1485 迪亚斯和合202号",
        "电话: 按需提供",
        "邮箱: connectechceomatsui@gmail.com",
        "支持: 聊天支持（通常在3个工作日内回复）",
        "网站: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "定价和服务费用",
      items: [
        "按使用量付费定价（货币: USD）",
        "数据处理费用: 每字节0.001美分（含1年存储）",
        "处理后的数据保存1年，随后自动删除",
        "无免费层级、最低使用费或设置费用",
        "价格可在合理提前通知后更改",
      ],
    },
    payment: {
      title: "支付方式和条款",
      items: [
        "支付方式: 信用卡（通过Stripe）",
        "计费周期: 月末",
        "付款日期: 每月5日",
        "四舍五入: 可能基于Stripe的货币精度和最小支付单位发生",
        "税费: 可能根据法律适用额外费用",
        "额外费用: 互联网连接费用（客户承担）",
      ],
    },
    service: {
      title: "服务交付",
      items: [
        "服务可用性: 付款确认后立即",
        "系统要求: 推荐使用最新版本的Google Chrome、Microsoft Edge或Safari",
      ],
    },
    cancellation: {
      title: "取消和退款",
      items: [
        "可通过账户设置随时取消",
        "取消请求后，用户数据最多保留90天用于法律合规、支持和计费",
        "在保留期间，服务访问被禁用，且不再产生额外费用",
        "可向支持部门请求立即删除（无额外存储费用）",
        "90天后自动完全删除（备份删除可能需要额外时间）",
        "由于数字服务的性质，已提供的服务不提供退款（法律要求的情况除外）",
      ],
    },
    environment: {
      title: "系统要求",
      items: [
        "推荐使用最新版本的Google Chrome、Microsoft Edge或Safari",
        "需要互联网连接",
      ],
    },
    restrictions: {
      title: "使用限制",
      items: [
        "无特定限制",
      ],
    },
    validity: {
      title: "申请有效期",
      items: [
        "无特定有效期",
      ],
    },
    specialConditions: {
      title: "特殊条件",
      items: [
        "免费试用和特殊优惠受我们的条款和条件约束",
      ],
    },
    businessHours: {
      title: "营业时间和支持",
      items: [
        "无固定营业时间",
        "仅通过聊天提供支持，通常在3个工作日内回复",
      ],
    },
    governingLaw: {
      title: "适用法律和管辖权",
      items: [
        "受日本法律管辖",
        "争议受滨松地方法院的专属管辖权（根据服务条款）",
      ],
    },
  },
  appendix: {
    lastUpdated: "2025年9月21日",
    company: {
      name: "ConnectTech Inc.",
      address: "日本静冈县滨松市中央区和合町315-1485 迪亚斯和合202号",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default zhCN;

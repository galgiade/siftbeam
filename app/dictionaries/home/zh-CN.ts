const zhCN = {
  hero: {
    title: "siftbeam",
    subtitle: "利用企业数据与 AI 力量创造未来业务",
    contact: "联系我们",
    buttons: {
      howTo: "查看使用方法",
      pricing: "查看定价",
    }
  },
  features: {
    title: "先进 AI 技术实现的三大价值",
    dataAnalysis: {
      title: "数据分析",
      description: "安全分析数据，发现独特模式。",
      points: [
        "策略选择与大批量上传",
        "本月使用率条与超限提醒",
        "按用户/策略/日期/使用量筛选",
        "ZIP 批量下载、删除、切换 AI 学习",
      ]
    },
    anomalyDetection: {
      title: "实时异常检测",
      description: "高精度异常检测，及早识别并应对业务风险。",
      points: [
        "两种模式：通知/限制",
        "基于使用量/费用的阈值设置",
        "超限时通知或自动限制",
        "根据当前使用量自动显示合适的限制",
      ]
    },
    customAI: {
      title: "自定义 AI 预测",
      description: "基于您的数据训练的 AI 模型预测未来趋势并支持决策。",
      points: [
        "核心指标：Precision/Recall/F1/错误率",
        "运营指标：如 P95 延迟",
        "查看并验证报告链接",
        "按策略筛选和排序",
      ]
    }
  },
  steps: {
    title: "三步轻松开始",
    step1: {
      title: "安全的数据整合",
      description: "通过拖拽上传或 API 安全上传加密数据。双重认证确保完全安全。"
    },
    step2: {
      title: "AI 模型定制",
      description: "根据您的特定需求选择并调整高性能 AI 模型。"
    },
    step3: {
      title: "实时分析",
      description: "使用直观的仪表盘实时可视化分析结果。按量计费优化成本。"
    }
  },
  cta: {
    title: "获得预测业务未来的能力",
    description: "借助最新 AI 技术将您的业务提升到新水平。欢迎随时联系我们。",
    button: "联系我们",
    secondaryButton: "先查看设置步骤"
  }
} as const;

export default zhCN;

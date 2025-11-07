const zhCN = {
  hero: {
    title: "siftbeam",
    subtitle: "高效数据处理与管理平台",
    contact: "联系我们",
    buttons: {
      howTo: "查看使用方法",
      pricing: "查看定价",
    }
  },
  features: {
    title: "数据处理平台的三大核心功能",
    dataAnalysis: {
      title: "灵活的数据管理",
      description: "基于策略上传和管理文件。详细追踪处理历史记录。",
      points: [
        "策略选择与大批量上传",
        "本月使用量条与超限提醒",
        "按用户/策略/日期/使用量筛选",
        "ZIP 批量下载、删除、切换学习权限",
      ]
    },
    anomalyDetection: {
      title: "使用量监控与控制",
      description: "实时监控数据使用量，根据设定的限制值执行通知或自动限制。",
      points: [
        "两种模式：通知/限制",
        "基于使用量/费用的阈值设置",
        "超限时通知或自动限制",
        "根据当前使用量自动显示合适的限制",
      ]
    },
    customAI: {
      title: "处理结果分析与报告",
      description: "查看处理结果的详细分析数据，用于运营优化。",
      points: [
        "查看处理结果的详细指标",
        "延迟等运营性能指标",
        "查看并验证详细报告",
        "按策略筛选和排序",
      ]
    }
  },
  steps: {
    title: "三步轻松开始",
    step1: {
      title: "策略设置与数据上传",
      description: "创建定义允许文件格式的策略，然后通过拖拽或 API 上传数据。双重认证确保安全性。"
    },
    step2: {
      title: "自动处理执行",
      description: "上传的数据根据选定的策略自动处理。处理结果保存一年。"
    },
    step3: {
      title: "处理历史管理与性能评估",
      description: "使用直观的仪表盘查看处理历史。实时监控处理模型性能指标，实现最佳运营。按量计费优化成本。"
    }
  },
  cta: {
    title: "立即开始高效数据处理",
    description: "使用策略定义处理规则，高效管理大量数据。按使用量付费，消除不必要的成本。",
    button: "联系我们",
    secondaryButton: "先查看设置步骤"
  }
} as const;

export default zhCN;

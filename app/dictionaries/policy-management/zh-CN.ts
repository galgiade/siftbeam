export default {
  label: {
    policyList: "策略列表",
    policyNotRegistered: "尚未注册策略",
    policyName: "策略名称",
    policyNamePlaceholder: "策略名称",
    description: "策略说明",
    descriptionPlaceholder: "策略说明",
    allowedFileTypes: "允许的文件类型：",
    selectFileTypes: "选择文件类型（可多选）",
    fileTypes: {
      "image/jpeg": "JPEG 图片",
      "image/png": "PNG 图片",
      "image/gif": "GIF 图片",
      "image/webp": "WebP 图片",
      "application/pdf": "PDF 文件",
      "text/csv": "CSV 文件",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel 文件 (.xlsx)",
      "application/vnd.ms-excel": "Excel 文件 (.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word 文件 (.docx)",
      "application/msword": "Word 文件 (.doc)",
      "text/plain": "文本文件",
      "application/json": "JSON 文件",
      "application/zip": "ZIP 压缩包"
    }
  },
  alert: {
    required: "此字段为必填项",
    invalidEmail: "请输入有效的邮箱地址",
    fileTypeRequired: "请至少选择一种文件类型",
    adminOnlyEditMessage: "仅管理员可以编辑策略。您没有编辑权限。",
    adminOnlyCreateMessage: "仅管理员可以创建策略。请联系您的管理员。",
    updateSuccess: "策略更新成功",
    updateFailed: "策略更新失败",
    validationError: "请检查您的输入"
  },
  analysis: {
    title: "分析",
    description: "模型 × 数据集评估结果",
    noDataMessage: "没有分析数据",
    noDataForPolicyMessage: "所选策略没有分析数据",
    paginationAriaLabel: "分页",
    displayCount: "显示",
    columns: {
      evaluationDate: "评估日期",
      policy: "策略",
      accuracy: "准确度",
      defectDetectionRate: "缺陷检测率",
      reliability: "可靠性",
      responseTime: "响应时间",
      stability: "稳定性",
      actions: "操作"
    },
    actions: {
      view: "查看"
    }
  }
} as const;



import type { FlowLocale } from './flow.d';

const zhCN: FlowLocale = {
  flow: {
    hero: {
      badge: '流程',
      title: '快速开始 – 使用步骤',
      subtitle:
        '从注册到下载处理结果，共 5 个简单步骤。',
    },
    steps: {
      step1: {
        badge: '第 1 步',
        tag: '立即开始',
        title: '注册',
        description:
          '使用邮箱和密码创建账户。我们将安全地管理身份验证。',
      },
      step2: {
        badge: '第 2 步',
        tag: '新建订单页面',
        title: '需求沟通',
        description:
          '在新建订单页面说明需求：分析目标、使用数据和输出格式等。',
      },
      step3: {
        badge: '第 3 步',
        tag: '约 2 周',
        title: '处理流程设置',
        description:
          '我们将根据需求设计最优流程。可在仪表盘查看进度。',
      },
      step4: {
        badge: '第 4 步',
        tag: '设置完成后',
        title: '选择处理并上传',
        description:
          '选择需要的处理并上传文件。支持大文件。',
      },
      step5: {
        badge: '第 5 步',
        tag: '自动通知',
        title: '完成并下载',
        description:
          '处理完成后将通知您。下载结果文件，如有需要可重新执行。',
      },
    },
    notice:
      '时间为参考，可能因复杂度和数据量而变化。我们会有专人进一步说明。',
    cta: {
      title: '立即开始',
      description: '创建账户并提交您的数据分析需求。',
      button: '前往注册',
    },
  },
};

export default zhCN;

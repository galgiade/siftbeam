import type { CommonLocale } from './common.d.ts';

const zh: CommonLocale = {
  common: {
    navigation: {
      home: '首页',
      about: '关于我们',
      pricing: '价格',
      contact: '联系我们',
      signIn: '登录',
      signUp: '注册',
      signOut: '退出',
      dashboard: '仪表板',
      flow: '使用方法',
      announcement: '公告',
      services: '服务',
      myPage: '我的页面',
      supportCenter: '支持中心',
    },
    footer: {
      title: 'siftbeam',
      description:
        '释放数据的力量，开创业务未来的智能预测分析平台。',
      links: {
        terms: '服务条款',
        privacy: '隐私政策',
        legalDisclosures: '法律声明',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: '拖放文件',
      or: '或',
      selectFile: '选择文件',
      maxFilesAndSize: '最多 {maxFiles} 个文件，每个 {maxFileSize}MB',
      supportedFormats: '支持格式: 图片、视频、音频、文档文件',
      pendingFiles: '待上传 ({count} 个文件)',
      uploadStart: '开始上传',
      uploading: '上传中...',
      uploadedFiles: '已上传 ({count} 个文件)',
      uploadComplete: '上传完成',
      uploadError: '上传错误',
      uploadFailed: '上传失败',
      maxFilesExceeded: '最多可上传 {maxFiles} 个文件。',
      fileSizeExceeded: '文件大小必须为 {maxFileSize}MB 或更小。\n超大文件: {files}',
      oversizedFiles: '超大文件',
    },
  },
};

export default zh;

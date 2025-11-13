import type { CommonLocale } from './common.d.ts';

const ja: CommonLocale = {
  common: {
    navigation: {
      home: 'ホーム',
      about: '会社概要',
      pricing: '料金',
      contact: 'お問い合わせ',
      signIn: 'サインイン',
      signUp: 'サインアップ',
      signOut: 'サインアウト',
      dashboard: 'ダッシュボード',
      flow: '使い方',
      blog: 'ブログ',
      services: 'サービス',
      myPage: 'マイページ',
      supportCenter: 'サポートセンター',
      faq: 'よくある質問',
    },
    footer: {
      title: 'siftbeam',
      description:
        'エンタープライズ向けデータ処理サービス。カスタマイズ可能なワークフローで、ビジネスのデータ処理を自動化します。',
      links: {
        terms: '利用規約',
        privacy: 'プライバシーポリシー',
        legalDisclosures: '特定商取引法に基づく表記',
        blog: 'ブログ',
        faq: 'よくある質問',
      },
      copyright: '株式会社コネクトテック',
    },
    fileUploader: {
      dragAndDrop: 'ファイルをドラッグ&ドロップ',
      or: 'または',
      selectFile: 'ファイルを選択',
      maxFilesAndSize: '最大{maxFiles}個、{maxFileSize}MB以下のファイル',
      supportedFormats: '対応形式: 画像、動画、音声、文書ファイル',
      pendingFiles: 'アップロード待ち ({count}件)',
      uploadStart: 'アップロード開始',
      uploading: 'アップロード中...',
      uploadedFiles: 'アップロード済み ({count}件)',
      uploadComplete: 'アップロード完了',
      uploadError: 'アップロードエラー',
      uploadFailed: 'アップロードに失敗しました',
      maxFilesExceeded: '最大{maxFiles}個までのファイルをアップロードできます。',
      fileSizeExceeded: 'ファイルサイズは{maxFileSize}MB以下にしてください。\n大きすぎるファイル: {files}',
      oversizedFiles: '大きすぎるファイル',
    },
  },
};

export default ja;



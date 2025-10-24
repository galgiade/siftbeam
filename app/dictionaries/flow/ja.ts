import type { FlowLocale } from './flow.d';

const ja: FlowLocale = {
  flow: {
    hero: {
      badge: 'ご利用の流れ',
      title: 'はじめての方へ – 利用開始までのステップ',
      subtitle:
        '会員登録からデータダウンロードまで、スムーズにご利用いただくための 5 ステップをご紹介します。',
    },
    steps: {
      step1: {
        badge: 'STEP 1',
        tag: 'すぐに開始',
        title: '会員登録',
        description:
          'メールアドレスとパスワードを登録してアカウントを作成します。認証は安全な方式で管理されます。',
      },
      step2: {
        badge: 'STEP 2',
        tag: '新規注文ページ',
        title: '要件のヒアリング',
        description:
          '新規注文ページにて、どのようなデータ解析をご希望かを具体的に伺います。目的や利用データ、出力形式などを共有ください。',
      },
      step3: {
        badge: 'STEP 3',
        tag: '約2週間',
        title: 'データ処理の設定',
        description:
          'いただいた要件に基づき、最適な処理フローを構築します。設定状況はダッシュボードから確認できます。',
      },
      step4: {
        badge: 'STEP 4',
        tag: '設定完了後',
        title: '処理を選択しアップロード',
        description:
          '使用したいデータ処理を選択し、対象ファイルをアップロードします。大容量ファイルにも対応しています。',
      },
      step5: {
        badge: 'STEP 5',
        tag: '自動通知',
        title: '処理完了・ダウンロード',
        description:
          'データ処理が完了すると通知されます。結果ファイルをダウンロードしてご確認ください。エラー時は再実行も可能です。',
      },
    },
    notice:
      '設定期間は目安です。要件の複雑さやデータ量により前後する場合があります。詳細は担当よりご案内します。',
    cta: {
      title: '今すぐはじめましょう',
      description: 'アカウントを作成して、ご希望のデータ解析を依頼できます。',
      button: '会員登録へ',
    },
  },
};

export default ja;

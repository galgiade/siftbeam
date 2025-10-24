import type { PricingLocale } from './pricing.d.ts';

const jaPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: '透明な料金体系',
      titleMain: 'シンプルで分かりやすい',
      titleSub: '料金体系',
      subtitle: '使用した分だけお支払い。隠れた費用は一切ありません。',
    },
    cards: {
      processing: {
        title: 'データ処理料',
        subtitle: '入力ファイルサイズに応じて（1年間の保管込み）',
        price: '$0.00001 / B',
        info: '1Bあたり0.001セントで処理いたします。処理後のデータは1年間安全に保管されます。',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: '料金計算例',
      description: '実際の使用例で料金を確認できます',
      small: {
        title: '小規模ファイル例',
        bullet: '100B のファイルを 1 つアップロード',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001（1年間保管込み）',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: '大規模ファイル例',
        bullet: '2MB（2,097,152B）のファイルを 3 つアップロード',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91（1年間保管込み）',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: '総データ量:',
        feeProcessing: '処理料:',
        feeStorage: '保管料:',
        total: '合計:',
      },
    },
    cta: {
      title: '今すぐ始めましょう',
      description: '透明で分かりやすい料金体系で、安心してサービスをご利用いただけます。処理後のデータは1年間無料で保管されます。',
      button: '会員登録',
    },
    notice: '価格は予告なく変更される場合があります。最新情報は本ページをご確認ください。処理後のデータは1年間保管され、その後自動的に削除されます。',
  },
};

export default jaPricing;


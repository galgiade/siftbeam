export type PricingLocale = {
  pricing: {
    hero: {
      badge: string;
      titleMain: string;
      titleSub: string;
      subtitle: string;
    };
    cards: {
      processing: {
        title: string;
        subtitle: string;
        price: string;
        info: string;
        rate: number; // 処理料率（1Bあたり、1年間保管込み）
      };
    };
    examples: {
      title: string;
      description: string;
      small: {
        title: string;
        bullet: string;
        dataSize: number; // データサイズ（B）
        processingFee: string; // 処理料の計算式（1年間保管込み）
        storageFee: string; // 空文字列（保管料は処理料に含まれる）
        total: string; // 合計金額
      };
      large: {
        title: string;
        bullet: string;
        fileSize: number; // 1ファイルあたりのサイズ（B）
        fileCount: number; // ファイル数
        totalDataSize: string; // 総データサイズの計算式
        processingFee: string; // 処理料の計算式（1年間保管込み）
        storageFee: string; // 空文字列（保管料は処理料に含まれる）
        total: string; // 合計金額
      };
      labels: {
        totalData: string;
        feeProcessing: string;
        feeStorage: string;
        total: string;
      };
    };
    cta: {
      title: string;
      description: string;
      button: string;
    };
    notice: string;
  };
};

export default PricingLocale;


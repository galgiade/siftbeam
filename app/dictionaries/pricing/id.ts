import type { PricingLocale } from './pricing.d.ts';

const idPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Harga transparan',
      titleMain: 'Sederhana dan jelas',
      titleSub: 'Harga',
      subtitle: 'Bayar hanya sesuai penggunaan. Tanpa biaya tersembunyi.',
    },
    cards: {
      processing: {
        title: 'Pemrosesan data',
        subtitle: 'Berdasarkan ukuran file masukan (termasuk penyimpanan 1 tahun)',
        price: '$0.00001 / B',
        info: 'Diproses dengan biaya 0,001 sen per B. Data disimpan selama 1 tahun setelah pemrosesan.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Contoh harga',
      description: 'Lihat cara kerja harga dengan contoh nyata',
      small: {
        title: 'Contoh file kecil',
        bullet: 'Unggah satu file 100B',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (termasuk penyimpanan 1 tahun)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Contoh file besar',
        bullet: 'Unggah tiga file 2MB (2,097,152B)',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (termasuk penyimpanan 1 tahun)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Total data:',
        feeProcessing: 'Pemrosesan:',
        feeStorage: 'Penyimpanan:',
        total: 'Total:',
      },
    },
    cta: {
      title: 'Mulai sekarang',
      description: 'Mulai dengan harga yang sederhana dan transparan. Data disimpan selama 1 tahun setelah pemrosesan tanpa biaya tambahan.',
      button: 'Daftar',
    },
    notice:
      'Harga dapat berubah tanpa pemberitahuan. Silakan periksa halaman ini untuk informasi terbaru. Data disimpan selama 1 tahun setelah pemrosesan dan dihapus secara otomatis.',
  },
};

export default idPricing;


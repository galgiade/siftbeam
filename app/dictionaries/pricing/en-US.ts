import type { PricingLocale } from './pricing.d.ts';

const enPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Transparent Pricing',
      titleMain: 'Simple and Clear',
      titleSub: 'Pricing',
      subtitle: 'Pay only for what you use. No hidden fees.',
    },
    cards: {
      processing: {
        title: 'Data Processing',
        subtitle: 'Based on input file size (includes 1-year storage)',
        price: '$0.00001 / B',
        info: 'Processed at 0.001 cents per B. Data is stored for 1 year after processing.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Pricing Examples',
      description: 'See how pricing works with real examples',
      small: {
        title: 'Small File Example',
        bullet: 'Upload one 100B file',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (includes 1-year storage)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Large File Example',
        bullet: 'Upload three 2MB (2,097,152B) files',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (includes 1-year storage)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Total Data:',
        feeProcessing: 'Processing:',
        feeStorage: 'Storage:',
        total: 'Total:',
      },
    },
    cta: {
      title: "Let's get started",
      description: 'Get started with simple, transparent pricing. Data is stored for 1 year after processing at no additional cost.',
      button: 'Sign up',
    },
    notice: 'Prices are subject to change without notice. Please check this page for the latest information. Data is stored for 1 year after processing and automatically deleted thereafter.',
  },
};

export default enPricing;


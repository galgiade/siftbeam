import type { PricingLocale } from './pricing.d.ts';

const ptPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Preços transparentes',
      titleMain: 'Simples e claro',
      titleSub: 'Preços',
      subtitle: 'Pague apenas pelo que usar. Sem taxas ocultas.',
    },
    cards: {
      processing: {
        title: 'Processamento de dados',
        subtitle: 'Com base no tamanho do arquivo de entrada (inclui 1 ano de armazenamento)',
        price: '$0.00001 / B',
        info: 'Processado a 0,001 centavos por B. Os dados são armazenados por 1 ano após o processamento.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Exemplos de preços',
      description: 'Veja como os preços funcionam com exemplos reais',
      small: {
        title: 'Exemplo de arquivo pequeno',
        bullet: 'Enviar um arquivo de 100B',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (inclui 1 ano de armazenamento)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Exemplo de arquivos grandes',
        bullet: 'Enviar três arquivos de 2MB (2,097,152B)',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (inclui 1 ano de armazenamento)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Dados totais:',
        feeProcessing: 'Processamento:',
        feeStorage: 'Armazenamento:',
        total: 'Total:',
      },
    },
    cta: {
      title: 'Comece agora',
      description: 'Comece com preços simples e transparentes. Os dados são armazenados por 1 ano após o processamento sem custo adicional.',
      button: 'Cadastrar',
    },
    notice:
      'Os preços estão sujeitos a alterações sem aviso prévio. Verifique esta página para as informações mais recentes. Os dados são armazenados por 1 ano após o processamento e excluídos automaticamente.',
  },
};

export default ptPricing;


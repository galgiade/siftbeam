import type { PricingLocale } from './pricing.d.ts';

const esPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Precios transparentes',
      titleMain: 'Simple y claro',
      titleSub: 'Precios',
      subtitle: 'Paga solo por lo que uses. Sin costos ocultos.',
    },
    cards: {
      processing: {
        title: 'Procesamiento de datos',
        subtitle: 'Según el tamaño del archivo de entrada (incluye 1 año de almacenamiento)',
        price: '$0.00001 / B',
        info: 'Procesado a 0.001 centavos por B. Los datos se almacenan durante 1 año después del procesamiento.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Ejemplos de precios',
      description: 'Mira cómo funciona el precio con ejemplos reales',
      small: {
        title: 'Ejemplo de archivo pequeño',
        bullet: 'Subir un archivo de 100B',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (incluye 1 año de almacenamiento)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Ejemplo de archivos grandes',
        bullet: 'Subir tres archivos de 2MB (2,097,152B)',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (incluye 1 año de almacenamiento)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Datos totales:',
        feeProcessing: 'Procesamiento:',
        feeStorage: 'Almacenamiento:',
        total: 'Total:',
      },
    },
    cta: {
      title: 'Comienza ahora',
      description: 'Comienza con precios simples y transparentes. Los datos se almacenan durante 1 año después del procesamiento sin costo adicional.',
      button: 'Registrarse',
    },
    notice:
      'Los precios están sujetos a cambios sin previo aviso. Consulta esta página para la información más reciente. Los datos se almacenan durante 1 año después del procesamiento y se eliminan automáticamente.',
  },
};

export default esPricing;


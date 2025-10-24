import type { PricingLocale } from './pricing.d.ts';

const frPricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Tarification transparente',
      titleMain: 'Simple et clair',
      titleSub: 'Tarification',
      subtitle: "Payez uniquement ce que vous utilisez. Aucun frais caché.",
    },
    cards: {
      processing: {
        title: 'Traitement des données',
        subtitle: "En fonction de la taille du fichier d'entrée (inclut 1 an de stockage)",
        price: '$0.00001 / B',
        info: 'Traité à 0,001 cent par B. Les données sont stockées pendant 1 an après le traitement.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Exemples de tarification',
      description: 'Découvrez la tarification avec des exemples réels',
      small: {
        title: 'Exemple de petit fichier',
        bullet: 'Téléversez un fichier de 100B',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (inclut 1 an de stockage)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Exemple de gros fichier',
        bullet: 'Téléversez trois fichiers de 2MB (2,097,152B)',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (inclut 1 an de stockage)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Données totales:',
        feeProcessing: 'Traitement:',
        feeStorage: 'Stockage:',
        total: 'Total:',
      },
    },
    cta: {
      title: 'Commencez maintenant',
      description: 'Démarrez avec une tarification simple et transparente. Les données sont stockées pendant 1 an après le traitement sans frais supplémentaires.',
      button: "S'inscrire",
    },
    notice:
      'Les prix peuvent être modifiés sans préavis. Veuillez consulter cette page pour les informations à jour. Les données sont stockées pendant 1 an après le traitement et supprimées automatiquement.',
  },
};

export default frPricing;


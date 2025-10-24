import type { PricingLocale } from './pricing.d.ts';

const dePricing: PricingLocale = {
  pricing: {
    hero: {
      badge: 'Transparente Preise',
      titleMain: 'Einfach und klar',
      titleSub: 'Preisgestaltung',
      subtitle: 'Zahlen Sie nur für die Nutzung. Keine versteckten Gebühren.',
    },
    cards: {
      processing: {
        title: 'Datenverarbeitung',
        subtitle: 'Basierend auf der Eingabedateigröße (inkl. 1 Jahr Speicherung)',
        price: '$0.00001 / B',
        info: 'Verarbeitet zu 0,001 Cent pro B. Daten werden nach der Verarbeitung 1 Jahr lang gespeichert.',
        rate: 0.00001, // $0.00001 per B
      },
    },
    examples: {
      title: 'Preisbeispiele',
      description: 'Sehen Sie anhand realer Beispiele, wie die Preise funktionieren',
      small: {
        title: 'Beispiel kleine Datei',
        bullet: 'Eine 100B-Datei hochladen',
        dataSize: 100,
        processingFee: '100B × $0.00001 = $0.001 (inkl. 1 Jahr Speicherung)',
        storageFee: '',
        total: '$0.001',
      },
      large: {
        title: 'Beispiel große Dateien',
        bullet: 'Drei Dateien mit 2MB (2,097,152B) hochladen',
        fileSize: 2097152,
        fileCount: 3,
        totalDataSize: '2,097,152B × 3 = 6,291,456B',
        processingFee: '6,291,456B × $0.00001 = $62.91 (inkl. 1 Jahr Speicherung)',
        storageFee: '',
        total: '$62.91',
      },
      labels: {
        totalData: 'Gesamtdaten:',
        feeProcessing: 'Verarbeitung:',
        feeStorage: 'Speicherung:',
        total: 'Summe:',
      },
    },
    cta: {
      title: 'Jetzt loslegen',
      description: 'Starten Sie mit einer einfachen, transparenten Preisgestaltung. Daten werden nach der Verarbeitung 1 Jahr lang kostenlos gespeichert.',
      button: 'Registrieren',
    },
    notice:
      'Preise können ohne Vorankündigung geändert werden. Bitte prüfen Sie diese Seite für aktuelle Informationen. Daten werden nach der Verarbeitung 1 Jahr lang gespeichert und danach automatisch gelöscht.',
  },
};

export default dePricing;


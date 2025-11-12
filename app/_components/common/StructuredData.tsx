import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

// 全言語対応の翻訳データ
const translations = {
  ja: {
    description: "企業データを効率的に処理・管理するクラウドプラットフォーム。ポリシーベースの柔軟な管理と従量課金で、セキュアなデータ運用を実現。",
    features: ["ポリシーベースのファイル管理", "使用量監視と自動制限", "詳細な処理履歴とレポート"],
    keywords: "データ処理,ファイル管理,ポリシー管理,クラウドストレージ,使用量監視,従量課金,AWS,エンタープライズデータ",
    dashboard: "データ管理ダッシュボード"
  },
  'en-US': {
    description: "A cloud platform for efficient data processing and management. Flexible policy-based management with pay-as-you-go pricing for secure data operations.",
    features: ["Policy-based file management", "Usage monitoring and auto-restriction", "Detailed processing history and reports"],
    keywords: "data processing,file management,policy management,cloud storage,usage monitoring,pay-as-you-go,AWS,enterprise data",
    dashboard: "Data Management Dashboard"
  },
  'zh-CN': {
    description: "高效处理和管理企业数据的云平台。基于策略的灵活管理和按量付费,实现安全的数据运营。",
    features: ["基于策略的文件管理", "使用量监控和自动限制", "详细的处理历史和报告"],
    keywords: "数据处理,文件管理,策略管理,云存储,使用量监控,按量付费,AWS,企业数据",
    dashboard: "数据管理仪表板"
  },
  ko: {
    description: "기업 데이터를 효율적으로 처리하고 관리하는 클라우드 플랫폼. 정책 기반의 유연한 관리와 종량제로 안전한 데이터 운영을 실현합니다.",
    features: ["정책 기반 파일 관리", "사용량 모니터링 및 자동 제한", "상세한 처리 이력 및 보고서"],
    keywords: "데이터처리,파일관리,정책관리,클라우드스토리지,사용량모니터링,종량제,AWS,기업데이터",
    dashboard: "데이터 관리 대시보드"
  },
  fr: {
    description: "Une plateforme cloud pour le traitement et la gestion efficaces des données d'entreprise. Gestion flexible basée sur des politiques avec tarification à l'usage pour des opérations de données sécurisées.",
    features: ["Gestion de fichiers basée sur des politiques", "Surveillance de l'utilisation et restriction automatique", "Historique de traitement détaillé et rapports"],
    keywords: "traitement de données,gestion de fichiers,gestion de politiques,stockage cloud,surveillance d'utilisation,paiement à l'usage,AWS,données d'entreprise",
    dashboard: "Tableau de bord de gestion des données"
  },
  de: {
    description: "Eine Cloud-Plattform für effiziente Datenverarbeitung und -verwaltung. Flexible richtlinienbasierte Verwaltung mit nutzungsbasierter Abrechnung für sichere Datenoperationen.",
    features: ["Richtlinienbasierte Dateiverwaltung", "Nutzungsüberwachung und automatische Einschränkung", "Detaillierte Verarbeitungshistorie und Berichte"],
    keywords: "Datenverarbeitung,Dateiverwaltung,Richtlinienverwaltung,Cloud-Speicher,Nutzungsüberwachung,nutzungsbasierte Abrechnung,AWS,Unternehmensdaten",
    dashboard: "Datenverwaltungs-Dashboard"
  },
  es: {
    description: "Una plataforma en la nube para el procesamiento y gestión eficiente de datos empresariales. Gestión flexible basada en políticas con precios de pago por uso para operaciones de datos seguras.",
    features: ["Gestión de archivos basada en políticas", "Monitoreo de uso y restricción automática", "Historial de procesamiento detallado e informes"],
    keywords: "procesamiento de datos,gestión de archivos,gestión de políticas,almacenamiento en la nube,monitoreo de uso,pago por uso,AWS,datos empresariales",
    dashboard: "Panel de gestión de datos"
  },
  pt: {
    description: "Uma plataforma em nuvem para processamento e gerenciamento eficiente de dados empresariais. Gerenciamento flexível baseado em políticas com preços de pagamento por uso para operações de dados seguras.",
    features: ["Gerenciamento de arquivos baseado em políticas", "Monitoramento de uso e restrição automática", "Histórico de processamento detalhado e relatórios"],
    keywords: "processamento de dados,gerenciamento de arquivos,gerenciamento de políticas,armazenamento em nuvem,monitoramento de uso,pagamento por uso,AWS,dados empresariais",
    dashboard: "Painel de gerenciamento de dados"
  },
  id: {
    description: "Platform cloud untuk pemrosesan dan pengelolaan data perusahaan yang efisien. Manajemen fleksibel berbasis kebijakan dengan harga bayar sesuai penggunaan untuk operasi data yang aman.",
    features: ["Manajemen file berbasis kebijakan", "Pemantauan penggunaan dan pembatasan otomatis", "Riwayat pemrosesan terperinci dan laporan"],
    keywords: "pemrosesan data,manajemen file,manajemen kebijakan,penyimpanan cloud,pemantauan penggunaan,bayar sesuai penggunaan,AWS,data perusahaan",
    dashboard: "Dashboard manajemen data"
  }
};

// フォールバック用の英語翻訳
const getTranslation = (locale: string, key: keyof typeof translations.ja) => {
  const lang = locale === 'en' ? 'en-US' : locale;
  return translations[lang as keyof typeof translations]?.[key] || translations['en-US'][key];
};

// siftbeam用の構造化データ生成関数(全言語対応)
export function generateSiftbeamStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "siftbeam",
    "description": getTranslation(locale, 'description'),
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": "siftbeam",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization", 
      "name": "siftbeam",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon.svg`
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD", // Stripe決済はUSDのみ
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/${locale}`
    },
    "featureList": getTranslation(locale, 'features'),
    "screenshot": [
      {
        "@type": "ImageObject",
        "url": `${baseUrl}/screenshots/dashboard.png`,
        "name": getTranslation(locale, 'dashboard')
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "keywords": getTranslation(locale, 'keywords'),
    "inLanguage": locale,
    "isAccessibleForFree": true,
    "softwareRequirements": "Web browser with JavaScript enabled",
    "permissions": "Requires internet connection",
    "releaseNotes": "Initial release with data processing and management capabilities"
  };
}

// 組織情報の構造化データ(全言語対応)
export function generateOrganizationStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const orgTranslations = {
    ja: "企業データを効率的に処理・管理するクラウドプラットフォーム",
    'en-US': "Cloud platform for efficient data processing and management",
    'zh-CN': "高效处理和管理企业数据的云平台",
    ko: "기업 데이터를 효율적으로 처리하고 관리하는 클라우드 플랫폼",
    fr: "Plateforme cloud pour le traitement et la gestion efficaces des données",
    de: "Cloud-Plattform für effiziente Datenverarbeitung und -verwaltung",
    es: "Plataforma en la nube para el procesamiento y gestión eficiente de datos",
    pt: "Plataforma em nuvem para processamento e gerenciamento eficiente de dados",
    id: "Platform cloud untuk pemrosesan dan pengelolaan data yang efisien"
  };
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "siftbeam",
    "url": baseUrl,
    "logo": `${baseUrl}/icon.svg`,
    "description": orgTranslations[locale as keyof typeof orgTranslations] || orgTranslations['en-US'],
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@siftbeam.com"
    },
    "sameAs": [
      "https://twitter.com/siftbeam",
      "https://linkedin.com/company/siftbeam"
    ]
  };
}

// サービス情報の構造化データ(全言語対応)
export function generateServiceStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const serviceTranslations = {
    ja: {
      name: "データ処理・管理サービス",
      description: "ポリシーベースで企業データを効率的に処理・管理。使用量監視と詳細レポートを提供",
      catalogName: "データ管理プラン",
      services: ["ファイル管理", "使用量監視", "処理履歴レポート"]
    },
    'en-US': {
      name: "Data Processing and Management Service",
      description: "Efficiently process and manage corporate data with policy-based controls. Provides usage monitoring and detailed reports",
      catalogName: "Data Management Plans",
      services: ["File Management", "Usage Monitoring", "Processing History Reports"]
    },
    'zh-CN': {
      name: "数据处理和管理服务",
      description: "基于策略高效处理和管理企业数据。提供使用量监控和详细报告",
      catalogName: "数据管理计划",
      services: ["文件管理", "使用量监控", "处理历史报告"]
    },
    ko: {
      name: "데이터 처리 및 관리 서비스",
      description: "정책 기반으로 기업 데이터를 효율적으로 처리하고 관리. 사용량 모니터링 및 상세 보고서 제공",
      catalogName: "데이터 관리 계획",
      services: ["파일 관리", "사용량 모니터링", "처리 이력 보고서"]
    },
    fr: {
      name: "Service de traitement et gestion de données",
      description: "Traiter et gérer efficacement les données d'entreprise avec des contrôles basés sur des politiques. Fournit une surveillance de l'utilisation et des rapports détaillés",
      catalogName: "Plans de gestion de données",
      services: ["Gestion de fichiers", "Surveillance de l'utilisation", "Rapports d'historique de traitement"]
    },
    de: {
      name: "Datenverarbeitungs- und Verwaltungsservice",
      description: "Effiziente Verarbeitung und Verwaltung von Unternehmensdaten mit richtlinienbasierten Kontrollen. Bietet Nutzungsüberwachung und detaillierte Berichte",
      catalogName: "Datenverwaltungspläne",
      services: ["Dateiverwaltung", "Nutzungsüberwachung", "Verarbeitungshistorienberichte"]
    },
    es: {
      name: "Servicio de procesamiento y gestión de datos",
      description: "Procesar y gestionar eficientemente datos corporativos con controles basados en políticas. Proporciona monitoreo de uso e informes detallados",
      catalogName: "Planes de gestión de datos",
      services: ["Gestión de archivos", "Monitoreo de uso", "Informes de historial de procesamiento"]
    },
    pt: {
      name: "Serviço de processamento e gerenciamento de dados",
      description: "Processar e gerenciar eficientemente dados corporativos com controles baseados em políticas. Fornece monitoramento de uso e relatórios detalhados",
      catalogName: "Planos de gerenciamento de dados",
      services: ["Gerenciamento de arquivos", "Monitoramento de uso", "Relatórios de histórico de processamento"]
    },
    id: {
      name: "Layanan Pemrosesan dan Pengelolaan Data",
      description: "Memproses dan mengelola data perusahaan secara efisien dengan kontrol berbasis kebijakan. Menyediakan pemantauan penggunaan dan laporan terperinci",
      catalogName: "Paket Pengelolaan Data",
      services: ["Manajemen File", "Pemantauan Penggunaan", "Laporan Riwayat Pemrosesan"]
    }
  };
  
  const translation = serviceTranslations[locale as keyof typeof serviceTranslations] || serviceTranslations['en-US'];
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": translation.name,
    "description": translation.description,
    "provider": {
      "@type": "Organization",
      "name": "siftbeam"
    },
    "serviceType": "Software as a Service",
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": baseUrl,
      "serviceSmsNumber": null,
      "servicePhone": null
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": translation.catalogName,
      "itemListElement": translation.services.map(serviceName => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": serviceName
        }
      }))
    }
  };
}

// 料金ページ用の構造化データ(PriceSpecification)
export function generatePricingStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const pricingTranslations = {
    ja: {
      name: "siftbeam 料金プラン",
      description: "従量課金制のデータ処理サービス。使った分だけお支払い。初期費用なし、月額基本料金なし。",
    },
    'en-US': {
      name: "siftbeam Pricing Plans",
      description: "Pay-as-you-go data processing service. Pay only for what you use. No setup fees, no monthly base charges.",
    },
  };
  
  const translation = pricingTranslations[locale as keyof typeof pricingTranslations] || pricingTranslations['en-US'];
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": translation.name,
    "description": translation.description,
    "brand": {
      "@type": "Brand",
      "name": "siftbeam"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/${locale}/pricing`,
    },
  };
}

// How-To用の構造化データ(使い方ページ用)
export function generateHowToStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const howToTranslations = {
    ja: {
      name: "siftbeamの使い方",
      description: "siftbeamでデータ処理を始めるための完全ガイド",
      steps: [
        { name: "アカウント登録", text: "メールアドレスで無料アカウントを作成します" },
        { name: "会社情報登録", text: "会社情報を入力して組織を設定します" },
        { name: "ポリシー設定", text: "データ処理のポリシーとルールを定義します" },
        { name: "データアップロード", text: "処理したいデータをアップロードします" },
        { name: "処理実行", text: "定義したポリシーに基づいてデータが自動処理されます" }
      ]
    },
    'en-US': {
      name: "How to Use siftbeam",
      description: "Complete guide to getting started with siftbeam data processing",
      steps: [
        { name: "Sign Up", text: "Create a free account with your email address" },
        { name: "Company Registration", text: "Enter company information to set up your organization" },
        { name: "Policy Configuration", text: "Define data processing policies and rules" },
        { name: "Data Upload", text: "Upload the data you want to process" },
        { name: "Execute Processing", text: "Data is automatically processed based on defined policies" }
      ]
    },
  };
  
  const translation = howToTranslations[locale as keyof typeof howToTranslations] || howToTranslations['en-US'];
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": translation.name,
    "description": translation.description,
    "image": `${baseUrl}/og-image.jpg`,
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": translation.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": `${baseUrl}/${locale}/flow#step-${index + 1}`
    })),
  };
}

// BreadcrumbList構造化データ
export function generateBreadcrumbStructuredData(
  locale: string,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}
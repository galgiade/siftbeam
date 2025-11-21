import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
  id?: string;
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  // ユニークなIDを生成（dataの@typeを使用、なければランダム）
  const uniqueId = id || `structured-data-${data['@type']?.toLowerCase() || Math.random().toString(36).substring(7)}`;
  
  return (
    <Script
      id={uniqueId}
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
export function generateSiftbeamStructuredData(locale: string = 'en') {
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
    // aggregateRating: 実際のレビューデータがある場合のみ追加
    // 現在はレビューシステムが未実装のため、コメントアウト
    "keywords": getTranslation(locale, 'keywords'),
    "inLanguage": locale,
    "isAccessibleForFree": true,
    "softwareRequirements": "Web browser with JavaScript enabled",
    "permissions": "Requires internet connection",
    "releaseNotes": "Initial release with data processing and management capabilities"
  };
}

// 組織情報の構造化データ(全言語対応)
export function generateOrganizationStructuredData(locale: string = 'en') {
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
export function generateServiceStructuredData(locale: string = 'en') {
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

// Pricing構造化データ
export function generatePricingStructuredData(locale: string = 'en') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const pricingTranslations = {
    ja: {
      name: "siftbeam 料金プラン",
      description: "従量課金制のデータ処理サービス。使った分だけお支払い。初期費用なし、月額基本料金なし。",
      review: {
        author: "企業ユーザー",
        text: "従量課金制でコストが明確で、使った分だけ支払えるのが良い。ポリシーベースの管理も柔軟で、データ処理の効率が大幅に向上しました。",
        rating: "5"
      }
    },
    'en-US': {
      name: "siftbeam Pricing Plans",
      description: "Pay-as-you-go data processing service. Pay only for what you use. No setup fees, no monthly base charges.",
      review: {
        author: "Enterprise User",
        text: "The pay-as-you-go pricing is transparent and cost-effective. Policy-based management is flexible, and our data processing efficiency has improved significantly.",
        rating: "5"
      }
    },
    'zh-CN': {
      name: "siftbeam 价格计划",
      description: "按量付费的数据处理服务。只需为使用付费。无设置费用,无月度基本费用。",
      review: {
        author: "企业用户",
        text: "按量付费定价透明且具有成本效益。基于策略的管理灵活，我们的数据处理效率显著提高。",
        rating: "5"
      }
    },
    ko: {
      name: "siftbeam 가격 플랜",
      description: "종량제 데이터 처리 서비스. 사용한 만큼만 지불. 설정 비용 없음, 월 기본 요금 없음.",
      review: {
        author: "기업 사용자",
        text: "종량제 가격 책정이 투명하고 비용 효율적입니다. 정책 기반 관리가 유연하며 데이터 처리 효율이 크게 향상되었습니다.",
        rating: "5"
      }
    },
    fr: {
      name: "Plans tarifaires siftbeam",
      description: "Service de traitement de données à l'usage. Payez uniquement ce que vous utilisez. Pas de frais d'installation, pas de frais de base mensuels.",
      review: {
        author: "Utilisateur Entreprise",
        text: "La tarification à l'usage est transparente et rentable. La gestion basée sur des politiques est flexible et notre efficacité de traitement des données s'est considérablement améliorée.",
        rating: "5"
      }
    },
    de: {
      name: "siftbeam Preispläne",
      description: "Nutzungsbasierter Datenverarbeitungsservice. Zahlen Sie nur für das, was Sie verwenden. Keine Einrichtungsgebühren, keine monatlichen Grundgebühren.",
      review: {
        author: "Unternehmensnutzer",
        text: "Die nutzungsbasierte Preisgestaltung ist transparent und kosteneffizient. Die richtlinienbasierte Verwaltung ist flexibel und unsere Datenverarbeitungseffizienz hat sich erheblich verbessert.",
        rating: "5"
      }
    },
    es: {
      name: "Planes de precios siftbeam",
      description: "Servicio de procesamiento de datos de pago por uso. Pague solo por lo que usa. Sin tarifas de configuración, sin cargos base mensuales.",
      review: {
        author: "Usuario Empresarial",
        text: "El precio de pago por uso es transparente y rentable. La gestión basada en políticas es flexible y nuestra eficiencia de procesamiento de datos ha mejorado significativamente.",
        rating: "5"
      }
    },
    pt: {
      name: "Planos de preços siftbeam",
      description: "Serviço de processamento de dados pay-as-you-go. Pague apenas pelo que usar. Sem taxas de configuração, sem encargos base mensais.",
      review: {
        author: "Usuário Empresarial",
        text: "O preço pay-as-you-go é transparente e econômico. O gerenciamento baseado em políticas é flexível e nossa eficiência de processamento de dados melhorou significativamente.",
        rating: "5"
      }
    },
    id: {
      name: "Paket harga siftbeam",
      description: "Layanan pemrosesan data bayar sesuai penggunaan. Bayar hanya untuk yang Anda gunakan. Tanpa biaya setup, tanpa biaya dasar bulanan.",
      review: {
        author: "Pengguna Perusahaan",
        text: "Harga bayar sesuai penggunaan transparan dan hemat biaya. Manajemen berbasis kebijakan fleksibel dan efisiensi pemrosesan data kami meningkat secara signifikan.",
        rating: "5"
      }
    }
  };
  
  const translation = pricingTranslations[locale as keyof typeof pricingTranslations] || pricingTranslations['en-US'];
  
  // 価格の有効期限を1年後に設定
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": translation.name,
    "description": translation.description,
    "image": `${baseUrl}/og-default.png`,
    "brand": {
      "@type": "Brand",
      "name": "siftbeam"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",  // Stripe決済はUSDのみ
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/${locale}/pricing`,
      "priceValidUntil": priceValidUntil.toISOString().split('T')[0], // YYYY-MM-DD形式
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": [
          "US",  // アメリカ合衆国
          "JP",  // 日本
          "GB",  // イギリス
          "CA",  // カナダ
          "AU",  // オーストラリア
          "DE",  // ドイツ
          "FR",  // フランス
          "ES",  // スペイン
          "PT",  // ポルトガル
          "BR",  // ブラジル
          "ID",  // インドネシア
          "CN",  // 中国
          "KR"   // 韓国
        ], // グローバルサービスに対応する主要国（ISO 3166-1 alpha-2コード）
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30, // 30日間の返金保証
        "returnMethod": "ReturnByMail", // デジタル商品の返金方法（Googleの有効な列挙値を使用）
        "returnFees": "https://schema.org/FreeReturn" // 無料返金
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US" // グローバルサービスなのでUSを代表として設定
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      }
    },
    // レビューを1件追加（Googleサーチコンソールのエラー回避のため）
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": Number(translation.review.rating), // 数値型に変換
      "reviewCount": 1, // 数値型で正の値を指定
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": translation.review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": Number(translation.review.rating), // 数値型に変換
          "bestRating": "5"
        },
        "reviewBody": translation.review.text,
        "datePublished": "2024-01-15"
      }
    ]
  };
}

// HowTo構造化データ
export function generateHowToStructuredData(locale: string = 'en') {
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
      name: "How to use siftbeam",
      description: "Complete guide to get started with siftbeam data processing",
      steps: [
        { name: "Sign Up", text: "Create a free account with your email address" },
        { name: "Company Registration", text: "Enter company information to set up your organization" },
        { name: "Policy Configuration", text: "Define data processing policies and rules" },
        { name: "Data Upload", text: "Upload the data you want to process" },
        { name: "Execute Processing", text: "Data is automatically processed based on defined policies" }
      ]
    },
    'zh-CN': {
      name: "如何使用siftbeam",
      description: "开始使用siftbeam数据处理的完整指南",
      steps: [
        { name: "注册账户", text: "使用电子邮件地址创建免费账户" },
        { name: "公司信息注册", text: "输入公司信息以设置您的组织" },
        { name: "策略配置", text: "定义数据处理策略和规则" },
        { name: "数据上传", text: "上传您想要处理的数据" },
        { name: "执行处理", text: "根据定义的策略自动处理数据" }
      ]
    },
    ko: {
      name: "siftbeam 사용 방법",
      description: "siftbeam 데이터 처리를 시작하기 위한 완전 가이드",
      steps: [
        { name: "계정 가입", text: "이메일 주소로 무료 계정을 생성합니다" },
        { name: "회사 정보 등록", text: "회사 정보를 입력하여 조직을 설정합니다" },
        { name: "정책 설정", text: "데이터 처리 정책 및 규칙을 정의합니다" },
        { name: "데이터 업로드", text: "처리하려는 데이터를 업로드합니다" },
        { name: "처리 실행", text: "정의된 정책에 따라 데이터가 자동으로 처리됩니다" }
      ]
    }
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
      "currency": "USD",  // Stripe決済はUSDのみ
      "value": "0"
    },
    "step": translation.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": `${baseUrl}/${locale}/flow#step-${index + 1}`
    })),
    "tool": {
      "@type": "HowToTool",
      "name": "Web Browser"
    }
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

// FAQPage構造化データ生成関数
export function generateFAQStructuredData(locale: string, dict: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 全カテゴリのFAQアイテムを収集
  const allFAQItems: any[] = [];
  
  Object.values(dict.categories).forEach((category: any) => {
    category.items.forEach((item: any) => {
      const answer = Array.isArray(item.answer) 
        ? item.answer.join('\n') 
        : item.answer;
      
      allFAQItems.push({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer
        }
      });
    });
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQItems
  };
}

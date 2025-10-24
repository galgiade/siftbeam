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
    description: "企業データを活用し、AIの力で未来のビジネスを創造するプラットフォーム",
    features: ["データ分析", "リアルタイム異常検知", "カスタムAI予測"],
    keywords: "AI,データ分析,異常検知,機械学習,AWS,ビジネス予測,リアルタイム分析",
    dashboard: "ダッシュボード画面"
  },
  'en-US': {
    description: "Leveraging corporate data to create future businesses with AI power",
    features: ["Data Analysis", "Real-time Anomaly Detection", "Custom AI Predictions"],
    keywords: "AI,data analysis,anomaly detection,machine learning,AWS,business prediction,real-time analysis",
    dashboard: "Dashboard Screen"
  },
  'zh-CN': {
    description: "利用企业数据与 AI 力量创造未来业务",
    features: ["数据分析", "实时异常检测", "自定义 AI 预测"],
    keywords: "AI,数据分析,异常检测,机器学习,AWS,业务预测,实时分析",
    dashboard: "仪表板屏幕"
  },
  ko: {
    description: "기업 데이터를 활용하여 AI의 힘으로 미래 비즈니스를 창출합니다",
    features: ["데이터 분석", "실시간 이상 감지", "맞춤형 AI 예측"],
    keywords: "AI,데이터분석,이상감지,머신러닝,AWS,비즈니스예측,실시간분석",
    dashboard: "대시보드 화면"
  },
  fr: {
    description: "Exploiter les données d'entreprise pour créer des entreprises futures avec la puissance de l'IA",
    features: ["Analyse de données", "Détection d'anomalies en temps réel", "Prédictions IA personnalisées"],
    keywords: "IA,analyse de données,détection d'anomalies,apprentissage automatique,AWS,prédiction d'entreprise,analyse en temps réel",
    dashboard: "Écran du tableau de bord"
  },
  de: {
    description: "Unternehmensdaten nutzen, um zukünftige Geschäfte mit KI-Kraft zu schaffen",
    features: ["Datenanalyse", "Echtzeit-Anomalieerkennung", "Benutzerdefinierte KI-Vorhersagen"],
    keywords: "KI,Datenanalyse,Anomalieerkennung,maschinelles Lernen,AWS,Geschäftsvorhersage,Echtzeitanalyse",
    dashboard: "Dashboard-Bildschirm"
  },
  es: {
    description: "Aprovechar los datos corporativos para crear negocios futuros con el poder de la IA",
    features: ["Análisis de datos", "Detección de anomalías en tiempo real", "Predicciones de IA personalizadas"],
    keywords: "IA,análisis de datos,detección de anomalías,aprendizaje automático,AWS,predicción de negocios,análisis en tiempo real",
    dashboard: "Pantalla del panel de control"
  },
  pt: {
    description: "Aproveitar dados corporativos para criar negócios futuros com o poder da IA",
    features: ["Análise de dados", "Detecção de anomalias em tempo real", "Previsões de IA personalizadas"],
    keywords: "IA,análise de dados,detecção de anomalias,aprendizado de máquina,AWS,previsão de negócios,análise em tempo real",
    dashboard: "Tela do painel de controle"
  },
  id: {
    description: "Manfaatkan data perusahaan untuk menciptakan bisnis masa depan dengan kekuatan AI",
    features: ["Analisis Data", "Deteksi anomali real-time", "Prediksi AI kustom"],
    keywords: "AI,analisis data,deteksi anomali,pembelajaran mesin,AWS,prediksi bisnis,analisis real-time",
    dashboard: "Layar Dashboard"
  }
};

// フォールバック用の英語翻訳
const getTranslation = (locale: string, key: keyof typeof translations.ja) => {
  const lang = locale === 'en' ? 'en-US' : locale;
  return translations[lang as keyof typeof translations]?.[key] || translations['en-US'][key];
};

// siftbeam用の構造化データ生成関数（全言語対応）
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
      "priceCurrency": locale === 'ja' ? 'JPY' : 'USD',
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
    "releaseNotes": "Initial release with AI-powered data analysis capabilities"
  };
}

// 組織情報の構造化データ（全言語対応）
export function generateOrganizationStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const orgTranslations = {
    ja: "AIを活用した企業データ分析プラットフォーム",
    'en-US': "AI-powered corporate data analysis platform",
    'zh-CN': "AI驱动的企业数据分析平台",
    ko: "AI 기반 기업 데이터 분석 플랫폼",
    fr: "Plateforme d'analyse de données d'entreprise alimentée par l'IA",
    de: "KI-gestützte Unternehmensdatenanalyse-Plattform",
    es: "Plataforma de análisis de datos corporativos impulsada por IA",
    pt: "Plataforma de análise de dados corporativos alimentada por IA",
    id: "Platform analisis data perusahaan bertenaga AI"
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

// サービス情報の構造化データ（全言語対応）
export function generateServiceStructuredData(locale: string = 'ja') {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  const serviceTranslations = {
    ja: {
      name: "AIデータ分析サービス",
      description: "企業データをAIで分析し、リアルタイム異常検知と予測分析を提供",
      catalogName: "AI分析プラン",
      services: ["データ分析", "異常検知", "AI予測"]
    },
    'en-US': {
      name: "AI Data Analysis Service",
      description: "AI-powered analysis of corporate data with real-time anomaly detection and predictive analytics",
      catalogName: "AI Analysis Plans",
      services: ["Data Analysis", "Anomaly Detection", "AI Predictions"]
    },
    'zh-CN': {
      name: "AI数据分析服务",
      description: "使用AI分析企业数据，提供实时异常检测和预测分析",
      catalogName: "AI分析计划",
      services: ["数据分析", "异常检测", "AI预测"]
    },
    ko: {
      name: "AI 데이터 분석 서비스",
      description: "기업 데이터를 AI로 분석하여 실시간 이상 감지 및 예측 분석 제공",
      catalogName: "AI 분석 계획",
      services: ["데이터 분석", "이상 감지", "AI 예측"]
    },
    fr: {
      name: "Service d'analyse de données IA",
      description: "Analyse de données d'entreprise alimentée par l'IA avec détection d'anomalies en temps réel et analytique prédictive",
      catalogName: "Plans d'analyse IA",
      services: ["Analyse de données", "Détection d'anomalies", "Prédictions IA"]
    },
    de: {
      name: "KI-Datenanalyse-Service",
      description: "KI-gestützte Analyse von Unternehmensdaten mit Echtzeit-Anomalieerkennung und prädiktiver Analytik",
      catalogName: "KI-Analysepläne",
      services: ["Datenanalyse", "Anomalieerkennung", "KI-Vorhersagen"]
    },
    es: {
      name: "Servicio de análisis de datos IA",
      description: "Análisis de datos corporativos impulsado por IA con detección de anomalías en tiempo real y analítica predictiva",
      catalogName: "Planes de análisis IA",
      services: ["Análisis de datos", "Detección de anomalías", "Predicciones IA"]
    },
    pt: {
      name: "Serviço de análise de dados IA",
      description: "Análise de dados corporativos alimentada por IA com detecção de anomalias em tempo real e analítica preditiva",
      catalogName: "Planos de análise IA",
      services: ["Análise de dados", "Detecção de anomalias", "Previsões IA"]
    },
    id: {
      name: "Layanan Analisis Data AI",
      description: "Analisis data perusahaan bertenaga AI dengan deteksi anomali real-time dan analitik prediktif",
      catalogName: "Paket Analisis AI",
      services: ["Analisis Data", "Deteksi Anomali", "Prediksi AI"]
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

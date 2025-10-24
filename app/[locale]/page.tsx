// app/[locale]/page.tsx
import type { Metadata } from 'next'
import HomeContainer from '@/app/_containers/Home/HomeContainer';
import { homeDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateSiftbeamStructuredData, generateOrganizationStructuredData, generateServiceStructuredData } from '@/app/_components/common/StructuredData'

// 全言語対応のキーワード設定
const getKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['AI', 'データ分析', '異常検知', '機械学習', 'AWS', 'ビジネス予測', 'リアルタイム分析', '企業データ活用'],
    'en-US': ['AI', 'data analysis', 'anomaly detection', 'machine learning', 'AWS', 'business prediction', 'real-time analysis'],
    'zh-CN': ['AI', '数据分析', '异常检测', '机器学习', 'AWS', '业务预测', '实时分析'],
    ko: ['AI', '데이터분석', '이상감지', '머신러닝', 'AWS', '비즈니스예측', '실시간분석'],
    fr: ['IA', 'analyse de données', 'détection d\'anomalies', 'apprentissage automatique', 'AWS', 'prédiction d\'entreprise', 'analyse en temps réel'],
    de: ['KI', 'Datenanalyse', 'Anomalieerkennung', 'maschinelles Lernen', 'AWS', 'Geschäftsvorhersage', 'Echtzeitanalyse'],
    es: ['IA', 'análisis de datos', 'detección de anomalías', 'aprendizaje automático', 'AWS', 'predicción de negocios', 'análisis en tiempo real'],
    pt: ['IA', 'análise de dados', 'detecção de anomalias', 'aprendizado de máquina', 'AWS', 'previsão de negócios', 'análise em tempo real'],
    id: ['AI', 'analisis data', 'deteksi anomali', 'pembelajaran mesin', 'AWS', 'prediksi bisnis', 'analisis real-time']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en-US'];
};

// 全言語対応のロケール設定
const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    'en-US': 'en_US',
    'zh-CN': 'zh_CN',
    ko: 'ko_KR',
    fr: 'fr_FR',
    de: 'de_DE',
    es: 'es_ES',
    pt: 'pt_BR',
    id: 'id_ID'
  };
  
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(homeDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  return {
    title: dict.hero.title || 'siftbeam',
    description: dict.hero.subtitle || 'AI-powered business insights platform',
    keywords: getKeywordsByLocale(resolvedParams.locale),
    openGraph: {
      title: dict.hero.title || 'siftbeam',
      description: dict.hero.subtitle || 'AI-powered business insights platform',
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      url: `${baseUrl}/${resolvedParams.locale}`,
      siteName: 'siftbeam',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: dict.hero.title || 'siftbeam',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.hero.title || 'siftbeam',
      description: dict.hero.subtitle || 'AI-powered business insights platform',
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `/${resolvedParams.locale}`,
      languages: {
        'ja': '/ja',
        'en': '/en',
        'en-US': '/en-US',
        'zh-CN': '/zh-CN',
        'ko': '/ko',
        'fr': '/fr',
        'de': '/de',
        'es': '/es',
        'pt': '/pt',
        'id': '/id',
      },
    },
  }
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale;
  
  // 構造化データの生成
  const structuredData = generateSiftbeamStructuredData(locale);
  const organizationData = generateOrganizationStructuredData(locale);
  const serviceData = generateServiceStructuredData(locale);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={structuredData} />
      <StructuredData data={organizationData} />
      <StructuredData data={serviceData} />
      
      <HomeContainer params={params} />
    </>
  );
}

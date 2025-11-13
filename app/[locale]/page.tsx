// app/[locale]/page.tsx
import type { Metadata } from 'next'
import HomeContainer from '@/app/_containers/Home/HomeContainer';
import { homeDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateSiftbeamStructuredData, generateOrganizationStructuredData, generateServiceStructuredData } from '@/app/_components/common/StructuredData'

// 全言語対応のキーワード設定
const getKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['データ処理', 'ファイル管理', 'ポリシー管理', 'クラウドストレージ', 'データアップロード', '使用量監視', '従量課金', 'セキュアデータ管理', 'AWS', 'エンタープライズデータ', '二要素認証', 'データ分析レポート'],
    en: ['data processing', 'file management', 'policy management', 'cloud storage', 'data upload', 'usage monitoring', 'pay-as-you-go', 'secure data management', 'AWS', 'enterprise data', 'two-factor authentication', 'data analysis reports'],
    'zh-CN': ['数据处理', '文件管理', '策略管理', '云存储', '数据上传', '使用量监控', '按量付费', '安全数据管理', 'AWS', '企业数据', '双因素认证', '数据分析报告'],
    ko: ['데이터처리', '파일관리', '정책관리', '클라우드스토리지', '데이터업로드', '사용량모니터링', '종량제', '보안데이터관리', 'AWS', '기업데이터', '이중인증', '데이터분석리포트'],
    fr: ['traitement de données', 'gestion de fichiers', 'gestion de politiques', 'stockage cloud', 'téléchargement de données', 'surveillance d\'utilisation', 'paiement à l\'usage', 'gestion sécurisée des données', 'AWS', 'données d\'entreprise', 'authentification à deux facteurs', 'rapports d\'analyse de données'],
    de: ['Datenverarbeitung', 'Dateiverwaltung', 'Richtlinienverwaltung', 'Cloud-Speicher', 'Daten-Upload', 'Nutzungsüberwachung', 'nutzungsbasierte Abrechnung', 'sichere Datenverwaltung', 'AWS', 'Unternehmensdaten', 'Zwei-Faktor-Authentifizierung', 'Datenanalyseberichte'],
    es: ['procesamiento de datos', 'gestión de archivos', 'gestión de políticas', 'almacenamiento en la nube', 'carga de datos', 'monitoreo de uso', 'pago por uso', 'gestión segura de datos', 'AWS', 'datos empresariales', 'autenticación de dos factores', 'informes de análisis de datos'],
    pt: ['processamento de dados', 'gerenciamento de arquivos', 'gerenciamento de políticas', 'armazenamento em nuvem', 'upload de dados', 'monitoramento de uso', 'pagamento por uso', 'gerenciamento seguro de dados', 'AWS', 'dados empresariais', 'autenticação de dois fatores', 'relatórios de análise de dados'],
    id: ['pemrosesan data', 'manajemen file', 'manajemen kebijakan', 'penyimpanan cloud', 'upload data', 'pemantauan penggunaan', 'bayar sesuai penggunaan', 'manajemen data aman', 'AWS', 'data perusahaan', 'autentikasi dua faktor', 'laporan analisis data']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en'];
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
  
  // 動的OG画像のURL生成
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(dict.hero.title)}&description=${encodeURIComponent(dict.hero.subtitle)}&locale=${resolvedParams.locale}`;
  const fallbackImageUrl = `${baseUrl}/og-default.png`;
  
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
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.hero.title || 'siftbeam',
        },
        {
          url: fallbackImageUrl,
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
      images: [ogImageUrl, fallbackImageUrl],
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
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

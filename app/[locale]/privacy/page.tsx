import type { Metadata } from 'next'
import PrivacyContainer from '@/app/_containers/Privacy/PrivacyContainer'
import { privacyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'

// 静的生成のためのgenerateStaticParams（2文字コードに統一）
export async function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'ko' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'id' },
  ];
}

// 全言語対応のキーワード設定
const getPrivacyKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['プライバシーポリシー', '個人情報保護', 'プライバシー', '個人情報', 'データ保護', '情報保護方針', '個人データ', 'プライバシー保護', 'セキュリティ', 'データ管理'],
    en: ['privacy policy', 'privacy', 'data protection', 'personal data', 'data privacy', 'information protection', 'personal information', 'privacy protection', 'security', 'data management'],
    zh: ['隐私政策', '隐私保护', '数据保护', '个人信息', '隐私', '信息保护', '个人数据', '隐私安全', '安全', '数据管理'],
    ko: ['개인정보처리방침', '개인정보보호', '프라이버시', '개인정보', '데이터 보호', '정보보호', '개인데이터', '프라이버시 보호', '보안', '데이터 관리'],
    fr: ['politique de confidentialité', 'confidentialité', 'protection des données', 'données personnelles', 'vie privée', 'protection des informations', 'informations personnelles', 'protection de la vie privée', 'sécurité', 'gestion des données'],
    de: ['Datenschutzerklärung', 'Datenschutz', 'Datensicherheit', 'persönliche Daten', 'Privatsphäre', 'Informationsschutz', 'personenbezogene Daten', 'Datenschutz', 'Sicherheit', 'Datenverwaltung'],
    es: ['política de privacidad', 'privacidad', 'protección de datos', 'datos personales', 'privacidad de datos', 'protección de información', 'información personal', 'protección de privacidad', 'seguridad', 'gestión de datos'],
    pt: ['política de privacidade', 'privacidade', 'proteção de dados', 'dados pessoais', 'privacidade de dados', 'proteção de informações', 'informações pessoais', 'proteção de privacidade', 'segurança', 'gerenciamento de dados'],
    id: ['kebijakan privasi', 'privasi', 'perlindungan data', 'data pribadi', 'privasi data', 'perlindungan informasi', 'informasi pribadi', 'perlindungan privasi', 'keamanan', 'manajemen data']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en'];
};

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    en: 'en_US',
    zh: 'zh_CN',
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
  const dict = pickDictionary(privacyDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Privacy Policy | siftbeam',
    description: dict.intro || 'Privacy Policy for siftbeam - Learn how we collect, use, and protect your personal data.',
    keywords: getPrivacyKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/privacy`,
      languages: {
        'x-default': `${baseUrl}/en/privacy`,
        'ja': `${baseUrl}/ja/privacy`,
        'en': `${baseUrl}/en/privacy`,
        'zh': `${baseUrl}/zh/privacy`,
        'ko': `${baseUrl}/ko/privacy`,
        'fr': `${baseUrl}/fr/privacy`,
        'de': `${baseUrl}/de/privacy`,
        'es': `${baseUrl}/es/privacy`,
        'pt': `${baseUrl}/pt/privacy`,
        'id': `${baseUrl}/id/privacy`,
      },
    },
    openGraph: {
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/privacy`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: dict.title || 'Privacy Policy',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function PrivacyPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // パンくずリストの翻訳（2文字コードに統一）
  const breadcrumbTranslations = {
    ja: { home: 'ホーム', privacy: 'プライバシーポリシー' },
    en: { home: 'Home', privacy: 'Privacy Policy' },
    zh: { home: '主页', privacy: '隐私政策' },
    ko: { home: '홈', privacy: '개인정보처리방침' },
    fr: { home: 'Accueil', privacy: 'Politique de confidentialité' },
    de: { home: 'Startseite', privacy: 'Datenschutzerklärung' },
    es: { home: 'Inicio', privacy: 'Política de privacidad' },
    pt: { home: 'Início', privacy: 'Política de privacidade' },
    id: { home: 'Beranda', privacy: 'Kebijakan Privasi' }
  };
  
  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];
  
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.privacy, url: `/${locale}/privacy` }
  ]);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={breadcrumbData} />
      
      <PrivacyContainer params={params} />
    </>
  )
}



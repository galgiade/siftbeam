import type { Metadata } from 'next'
import TermsContainer from '@/app/_containers/Terms/TermsContainer'
import { termsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
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
const getTermsKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['利用規約', '規約', '契約条件', '利用条件', '法的事項', 'サービス規約', '使用条件', '約款', 'ユーザー規約', '同意事項'],
    en: ['terms', 'terms of service', 'legal', 'terms and conditions', 'service agreement', 'usage terms', 'user agreement', 'terms of use', 'legal terms', 'service terms'],
    zh: ['服务条款', '条款', '法律条款', '使用条款', '服务协议', '用户协议', '法律事项', '条件', '服务条件', '用户条款'],
    ko: ['이용약관', '약관', '계약조건', '서비스 약관', '사용조건', '법적사항', '이용조건', '사용자 약관', '서비스 조건', '동의사항'],
    fr: ['conditions d\'utilisation', 'termes', 'conditions', 'accord de service', 'conditions légales', 'termes d\'utilisation', 'accord utilisateur', 'conditions de service', 'mentions légales', 'termes légaux'],
    de: ['Nutzungsbedingungen', 'Bedingungen', 'AGB', 'Servicebedingungen', 'rechtliche Bedingungen', 'Nutzungsvereinbarung', 'Benutzervereinbarung', 'Dienstbedingungen', 'rechtliche Hinweise', 'Servicevereinbarung'],
    es: ['términos de servicio', 'términos', 'condiciones', 'acuerdo de servicio', 'términos legales', 'condiciones de uso', 'acuerdo de usuario', 'términos de uso', 'condiciones legales', 'términos del servicio'],
    pt: ['termos de serviço', 'termos', 'condições', 'acordo de serviço', 'termos legais', 'condições de uso', 'acordo de usuário', 'termos de uso', 'condições legais', 'termos do serviço'],
    id: ['syarat layanan', 'syarat', 'ketentuan', 'perjanjian layanan', 'syarat hukum', 'ketentuan penggunaan', 'perjanjian pengguna', 'syarat penggunaan', 'ketentuan hukum', 'syarat layanan']
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
  const dict = pickDictionary(termsDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Terms of Service | siftbeam',
    description: dict.intro || 'Terms of Service for siftbeam data processing platform. Read our service agreement and usage conditions.',
    keywords: getTermsKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/terms`,
      languages: {
        'ja': `${baseUrl}/ja/terms`,
        'en': `${baseUrl}/en/terms`,
        'zh': `${baseUrl}/zh/terms`,
        'ko': `${baseUrl}/ko/terms`,
        'fr': `${baseUrl}/fr/terms`,
        'de': `${baseUrl}/de/terms`,
        'es': `${baseUrl}/es/terms`,
        'pt': `${baseUrl}/pt/terms`,
        'id': `${baseUrl}/id/terms`,
      },
    },
    openGraph: {
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/terms`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: dict.title || 'Terms of Service',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
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

export default async function TermsPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // パンくずリストの翻訳
  const breadcrumbTranslations = {
    ja: { home: 'ホーム', terms: '利用規約' },
    en: { home: 'Home', terms: 'Terms of Service' },
    zh: { home: '主页', terms: '服务条款' },
    ko: { home: '홈', terms: '이용약관' },
    fr: { home: 'Accueil', terms: 'Conditions d\'utilisation' },
    de: { home: 'Startseite', terms: 'Nutzungsbedingungen' },
    es: { home: 'Inicio', terms: 'Términos de servicio' },
    pt: { home: 'Início', terms: 'Termos de serviço' },
    id: { home: 'Beranda', terms: 'Syarat Layanan' }
  };
  
  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];
  
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.terms, url: `/${locale}/terms` }
  ]);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={breadcrumbData} />
      
      <TermsContainer params={params} />
    </>
  )
}



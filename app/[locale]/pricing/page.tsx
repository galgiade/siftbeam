// app/[locale]/pricing/page.tsx
import type { Metadata } from 'next'
import PricingContainer from '@/app/_containers/Pricing/PricingContainer'
import { pricingDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generatePricingStructuredData, generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'

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
const getPricingKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['料金', '価格', 'プラン', '従量課金', 'コスト', '料金プラン', 'データ処理 料金', '企業向け料金', '見積もり', '価格表'],
    en: ['pricing', 'price', 'plans', 'pay-as-you-go', 'cost', 'pricing plans', 'data processing pricing', 'enterprise pricing', 'quote', 'price list'],
    zh: ['价格', '定价', '计划', '按量付费', '成本', '价格计划', '数据处理价格', '企业定价', '报价', '价格表'],
    ko: ['가격', '요금', '플랜', '종량제', '비용', '가격 플랜', '데이터 처리 가격', '기업 가격', '견적', '가격표'],
    fr: ['prix', 'tarification', 'plans', 'paiement à l\'usage', 'coût', 'plans tarifaires', 'prix du traitement de données', 'tarification entreprise', 'devis', 'liste de prix'],
    de: ['Preise', 'Preisgestaltung', 'Pläne', 'nutzungsbasierte Abrechnung', 'Kosten', 'Preispläne', 'Datenverarbeitungspreise', 'Unternehmenspreise', 'Angebot', 'Preisliste'],
    es: ['precios', 'precio', 'planes', 'pago por uso', 'costo', 'planes de precios', 'precios de procesamiento de datos', 'precios empresariales', 'cotización', 'lista de precios'],
    pt: ['preços', 'preço', 'planos', 'pagamento por uso', 'custo', 'planos de preços', 'preços de processamento de dados', 'preços empresariais', 'orçamento', 'lista de preços'],
    id: ['harga', 'tarif', 'paket', 'bayar sesuai penggunaan', 'biaya', 'paket harga', 'harga pemrosesan data', 'harga perusahaan', 'penawaran', 'daftar harga']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en'];
};

// 全言語対応のロケール設定（2文字コードに統一）
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
  const dict = pickDictionary(pricingDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  // 静的OG画像を使用（Discordのタイムアウト対策）
  const ogImageUrl = `${baseUrl}/og-default.png`;
  
  return {
    title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
    description: dict.pricing.hero.subtitle || 'siftbeam pricing information - Pay-as-you-go data processing service with transparent pricing',
    keywords: getPricingKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/pricing`,
      languages: {
        'ja': `${baseUrl}/ja/pricing`,
        'en': `${baseUrl}/en/pricing`,
        'zh': `${baseUrl}/zh/pricing`,
        'ko': `${baseUrl}/ko/pricing`,
        'fr': `${baseUrl}/fr/pricing`,
        'de': `${baseUrl}/de/pricing`,
        'es': `${baseUrl}/es/pricing`,
        'pt': `${baseUrl}/pt/pricing`,
        'id': `${baseUrl}/id/pricing`,
      },
    },
    openGraph: {
      title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
      description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
      url: `${baseUrl}/${resolvedParams.locale}/pricing`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.pricing.hero.titleSub || 'Pricing',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
      description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
      images: [ogImageUrl],
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

export default async function PricingPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データの生成
  const pricingData = generatePricingStructuredData(locale);
  
  // パンくずリストの翻訳（2文字コードに統一）
  const breadcrumbTranslations = {
    ja: { home: 'ホーム', pricing: '料金' },
    en: { home: 'Home', pricing: 'Pricing' },
    zh: { home: '主页', pricing: '价格' },
    ko: { home: '홈', pricing: '가격' },
    fr: { home: 'Accueil', pricing: 'Prix' },
    de: { home: 'Startseite', pricing: 'Preise' },
    es: { home: 'Inicio', pricing: 'Precios' },
    pt: { home: 'Início', pricing: 'Preços' },
    id: { home: 'Beranda', pricing: 'Harga' }
  };
  
  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];
  
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.pricing, url: `/${locale}/pricing` }
  ]);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={pricingData} />
      <StructuredData data={breadcrumbData} />
      
      <PricingContainer params={params} />
    </>
  )
}



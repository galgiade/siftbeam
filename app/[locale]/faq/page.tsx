import type { Metadata } from 'next'
import FAQContainer from '@/app/_containers/FAQ/FAQContainer'
import { faqDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateFAQStructuredData, generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'

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
const getFAQKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['FAQ', 'よくある質問', '質問', '回答', 'ヘルプ', 'サポート', '使い方', '料金', 'セキュリティ', 'データ処理'],
    en: ['FAQ', 'frequently asked questions', 'questions', 'answers', 'help', 'support', 'how to', 'pricing', 'security', 'data processing'],
    zh: ['常见问题', '问题', '答案', '帮助', '支持', '使用方法', '价格', '安全', '数据处理'],
    ko: ['자주 묻는 질문', '질문', '답변', '도움말', '지원', '사용법', '가격', '보안', '데이터 처리'],
    fr: ['FAQ', 'questions fréquentes', 'questions', 'réponses', 'aide', 'support', 'comment utiliser', 'prix', 'sécurité', 'traitement de données'],
    de: ['FAQ', 'häufig gestellte Fragen', 'Fragen', 'Antworten', 'Hilfe', 'Support', 'Anleitung', 'Preise', 'Sicherheit', 'Datenverarbeitung'],
    es: ['FAQ', 'preguntas frecuentes', 'preguntas', 'respuestas', 'ayuda', 'soporte', 'cómo usar', 'precios', 'seguridad', 'procesamiento de datos'],
    pt: ['FAQ', 'perguntas frequentes', 'perguntas', 'respostas', 'ajuda', 'suporte', 'como usar', 'preços', 'segurança', 'processamento de dados'],
    id: ['FAQ', 'pertanyaan umum', 'pertanyaan', 'jawaban', 'bantuan', 'dukungan', 'cara menggunakan', 'harga', 'keamanan', 'pemrosesan data']
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
  const dict = pickDictionary(faqDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  // 静的OG画像を使用（Discordのタイムアウト対策）
  const ogImageUrl = `${baseUrl}/og-default.png`;
  
  return {
    title: `${dict.title} | siftbeam`,
    description: dict.description,
    keywords: getFAQKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/faq`,
      languages: {
        'x-default': `${baseUrl}/en/faq`,
        'ja': `${baseUrl}/ja/faq`,
        'en': `${baseUrl}/en/faq`,
        'zh': `${baseUrl}/zh/faq`,
        'ko': `${baseUrl}/ko/faq`,
        'fr': `${baseUrl}/fr/faq`,
        'de': `${baseUrl}/de/faq`,
        'es': `${baseUrl}/es/faq`,
        'pt': `${baseUrl}/pt/faq`,
        'id': `${baseUrl}/id/faq`,
      },
    },
    openGraph: {
      title: `${dict.title} | siftbeam`,
      description: dict.description,
      url: `${baseUrl}/${resolvedParams.locale}/faq`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.title} | siftbeam`,
      description: dict.description,
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

export default async function FAQPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  const dict = pickDictionary(faqDictionaries, locale, 'en')
  
  // 構造化データの生成
  const faqData = generateFAQStructuredData(locale, dict);
  
  // パンくずリストの翻訳（2文字コードに統一）
  const breadcrumbTranslations = {
    ja: { home: 'ホーム', faq: 'よくある質問' },
    en: { home: 'Home', faq: 'FAQ' },
    zh: { home: '主页', faq: '常见问题' },
    ko: { home: '홈', faq: '자주 묻는 질문' },
    fr: { home: 'Accueil', faq: 'FAQ' },
    de: { home: 'Startseite', faq: 'FAQ' },
    es: { home: 'Inicio', faq: 'FAQ' },
    pt: { home: 'Início', faq: 'FAQ' },
    id: { home: 'Beranda', faq: 'FAQ' }
  };
  
  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];
  
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.faq, url: `/${locale}/faq` }
  ]);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={faqData} id="faq-page" />
      <StructuredData data={breadcrumbData} id="faq-breadcrumb" />
      
      <FAQContainer params={params} />
    </>
  )
}


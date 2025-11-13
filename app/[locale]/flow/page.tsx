// app/[locale]/flow/page.tsx
import type { Metadata } from 'next'
import FlowContainer from '@/app/_containers/Flow/FlowContainer'
import { flowDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import StructuredData, { generateHowToStructuredData, generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'

// 全言語対応のキーワード設定
const getFlowKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['使い方', 'セットアップ', '始め方', 'チュートリアル', 'ガイド', '導入手順', 'データ処理 始め方', '操作方法', 'マニュアル', '初期設定'],
    'en-US': ['how to', 'setup', 'getting started', 'tutorial', 'guide', 'onboarding', 'data processing tutorial', 'instructions', 'manual', 'initial setup'],
    'zh-CN': ['如何使用', '设置', '入门', '教程', '指南', '入门步骤', '数据处理教程', '操作说明', '手册', '初始设置'],
    ko: ['사용 방법', '설정', '시작하기', '튜토리얼', '가이드', '도입 절차', '데이터 처리 튜토리얼', '사용 설명', '매뉴얼', '초기 설정'],
    fr: ['comment utiliser', 'configuration', 'démarrage', 'tutoriel', 'guide', 'procédure d\'intégration', 'tutoriel de traitement de données', 'instructions', 'manuel', 'configuration initiale'],
    de: ['Anleitung', 'Einrichtung', 'Erste Schritte', 'Tutorial', 'Leitfaden', 'Einführungsschritte', 'Datenverarbeitungs-Tutorial', 'Bedienungsanleitung', 'Handbuch', 'Ersteinrichtung'],
    es: ['cómo usar', 'configuración', 'comenzar', 'tutorial', 'guía', 'pasos de integración', 'tutorial de procesamiento de datos', 'instrucciones', 'manual', 'configuración inicial'],
    pt: ['como usar', 'configuração', 'começar', 'tutorial', 'guia', 'passos de integração', 'tutorial de processamento de dados', 'instruções', 'manual', 'configuração inicial'],
    id: ['cara menggunakan', 'pengaturan', 'memulai', 'tutorial', 'panduan', 'langkah integrasi', 'tutorial pemrosesan data', 'instruksi', 'manual', 'pengaturan awal']
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
  const dict = pickDictionary(flowDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  // 静的OG画像を使用（Discordのタイムアウト対策）
  const ogImageUrl = `${baseUrl}/og-default.png`;
  
  return {
    title: dict.flow.hero.title || 'Flow | siftbeam',
    description: dict.flow.hero.subtitle || 'Step-by-step guide to getting started with siftbeam data processing platform',
    keywords: getFlowKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/flow`,
      languages: {
        'ja': `${baseUrl}/ja/flow`,
        'en': `${baseUrl}/en/flow`,
        'en-US': `${baseUrl}/en-US/flow`,
        'zh-CN': `${baseUrl}/zh-CN/flow`,
        'ko': `${baseUrl}/ko/flow`,
        'fr': `${baseUrl}/fr/flow`,
        'de': `${baseUrl}/de/flow`,
        'es': `${baseUrl}/es/flow`,
        'pt': `${baseUrl}/pt/flow`,
        'id': `${baseUrl}/id/flow`,
      },
    },
    openGraph: {
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/flow`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.flow.hero.title || 'Flow',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.flow.hero.title || 'Flow | siftbeam',
      description: dict.flow.hero.subtitle || 'Steps to get started with siftbeam',
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

export default async function FlowPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  const locale = params.locale
  
  // 構造化データの生成
  const howToData = generateHowToStructuredData(locale);
  
  // パンくずリストの翻訳
  const breadcrumbTranslations = {
    ja: { home: 'ホーム', flow: '使い方' },
    'en-US': { home: 'Home', flow: 'How to Use' },
    'zh-CN': { home: '主页', flow: '使用方法' },
    ko: { home: '홈', flow: '사용 방법' },
    fr: { home: 'Accueil', flow: 'Comment utiliser' },
    de: { home: 'Startseite', flow: 'Anleitung' },
    es: { home: 'Inicio', flow: 'Cómo usar' },
    pt: { home: 'Início', flow: 'Como usar' },
    id: { home: 'Beranda', flow: 'Cara Menggunakan' }
  };
  
  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en-US'];
  
  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.flow, url: `/${locale}/flow` }
  ]);
  
  return (
    <>
      {/* 構造化データ */}
      <StructuredData data={howToData} />
      <StructuredData data={breadcrumbData} />
      
      <FlowContainer params={params} />
    </>
  )
}



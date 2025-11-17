import type { Metadata } from 'next';
import BlogListContainer from '@/app/_containers/Blog/BlogListContainer';
import { blogDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

// 静的生成のためのgenerateStaticParams（全言語対応）
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

const getBlogKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: [
      'ブログ', 'データ処理', '自動化', 'クラウド', 'セキュリティ', 'チュートリアル', '技術解説', 'ベストプラクティス',
      'データ処理 自動化 方法', 'クラウド データ管理', 'エンタープライズ データ処理', 
      'ファイル処理 自動化', 'データ処理 セキュリティ', 'データ処理 効率化',
      'データ処理 ツール 比較', 'データ処理 コスト削減', 'データ処理 始め方'
    ],
    en: [
      'blog', 'data processing', 'automation', 'cloud', 'security', 'tutorial', 'technical guide', 'best practices',
      'data processing automation guide', 'cloud data management', 'enterprise data processing',
      'file processing automation', 'data processing security', 'data processing efficiency',
      'data processing tools comparison', 'data processing cost reduction', 'getting started data processing'
    ],
    zh: [
      '博客', '数据处理', '自动化', '云计算', '安全', '教程', '技术指南', '最佳实践',
      '数据处理自动化指南', '云数据管理', '企业数据处理',
      '文件处理自动化', '数据处理安全', '数据处理效率',
      '数据处理工具比较', '数据处理成本降低', '数据处理入门'
    ],
    ko: [
      '블로그', '데이터 처리', '자동화', '클라우드', '보안', '튜토리얼', '기술 가이드', '모범 사례',
      '데이터 처리 자동화 가이드', '클라우드 데이터 관리', '엔터프라이즈 데이터 처리',
      '파일 처리 자동화', '데이터 처리 보안', '데이터 처리 효율성',
      '데이터 처리 도구 비교', '데이터 처리 비용 절감', '데이터 처리 시작하기'
    ],
    fr: [
      'blog', 'traitement des données', 'automatisation', 'cloud', 'sécurité', 'tutoriel', 'guide technique', 'meilleures pratiques',
      'guide automatisation traitement données', 'gestion données cloud', 'traitement données entreprise',
      'automatisation traitement fichiers', 'sécurité traitement données', 'efficacité traitement données',
      'comparaison outils traitement données', 'réduction coûts traitement données', 'débuter traitement données'
    ],
    de: [
      'blog', 'datenverarbeitung', 'automatisierung', 'cloud', 'sicherheit', 'tutorial', 'technischer leitfaden', 'best practices',
      'datenverarbeitung automatisierung leitfaden', 'cloud-datenverwaltung', 'unternehmens-datenverarbeitung',
      'dateiverarbeitung automatisierung', 'datenverarbeitung sicherheit', 'datenverarbeitung effizienz',
      'datenverarbeitung tools vergleich', 'datenverarbeitung kostenreduzierung', 'datenverarbeitung einstieg'
    ],
    es: [
      'blog', 'procesamiento de datos', 'automatización', 'nube', 'seguridad', 'tutorial', 'guía técnica', 'mejores prácticas',
      'guía automatización procesamiento datos', 'gestión datos nube', 'procesamiento datos empresarial',
      'automatización procesamiento archivos', 'seguridad procesamiento datos', 'eficiencia procesamiento datos',
      'comparación herramientas procesamiento datos', 'reducción costos procesamiento datos', 'comenzar procesamiento datos'
    ],
    pt: [
      'blog', 'processamento de dados', 'automação', 'nuvem', 'segurança', 'tutorial', 'guia técnico', 'melhores práticas',
      'guia automação processamento dados', 'gerenciamento dados nuvem', 'processamento dados empresarial',
      'automação processamento arquivos', 'segurança processamento dados', 'eficiência processamento dados',
      'comparação ferramentas processamento dados', 'redução custos processamento dados', 'começar processamento dados'
    ],
    id: [
      'blog', 'pemrosesan data', 'otomatisasi', 'cloud', 'keamanan', 'tutorial', 'panduan teknis', 'praktik terbaik',
      'panduan otomatisasi pemrosesan data', 'manajemen data cloud', 'pemrosesan data perusahaan',
      'otomatisasi pemrosesan file', 'keamanan pemrosesan data', 'efisiensi pemrosesan data',
      'perbandingan alat pemrosesan data', 'pengurangan biaya pemrosesan data', 'memulai pemrosesan data'
    ],
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
    id: 'id_ID',
  };
  return localeMap[locale as keyof typeof localeMap] || 'en_US';
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = pickDictionary(blogDictionaries, resolvedParams.locale, 'en');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 静的OG画像を使用（Discordのタイムアウト対策）
  const ogImageUrl = `${baseUrl}/og-default.png`;

  return {
    title: `${dict.title} | siftbeam`,
    description: dict.description,
    keywords: getBlogKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/blog`,
      languages: {
        'ja': `${baseUrl}/ja/blog`,
        'en': `${baseUrl}/en/blog`,
        'zh': `${baseUrl}/zh/blog`,
        'ko': `${baseUrl}/ko/blog`,
        'fr': `${baseUrl}/fr/blog`,
        'de': `${baseUrl}/de/blog`,
        'es': `${baseUrl}/es/blog`,
        'pt': `${baseUrl}/pt/blog`,
        'id': `${baseUrl}/id/blog`,
      },
    },
    openGraph: {
      title: `${dict.title} | siftbeam`,
      description: dict.description,
      url: `${baseUrl}/${resolvedParams.locale}/blog`,
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
  };
}

export default async function BlogPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params;
  const locale = params.locale;

  const breadcrumbTranslations = {
    ja: { home: 'ホーム', blog: 'ブログ' },
    en: { home: 'Home', blog: 'Blog' },
    zh: { home: '首页', blog: '博客' },
    ko: { home: '홈', blog: '블로그' },
    fr: { home: 'Accueil', blog: 'Blog' },
    de: { home: 'Startseite', blog: 'Blog' },
    es: { home: 'Inicio', blog: 'Blog' },
    pt: { home: 'Início', blog: 'Blog' },
    id: { home: 'Beranda', blog: 'Blog' },
  };

  const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];

  const breadcrumbData = generateBreadcrumbStructuredData(locale, [
    { name: breadcrumbLabels.home, url: `/${locale}` },
    { name: breadcrumbLabels.blog, url: `/${locale}/blog` }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} id="blog-breadcrumb" />
      <BlogListContainer params={params} />
    </>
  );
}


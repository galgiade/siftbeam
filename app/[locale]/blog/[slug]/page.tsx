import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailContainer from '@/app/_containers/Blog/BlogDetailContainer';
import { getPostBySlug, getAllPosts } from '@/app/lib/blog';
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData';

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

export async function generateStaticParams() {
  const locales = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getAllPosts(locale);
    posts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  }

  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug, resolvedParams.locale);

  if (!post) {
    return {
      title: 'Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 動的OG画像のURL生成
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}&category=${post.category}&locale=${resolvedParams.locale}`;
  // フォールバック: 静的なデフォルトOG画像
  const fallbackImageUrl = `${baseUrl}/og-default.png`;

  // 同じslugの記事が存在する言語版を取得
  const locales = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id'];
  const availableLocales: Record<string, string> = {};
  
  locales.forEach(locale => {
    const localePost = getPostBySlug(resolvedParams.slug, locale);
    if (localePost) {
      availableLocales[locale] = `${baseUrl}/${locale}/blog/${post.slug}`;
    }
  });
  
  // x-defaultは英語版が存在する場合は英語版、存在しない場合は最初に見つかった言語版
  if (availableLocales['en']) {
    availableLocales['x-default'] = availableLocales['en'];
  } else if (Object.keys(availableLocales).length > 0) {
    const firstLocale = Object.keys(availableLocales)[0];
    availableLocales['x-default'] = availableLocales[firstLocale];
  }
  
  // 現在の言語版が含まれていない場合は追加（念のため）
  if (!availableLocales[resolvedParams.locale]) {
    availableLocales[resolvedParams.locale] = `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`;
  }

  return {
    title: `${post.title} | siftbeam Blog`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`,
      languages: Object.keys(availableLocales).length > 0 ? availableLocales : {
        'x-default': `${baseUrl}/en/blog/${post.slug}`,
        [resolvedParams.locale]: `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/${resolvedParams.locale}/blog/${post.slug}`,
      type: 'article',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        {
          url: fallbackImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl, fallbackImageUrl],
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

export default async function BlogPostPage(
  props: { params: Promise<{ locale: string; slug: string }> }
) {
  const params = await props.params;
  const post = getPostBySlug(params.slug, params.locale);

  if (!post) {
    notFound();
  }

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

  const breadcrumbLabels = breadcrumbTranslations[params.locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];

  const breadcrumbData = generateBreadcrumbStructuredData(params.locale, [
    { name: breadcrumbLabels.home, url: `/${params.locale}` },
    { name: breadcrumbLabels.blog, url: `/${params.locale}/blog` },
    { name: post.title, url: `/${params.locale}/blog/${post.slug}` }
  ]);

  // Article構造化データ
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}&category=${post.category}&locale=${params.locale}`;
  const fallbackImageUrl = `${baseUrl}/og-default.png`;
  
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [
      {
        '@type': 'ImageObject',
        url: ogImageUrl,
        width: 1200,
        height: 630,
      },
      {
        '@type': 'ImageObject',
        url: fallbackImageUrl,
        width: 1200,
        height: 630,
      },
    ],
    author: {
      '@type': 'Organization',
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'siftbeam',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${params.locale}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    inLanguage: params.locale,
  };

  // FAQ構造化データ（記事に基づいて生成）
  const faqData = generateArticleFAQStructuredData(params.locale, post.slug);

  return (
    <>
      <StructuredData data={breadcrumbData} id="blog-post-breadcrumb" />
      <StructuredData data={articleData} id="blog-post-article" />
      {faqData && <StructuredData data={faqData} id="blog-post-faq" />}
      <BlogDetailContainer params={params} />
    </>
  );
}

// 記事に基づいたFAQ構造化データを生成
function generateArticleFAQStructuredData(locale: string, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 記事ごとのFAQ定義
  const faqMap: Record<string, Record<string, Array<{ question: string; answer: string }>>> = {
    'data-processing-automation-guide': {
      en: [
        {
          question: 'What is data processing automation?',
          answer: 'Data processing automation refers to using systems and tools to automatically execute tasks that humans previously performed manually, such as data transformation, aggregation, and transfer. It can reduce manual work by over 90% and save 500+ hours annually.',
        },
        {
          question: 'How much time can data processing automation save?',
          answer: 'Data processing automation can save 500+ hours annually. For example, a manufacturing company reduced monthly report creation time from 3 days to 30 minutes, saving 282 hours per year.',
        },
        {
          question: 'What are the benefits of automating data processing?',
          answer: 'Key benefits include: time savings (reduce work by 90%+), improved accuracy (zero human errors), cost reduction (save $9,000+ annually), and scalability (maintain consistent processing time even with 10x data volume).',
        },
        {
          question: 'How do I get started with data processing automation?',
          answer: 'Start by analyzing your current operations, prioritizing high-frequency and time-consuming tasks, selecting the right tool (no-code tools, cloud services like siftbeam, or in-house development), starting small with one process, and gradually scaling up.',
        },
        {
          question: 'What is manual data processing?',
          answer: 'Manual data processing involves humans performing data tasks manually each time, such as copying data between Excel files, creating reports, or entering data. This approach is time-consuming, error-prone, and doesn\'t scale well.',
        },
      ],
      es: [
        {
          question: '¿Qué es la automatización del procesamiento de datos?',
          answer: 'La automatización del procesamiento de datos se refiere al uso de sistemas y herramientas para ejecutar automáticamente tareas que los humanos realizaban anteriormente de forma manual, como transformación, agregación y transferencia de datos. Puede reducir el trabajo manual en más del 90% y ahorrar 500+ horas anuales.',
        },
        {
          question: '¿Cuánto tiempo puede ahorrar la automatización del procesamiento de datos?',
          answer: 'La automatización del procesamiento de datos puede ahorrar 500+ horas anuales. Por ejemplo, una empresa manufacturera redujo el tiempo de creación de informes mensuales de 3 días a 30 minutos, ahorrando 282 horas por año.',
        },
        {
          question: '¿Cuáles son los beneficios de automatizar el procesamiento de datos?',
          answer: 'Los beneficios clave incluyen: ahorro de tiempo (reducir el trabajo en 90%+), mejora de precisión (cero errores humanos), reducción de costos (ahorrar $9,000+ anuales) y escalabilidad (mantener tiempo de procesamiento consistente incluso con 10x volumen de datos).',
        },
        {
          question: '¿Cómo comienzo con la automatización del procesamiento de datos?',
          answer: 'Comience analizando sus operaciones actuales, priorizando tareas de alta frecuencia y que consumen tiempo, seleccionando la herramienta adecuada (herramientas sin código, servicios en la nube como siftbeam, o desarrollo interno), comenzando pequeño con un proceso y escalando gradualmente.',
        },
        {
          question: '¿Qué es el procesamiento manual de datos?',
          answer: 'El procesamiento manual de datos implica que los humanos realicen tareas de datos manualmente cada vez, como copiar datos entre archivos Excel, crear informes o ingresar datos. Este enfoque consume tiempo, es propenso a errores y no escala bien.',
        },
      ],
      zh: [
        {
          question: '什么是自动数据处理？',
          answer: '自动数据处理是指使用系统和工具自动执行人类以前手动执行的任务，如数据转换、聚合和传输。它可以减少90%以上的手动工作，每年节省500+小时。',
        },
        {
          question: '自动数据处理可以节省多少时间？',
          answer: '自动数据处理每年可以节省500+小时。例如，一家制造公司将月度报告创建时间从3天缩短到30分钟，每年节省282小时。',
        },
        {
          question: '自动化数据处理有哪些好处？',
          answer: '主要好处包括：节省时间（减少90%+的工作）、提高准确性（零人为错误）、降低成本（每年节省$9,000+）和可扩展性（即使数据量增加10倍也能保持一致的处理时间）。',
        },
        {
          question: '如何开始使用自动数据处理？',
          answer: '首先分析当前操作，优先处理高频和耗时的任务，选择合适的工具（无代码工具、云服务如siftbeam或内部开发），从一个流程开始，然后逐步扩展。',
        },
        {
          question: '什么是手动数据处理？',
          answer: '手动数据处理涉及人类每次手动执行数据任务，如在Excel文件之间复制数据、创建报告或输入数据。这种方法耗时、容易出错且无法很好地扩展。',
        },
      ],
      ja: [
        {
          question: 'データ処理の自動化とは何ですか？',
          answer: 'データ処理の自動化とは、データ変換、集約、転送など、以前は人間が手動で行っていたタスクを、システムやツールを使用して自動的に実行することを指します。手動作業を90%以上削減し、年間500時間以上を節約できます。',
        },
        {
          question: 'データ処理の自動化でどれくらい時間を節約できますか？',
          answer: 'データ処理の自動化により、年間500時間以上を節約できます。例えば、ある製造業では月次レポート作成時間を3日から30分に短縮し、年間282時間を節約しました。',
        },
        {
          question: 'データ処理の自動化にはどのようなメリットがありますか？',
          answer: '主なメリットには、時間削減（作業を90%以上削減）、精度向上（人為的ミスがゼロ）、コスト削減（年間$9,000以上節約）、スケーラビリティ（データ量が10倍になっても処理時間がほぼ一定）が含まれます。',
        },
        {
          question: 'データ処理の自動化を始めるにはどうすればよいですか？',
          answer: '現在の業務を分析し、高頻度で時間のかかるタスクを優先し、適切なツール（ノーコードツール、siftbeamなどのクラウドサービス、または社内開発）を選択し、1つのプロセスから小さく始めて、段階的に拡大していきます。',
        },
        {
          question: '手動データ処理とは何ですか？',
          answer: '手動データ処理とは、Excelファイル間でのデータコピー、レポート作成、データ入力など、人間が毎回手動でデータタスクを実行することを指します。この方法は時間がかかり、エラーが発生しやすく、スケールしません。',
        },
      ],
      ko: [
        {
          question: '데이터 처리 자동화란 무엇입니까?',
          answer: '데이터 처리 자동화는 데이터 변환, 집계, 전송 등 이전에 인간이 수동으로 수행했던 작업을 시스템과 도구를 사용하여 자동으로 실행하는 것을 의미합니다. 수동 작업을 90% 이상 줄이고 연간 500시간 이상을 절약할 수 있습니다.',
        },
        {
          question: '데이터 처리 자동화로 얼마나 많은 시간을 절약할 수 있습니까?',
          answer: '데이터 처리 자동화는 연간 500시간 이상을 절약할 수 있습니다. 예를 들어, 한 제조업체는 월간 보고서 작성 시간을 3일에서 30분으로 단축하여 연간 282시간을 절약했습니다.',
        },
        {
          question: '데이터 처리 자동화의 이점은 무엇입니까?',
          answer: '주요 이점에는 시간 절약(작업 90% 이상 감소), 정확도 향상(인적 오류 제로), 비용 절감(연간 $9,000 이상 절약), 확장성(데이터 양이 10배 증가해도 처리 시간이 거의 일정)이 포함됩니다.',
        },
        {
          question: '데이터 처리 자동화를 시작하려면 어떻게 해야 합니까?',
          answer: '현재 운영을 분석하고, 고빈도 및 시간 소모적인 작업을 우선순위화하고, 적절한 도구(노코드 도구, siftbeam과 같은 클라우드 서비스 또는 내부 개발)를 선택하고, 하나의 프로세스로 작게 시작하여 점진적으로 확장합니다.',
        },
        {
          question: '수동 데이터 처리가 무엇입니까?',
          answer: '수동 데이터 처리는 Excel 파일 간 데이터 복사, 보고서 작성 또는 데이터 입력과 같이 인간이 매번 수동으로 데이터 작업을 수행하는 것을 의미합니다. 이 방법은 시간이 많이 걸리고 오류가 발생하기 쉬우며 확장성이 없습니다.',
        },
      ],
      fr: [
        {
          question: 'Qu\'est-ce que l\'automatisation du traitement des données?',
          answer: 'L\'automatisation du traitement des données fait référence à l\'utilisation de systèmes et d\'outils pour exécuter automatiquement des tâches que les humains effectuaient auparavant manuellement, telles que la transformation, l\'agrégation et le transfert de données. Elle peut réduire le travail manuel de plus de 90% et économiser plus de 500 heures par an.',
        },
        {
          question: 'Combien de temps l\'automatisation du traitement des données peut-elle économiser?',
          answer: 'L\'automatisation du traitement des données peut économiser plus de 500 heures par an. Par exemple, une entreprise manufacturière a réduit le temps de création de rapports mensuels de 3 jours à 30 minutes, économisant 282 heures par an.',
        },
        {
          question: 'Quels sont les avantages de l\'automatisation du traitement des données?',
          answer: 'Les avantages clés incluent: économie de temps (réduire le travail de 90%+), amélioration de la précision (zéro erreur humaine), réduction des coûts (économiser plus de $9,000 par an) et évolutivité (maintenir un temps de traitement constant même avec 10x le volume de données).',
        },
        {
          question: 'Comment commencer avec l\'automatisation du traitement des données?',
          answer: 'Commencez par analyser vos opérations actuelles, priorisez les tâches à haute fréquence et chronophages, sélectionnez le bon outil (outils sans code, services cloud comme siftbeam ou développement interne), commencez petit avec un processus et développez progressivement.',
        },
        {
          question: 'Qu\'est-ce que le traitement manuel des données?',
          answer: 'Le traitement manuel des données implique que les humains effectuent des tâches de données manuellement à chaque fois, comme copier des données entre des fichiers Excel, créer des rapports ou saisir des données. Cette approche prend du temps, est sujette aux erreurs et ne s\'adapte pas bien.',
        },
      ],
      de: [
        {
          question: 'Was ist Datenverarbeitungsautomatisierung?',
          answer: 'Datenverarbeitungsautomatisierung bezieht sich auf die Verwendung von Systemen und Tools zur automatischen Ausführung von Aufgaben, die Menschen zuvor manuell durchgeführt haben, wie Datenumwandlung, Aggregation und Übertragung. Sie kann die manuelle Arbeit um über 90% reduzieren und mehr als 500 Stunden pro Jahr einsparen.',
        },
        {
          question: 'Wie viel Zeit kann die Datenverarbeitungsautomatisierung einsparen?',
          answer: 'Die Datenverarbeitungsautomatisierung kann mehr als 500 Stunden pro Jahr einsparen. Beispielsweise reduzierte ein Fertigungsunternehmen die monatliche Berichtserstellung von 3 Tagen auf 30 Minuten und sparte 282 Stunden pro Jahr.',
        },
        {
          question: 'Was sind die Vorteile der Automatisierung der Datenverarbeitung?',
          answer: 'Die wichtigsten Vorteile sind: Zeitersparnis (Arbeit um 90%+ reduzieren), verbesserte Genauigkeit (null menschliche Fehler), Kostensenkung (mehr als $9,000 pro Jahr sparen) und Skalierbarkeit (konstante Verarbeitungszeit auch bei 10x Datenvolumen beibehalten).',
        },
        {
          question: 'Wie beginne ich mit der Datenverarbeitungsautomatisierung?',
          answer: 'Beginnen Sie mit der Analyse Ihrer aktuellen Betriebsabläufe, priorisieren Sie hochfrequente und zeitaufwändige Aufgaben, wählen Sie das richtige Tool (No-Code-Tools, Cloud-Dienste wie siftbeam oder interne Entwicklung), beginnen Sie klein mit einem Prozess und skalieren Sie schrittweise.',
        },
        {
          question: 'Was ist manuelle Datenverarbeitung?',
          answer: 'Manuelle Datenverarbeitung bedeutet, dass Menschen Datenaufgaben jedes Mal manuell durchführen, wie das Kopieren von Daten zwischen Excel-Dateien, das Erstellen von Berichten oder die Dateneingabe. Dieser Ansatz ist zeitaufwändig, fehleranfällig und skaliert nicht gut.',
        },
      ],
      pt: [
        {
          question: 'O que é automação de processamento de dados?',
          answer: 'A automação de processamento de dados refere-se ao uso de sistemas e ferramentas para executar automaticamente tarefas que os humanos realizavam anteriormente manualmente, como transformação, agregação e transferência de dados. Pode reduzir o trabalho manual em mais de 90% e economizar mais de 500 horas por ano.',
        },
        {
          question: 'Quanto tempo a automação de processamento de dados pode economizar?',
          answer: 'A automação de processamento de dados pode economizar mais de 500 horas por ano. Por exemplo, uma empresa de manufatura reduziu o tempo de criação de relatórios mensais de 3 dias para 30 minutos, economizando 282 horas por ano.',
        },
        {
          question: 'Quais são os benefícios da automação de processamento de dados?',
          answer: 'Os principais benefícios incluem: economia de tempo (reduzir o trabalho em 90%+), melhoria da precisão (zero erros humanos), redução de custos (economizar mais de $9,000 por ano) e escalabilidade (manter tempo de processamento consistente mesmo com 10x o volume de dados).',
        },
        {
          question: 'Como começar com a automação de processamento de dados?',
          answer: 'Comece analisando suas operações atuais, priorize tarefas de alta frequência e demoradas, selecione a ferramenta certa (ferramentas sem código, serviços em nuvem como siftbeam ou desenvolvimento interno), comece pequeno com um processo e expanda gradualmente.',
        },
        {
          question: 'O que é processamento manual de dados?',
          answer: 'O processamento manual de dados envolve humanos realizando tarefas de dados manualmente a cada vez, como copiar dados entre arquivos Excel, criar relatórios ou inserir dados. Esta abordagem consome tempo, é propensa a erros e não escala bem.',
        },
      ],
      id: [
        {
          question: 'Apa itu otomasi pemrosesan data?',
          answer: 'Otomasi pemrosesan data mengacu pada penggunaan sistem dan alat untuk secara otomatis mengeksekusi tugas yang sebelumnya dilakukan manusia secara manual, seperti transformasi, agregasi, dan transfer data. Dapat mengurangi pekerjaan manual lebih dari 90% dan menghemat lebih dari 500 jam per tahun.',
        },
        {
          question: 'Berapa banyak waktu yang dapat dihemat oleh otomasi pemrosesan data?',
          answer: 'Otomasi pemrosesan data dapat menghemat lebih dari 500 jam per tahun. Misalnya, sebuah perusahaan manufaktur mengurangi waktu pembuatan laporan bulanan dari 3 hari menjadi 30 menit, menghemat 282 jam per tahun.',
        },
        {
          question: 'Apa manfaat otomasi pemrosesan data?',
          answer: 'Manfaat utama meliputi: penghematan waktu (mengurangi pekerjaan 90%+), peningkatan akurasi (nol kesalahan manusia), pengurangan biaya (menghemat lebih dari $9,000 per tahun), dan skalabilitas (mempertahankan waktu pemrosesan konsisten bahkan dengan 10x volume data).',
        },
        {
          question: 'Bagaimana cara memulai otomasi pemrosesan data?',
          answer: 'Mulai dengan menganalisis operasi saat ini, memprioritaskan tugas berfrekuensi tinggi dan memakan waktu, memilih alat yang tepat (alat tanpa kode, layanan cloud seperti siftbeam atau pengembangan internal), mulai kecil dengan satu proses dan berkembang secara bertahap.',
        },
        {
          question: 'Apa itu pemrosesan data manual?',
          answer: 'Pemrosesan data manual melibatkan manusia yang melakukan tugas data secara manual setiap kali, seperti menyalin data antar file Excel, membuat laporan atau memasukkan data. Pendekatan ini memakan waktu, rentan terhadap kesalahan dan tidak dapat diskalakan dengan baik.',
        },
      ],
    },
  };

  const faqs = faqMap[slug]?.[locale] || faqMap[slug]?.['en'];
  
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}


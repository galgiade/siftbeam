import AnnouncementContainer from "@/app/_containers/Announcement/AnnouncementContainer";
import { pickDictionary } from "@/app/dictionaries/mappings";
import { announcementDictionaries } from "@/app/dictionaries/mappings";
import { Metadata } from "next";
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'

// 全言語対応のキーワード設定
const getAnnouncementKeywordsByLocale = (locale: string): string[] => {
  const keywordMap = {
    ja: ['お知らせ', 'ニュース', '更新情報', 'アナウンスメント', '新着情報', 'リリース情報', 'サービス情報', '機能追加', '重要なお知らせ', 'サービス更新'],
    'en-US': ['announcements', 'news', 'updates', 'notices', 'latest news', 'release notes', 'service updates', 'new features', 'important notices', 'service news'],
    en: ['announcements', 'news', 'updates', 'notices', 'latest news', 'release notes', 'service updates', 'new features', 'important notices', 'service news'],
    'zh-CN': ['公告', '新闻', '更新', '通知', '最新消息', '发布说明', '服务更新', '新功能', '重要通知', '服务新闻'],
    zh: ['公告', '新闻', '更新', '通知', '最新消息', '发布说明', '服务更新', '新功能', '重要通知', '服务新闻'],
    ko: ['공지사항', '뉴스', '업데이트', '알림', '최신 소식', '릴리스 노트', '서비스 업데이트', '새 기능', '중요 공지', '서비스 뉴스'],
    fr: ['annonces', 'actualités', 'mises à jour', 'avis', 'dernières nouvelles', 'notes de version', 'mises à jour du service', 'nouvelles fonctionnalités', 'avis importants', 'actualités du service'],
    de: ['Ankündigungen', 'Nachrichten', 'Updates', 'Mitteilungen', 'Neuigkeiten', 'Versionshinweise', 'Service-Updates', 'neue Funktionen', 'wichtige Mitteilungen', 'Service-Nachrichten'],
    es: ['anuncios', 'noticias', 'actualizaciones', 'avisos', 'últimas noticias', 'notas de versión', 'actualizaciones del servicio', 'nuevas funciones', 'avisos importantes', 'noticias del servicio'],
    pt: ['anúncios', 'notícias', 'atualizações', 'avisos', 'últimas notícias', 'notas de versão', 'atualizações do serviço', 'novos recursos', 'avisos importantes', 'notícias do serviço'],
    id: ['pengumuman', 'berita', 'pembaruan', 'pemberitahuan', 'berita terbaru', 'catatan rilis', 'pembaruan layanan', 'fitur baru', 'pemberitahuan penting', 'berita layanan']
  };
  
  return keywordMap[locale as keyof typeof keywordMap] || keywordMap['en'];
};

const getLocaleByLanguage = (locale: string): string => {
  const localeMap = {
    ja: 'ja_JP',
    'en-US': 'en_US',
    en: 'en_US',
    'zh-CN': 'zh_CN',
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

// 静的ページ生成のためのメタデータ
export async function generateMetadata(
  { params }: { params: Promise<{ locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh" }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(announcementDictionaries, resolvedParams.locale, 'en')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: `${dict.hero.title} | siftbeam` || 'Announcements | siftbeam',
    description: dict.hero.subtitle || 'Latest announcements and updates from siftbeam',
    keywords: getAnnouncementKeywordsByLocale(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/announcement`,
      languages: {
        'ja': `${baseUrl}/ja/announcement`,
        'en': `${baseUrl}/en/announcement`,
        'zh': `${baseUrl}/zh/announcement`,
        'ko': `${baseUrl}/ko/announcement`,
        'fr': `${baseUrl}/fr/announcement`,
        'de': `${baseUrl}/de/announcement`,
        'es': `${baseUrl}/es/announcement`,
        'pt': `${baseUrl}/pt/announcement`,
        'id': `${baseUrl}/id/announcement`,
      },
    },
    openGraph: {
      title: `${dict.hero.title} | siftbeam` || 'Announcements | siftbeam',
      description: dict.hero.subtitle || 'Latest announcements and updates from siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/announcement`,
      type: 'website',
      locale: getLocaleByLanguage(resolvedParams.locale),
      siteName: 'siftbeam',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: dict.hero.title || 'Announcements',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.hero.title} | siftbeam` || 'Announcements | siftbeam',
      description: dict.hero.subtitle || 'Latest announcements and updates from siftbeam',
      images: [`${baseUrl}/og-image.jpg`],
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


export default async function Announcement(
	{ params }: { params: Promise<{ locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh" }> }
) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;
	
	// パンくずリストの翻訳
	const breadcrumbTranslations = {
		ja: { home: 'ホーム', announcement: 'お知らせ' },
		'en': { home: 'Home', announcement: 'Announcements' },
		'zh': { home: '主页', announcement: '公告' },
		ko: { home: '홈', announcement: '공지사항' },
		fr: { home: 'Accueil', announcement: 'Annonces' },
		de: { home: 'Startseite', announcement: 'Ankündigungen' },
		es: { home: 'Inicio', announcement: 'Anuncios' },
		pt: { home: 'Início', announcement: 'Anúncios' },
		id: { home: 'Beranda', announcement: 'Pengumuman' }
	};
	
	const breadcrumbLabels = breadcrumbTranslations[locale as keyof typeof breadcrumbTranslations] || breadcrumbTranslations['en'];
	
	const breadcrumbData = generateBreadcrumbStructuredData(locale, [
		{ name: breadcrumbLabels.home, url: `/${locale}` },
		{ name: breadcrumbLabels.announcement, url: `/${locale}/announcement` }
	]);
	
	return (
		<>
			{/* 構造化データ */}
			<StructuredData data={breadcrumbData} />
			
			<AnnouncementContainer 
				locale={resolvedParams.locale}
			/>
		</>
	);
}
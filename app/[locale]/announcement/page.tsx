import AnnouncementContainer from "@/app/_containers/Announcement/AnnouncementContainer";
import { pickDictionary } from "@/app/dictionaries/mappings";
import { announcementDictionaries } from "@/app/dictionaries/mappings";
import { Metadata } from "next";
import StructuredData, { generateBreadcrumbStructuredData } from '@/app/_components/common/StructuredData'
import { getOGLocale, generateAlternateLanguages, generateOGImages } from '@/app/lib/seo-helpers'

// 言語別キーワード
const getAnnouncementKeywords = (locale: string): string[] => {
  const keywords: Record<string, string[]> = {
    ja: ['お知らせ', 'ニュース', '更新情報', 'アナウンスメント', '新着情報', 'リリース情報', 'サービス情報', '機能追加', '重要なお知らせ', 'サービス更新'],
    'en-US': ['announcements', 'news', 'updates', 'notices', 'latest news', 'release notes', 'service updates', 'new features', 'important notices', 'service news'],
    en: ['announcements', 'news', 'updates', 'notices', 'latest news', 'release notes', 'service updates', 'new features', 'important notices', 'service news'],
    'zh-CN': ['公告', '新闻', '更新', '通知', '最新消息', '发布说明', '服务更新', '新功能', '重要通知', '服务新闻'],
    zh: ['公告', '新闻', '更新', '通知', '最新消息', '发布说明', '服务更新', '新功能', '重要通知', '服务新闻'],
    ko: ['공지사항', '뉴스', '업데이트', '알림', '최신 소식', '릴리스 노트', '서비스 업데이트', '새 기능', '중요 공지', '서비스 뉴스'],
  };
  return keywords[locale] || keywords['en-US'];
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
    keywords: getAnnouncementKeywords(resolvedParams.locale),
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/announcement`,
      languages: generateAlternateLanguages('/announcement', baseUrl),
    },
    openGraph: {
      title: `${dict.hero.title} | siftbeam` || 'Announcements | siftbeam',
      description: dict.hero.subtitle || 'Latest announcements and updates from siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/announcement`,
      type: 'website',
      locale: getOGLocale(resolvedParams.locale),
      siteName: 'siftbeam',
      images: generateOGImages(dict.hero.title || 'Announcements', baseUrl),
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
	
	// 構造化データ
	const breadcrumbData = generateBreadcrumbStructuredData(locale, [
		{ name: locale === 'ja' ? 'ホーム' : 'Home', url: `/${locale}` },
		{ name: locale === 'ja' ? 'お知らせ' : 'Announcements', url: `/${locale}/announcement` }
	]);
	
	return (
		<>
			<StructuredData data={breadcrumbData} />
			<AnnouncementContainer 
				locale={resolvedParams.locale}
			/>
		</>
	);
}
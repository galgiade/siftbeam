import AnnouncementContainer from "@/app/_containers/Announcement/AnnouncementContainer";
import { pickDictionary } from "@/app/dictionaries/mappings";
import { announcementDictionaries } from "@/app/dictionaries/mappings";
import { Metadata } from "next";

// 静的ページ生成のためのメタデータ
export async function generateMetadata(
  { params }: { params: Promise<{ locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh" }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(announcementDictionaries, resolvedParams.locale, 'en')
  
  return {
    title: dict.hero.title || 'siftbeam',
    description: dict.hero.subtitle || 'AI-powered business insights platform',
    openGraph: {
      title: dict.hero.title || 'siftbeam',
      description: dict.hero.subtitle || 'AI-powered business insights platform',
    },
  }
}


export default async function Announcement(
	{ params }: { params: Promise<{ locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh" }> }
) {
	const resolvedParams = await params;
	return (
		<AnnouncementContainer 
			locale={resolvedParams.locale}
		/>
	);
}
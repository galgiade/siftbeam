import AnnouncementDetailContainer from "@/app/_containers/Announcement/[announcement-id]/AnnouncementDetailContainer";
import { pickDictionary, announcementDictionaries } from "@/app/dictionaries/mappings";
import { Metadata } from "next";


export async function generateMetadata(
	{ params }: { params: Promise<{ locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh", announcementId: string }> }
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

export default async function AnnouncementDetailPage({ params }: { params: Promise<{locale: string, announcementId: string}> }) {
	const resolvedParams = await params;
	return <AnnouncementDetailContainer params={resolvedParams} />;
}

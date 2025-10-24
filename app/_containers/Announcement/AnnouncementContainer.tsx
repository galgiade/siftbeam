import AnnouncementPresentation from "./AnnouncementPresentation";
import { getAnnouncementsAction } from '@/app/lib/actions/announcement-actions';
import { announcementDictionaries, pickDictionary } from "@/app/dictionaries/mappings";

// 複数のダミーデータを作成

export default async function AnnouncementContainer({ locale }: { locale: "ja" | "en" | "es" | "fr" | "de" | "ko" | "pt" | "id" | "zh" }) {
	const dict = pickDictionary(announcementDictionaries, locale, 'en');
	
	try {
		const announcements = await getAnnouncementsAction(locale);
		
		return (
			<div className="pt-10">
			<AnnouncementPresentation 
				announcements={announcements}
				dict={dict}
			/>
			</div>
		);
	} catch (error) {
		// エラー時は空の配列を渡す
		return (
			<div className="pt-10">
			<AnnouncementPresentation 
				announcements={[]}
				dict={dict}
			/>
			</div>
		);
	}
}



import { announcementDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getAnnouncementAction } from '@/app/lib/actions/announcement-actions';
import AnnouncementDetailPresentation from './AnnouncementDetailPresentation';

export default async function AnnouncementDetailContainer( { params }: { params: {locale: string, announcementId: string } } ) {
	const { announcementId, locale } = params;
	const dict = pickDictionary(announcementDictionaries, locale, 'en');
	
	try {
		// 実際のデータベースからアナウンスメントを取得
		const announcementDetail = await getAnnouncementAction(announcementId);
		
		if (!announcementDetail) {
			return <div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500">{dict.error.notFound}</p>
			</div>;
		}

		return (
			<div className="pt-10">
				<AnnouncementDetailPresentation announcementDetail={announcementDetail} dict={dict} />
			</div>
		);
	} catch (error) {
		console.error('アナウンスメント取得エラー:', error);
		return <div className="min-h-screen flex items-center justify-center">
			<p className="text-gray-500">{dict.error.notFound}</p>
		</div>;
	}
}

import { AnnouncementLocale } from '@/app/dictionaries/announcement/announcement';
import { Announcement } from '@/app/lib/actions/announcement-actions';
import Link from 'next/link';

export default function AnnouncementDetailPresentation( { announcementDetail, dict }: { announcementDetail: Announcement, dict: AnnouncementLocale } ) {
	const locale = dict.locale;
	
	// 優先度に基づくスタイルとテキストを取得
	const getPriorityStyle = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high':
				return dict.priority.high;
			case 'medium':
				return dict.priority.medium;
			case 'low':
				return dict.priority.low;
			default:
				return dict.priority.low;
		}
	};

	const getCategoryText = (category: string) => {
		switch (category) {
			case 'price':
				return dict.categoryDisplay.price;
			case 'feature':
				return dict.categoryDisplay.feature;
			case 'other':
				return dict.categoryDisplay.other;
			default:
				return dict.categoryDisplay.other;
		}
	};

	// 日付をフォーマット
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	};

	return (
		<div className="min-h-screen">
			<div className="w-2/3 mx-auto">
			{/* 戻るボタン */}
			<div className="mb-6">
				<Link href={`/${locale}/announcement`} className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
					← {dict.detail.backToList}
				</Link>
			</div>

			{/* お知らせ詳細 */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				{/* ヘッダー */}
				<div className="border-b pb-4 mb-6">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-2xl font-bold text-gray-900">{announcementDetail.title}</h1>
						<span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(announcementDetail.priority)}`}>
							{getPriorityText(announcementDetail.priority)}
						</span>
					</div>
					<div className="flex items-center gap-4 text-sm text-gray-600">
						<span>{dict.table.category}: {getCategoryText(announcementDetail.category)}</span>
						<span>{dict.table.date}: {formatDate(announcementDetail.createdAt)}</span>
					</div>
				</div>
				
				{/* 説明文 */}
				{announcementDetail.description && (
					<div className="mb-6 p-4 bg-gray-50 rounded-lg">
						<p className="text-gray-700">{announcementDetail.description}</p>
					</div>
				)}

				{/* タグ */}
				{announcementDetail.tags && announcementDetail.tags.length > 0 && (
					<div className="mb-6">
						<div className="flex flex-wrap gap-2">
							{announcementDetail.tags.map((tag: string, index: number) => (
								<span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
									{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* コンテンツ */}
				<div className="prose max-w-none">
					{announcementDetail.content ? (
						<div dangerouslySetInnerHTML={{ __html: announcementDetail.content }} />
					) : (
						<p className="text-gray-500">{dict.detail.noContent}</p>
					)}
				</div>
			</div>
			</div>
		</div>
	);
}

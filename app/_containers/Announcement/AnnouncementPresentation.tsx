'use client'
import { Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Announcement } from '@/app/lib/actions/announcement-actions';
import type { AnnouncementLocale } from '@/app/dictionaries/announcement/announcement.d.ts';

interface AnnouncementPresentationProps {
	announcements: Announcement[];
	dict: AnnouncementLocale;
}

export default function AnnouncementPresentation({ announcements, dict }: AnnouncementPresentationProps) {
	// 日付をフォーマットする関数
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(dict.locale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	};
	
	return (
		<div className="min-h-screen">
			<div className="w-2/3 mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">{dict.hero.title}</h1>
				<p className="text-gray-600">{dict.hero.subtitle}</p>
			</div>

			<Table aria-label={dict.hero.title} className="w-full">
				<TableHeader>
					<TableColumn>{dict.table.date}</TableColumn>
					<TableColumn>{dict.table.category}</TableColumn>
					<TableColumn>{dict.table.title}</TableColumn>
					<TableColumn>{dict.table.priority}</TableColumn>
					<TableColumn>{dict.table.action}</TableColumn>
				</TableHeader>
				<TableBody emptyContent={dict.table.noAnnouncements}>
					{announcements.map((announcement) => (
						<TableRow key={announcement.announcementId}>
							<TableCell>
								<span className="text-sm text-gray-600">
									{formatDate(announcement.createdAt)}
								</span>
							</TableCell>
							<TableCell>
								<Chip size="sm" variant="flat" color="primary">
									{dict.category[announcement.category]}
								</Chip>
							</TableCell>
							<TableCell>
								<span className="font-medium text-gray-900">
									{announcement.title}
								</span>
							</TableCell>
							<TableCell>
								<Chip 
									size="sm" 
									variant="flat" 
									color={announcement.priority === 'high' ? 'danger' : announcement.priority === 'medium' ? 'warning' : 'success'}
								>
									{dict.priority[announcement.priority]}
								</Chip>
							</TableCell>
							<TableCell>
								<Link 
									href={`/${dict.locale}/announcement/${announcement.announcementId}`}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
								>
									{dict.table.viewDetails}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			</div>
		</div>
	);
}



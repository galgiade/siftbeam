import GroupManagementContainer from '@/app/_containers/GroupManagement/GroupManagementContainer';

interface GroupManagementPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * グループ管理ページ
 * 管理者がグループの一覧表示、編集、削除、ユーザー・ポリシー管理を行うページ
 */
export default async function GroupManagementPage({ params }: GroupManagementPageProps) {
  const { locale } = await params;
  return <GroupManagementContainer locale={locale} />;
}

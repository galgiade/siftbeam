import CreateGroupManagementContainer from '@/app/_containers/GroupManagement/create/CreateGroupManagementContainer';

interface CreateGroupManagementPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * グループ作成ページ
 * 管理者が新しいグループを作成するページ
 */
export default async function CreateGroupManagementPage({ params }: CreateGroupManagementPageProps) {
  const { locale } = await params;
  return <CreateGroupManagementContainer locale={locale} />;
}

import CreateGroupManagementContainer from '@/app/_containers/GroupManagement/create/CreateGroupManagementContainer';

interface CreateGroupManagementPageProps {
  params: {
    locale: string;
  };
}

/**
 * グループ作成ページ
 * 管理者が新しいグループを作成するページ
 */
export default function CreateGroupManagementPage({ params }: CreateGroupManagementPageProps) {
  return <CreateGroupManagementContainer locale={params.locale} />;
}

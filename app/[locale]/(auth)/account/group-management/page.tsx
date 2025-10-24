import GroupManagementContainer from '@/app/_containers/GroupManagement/GroupManagementContainer';

interface GroupManagementPageProps {
  params: {
    locale: string;
  };
}

/**
 * グループ管理ページ
 * 管理者がグループの一覧表示、編集、削除、ユーザー・ポリシー管理を行うページ
 */
export default function GroupManagementPage({ params }: GroupManagementPageProps) {
  return <GroupManagementContainer locale={params.locale} />;
}

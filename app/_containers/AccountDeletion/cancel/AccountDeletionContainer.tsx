import { checkDeletionStatusAction } from "@/app/lib/actions/account-deletion-actions";
import AccountDeletionCancelPresentation from "./AccountDeletionPresentation";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { redirect } from 'next/navigation';

export default async function AccountDeletionCancelContainer({ locale }: { locale: string }) {
  // ユーザーの属性を取得
  const userAttributes = await requireUserProfile();
  
  // 管理者権限チェック - 管理者以外はメインページにリダイレクト
  if (userAttributes.role !== 'admin') {
    redirect(`/${locale}/account/account-deletion`);
  }
  
  // 削除ステータスを確認
  const deletionStatus = await checkDeletionStatusAction();
  
  // 削除申請されていない場合はメインページにリダイレクト
  if (!deletionStatus.isDeleted) {
    redirect(`/${locale}/account/account-deletion`);
  }
  
  return (
    <AccountDeletionCancelPresentation 
      userAttributes={userAttributes}
      deletionStatus={deletionStatus}
      locale={locale}
    />
  );
}

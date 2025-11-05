import { checkDeletionStatusAction } from "@/app/lib/actions/account-deletion-actions";
import AccountDeletionCancelPresentation from "./CancelAccountDeletionPresentation";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { accountDeletionDictionaries } from "@/app/dictionaries/mappings";

export default async function CancelAccountDeletionContainer({ locale }: { locale: string }) {
  const dictionary = accountDeletionDictionaries[locale as keyof typeof accountDeletionDictionaries] || accountDeletionDictionaries['ja'];
  
  // ユーザーの属性を取得（無限ループ防止のためskipDeletionCheck=trueを指定）
  const userAttributes = await requireUserProfile(locale, true);
  
  // 管理者権限チェック - 管理者以外はエラーを表示
  if (userAttributes.role !== 'admin') {
    return (
      <AccountDeletionCancelPresentation 
        userAttributes={userAttributes}
        deletionStatus={{ success: false, isDeleted: false }}
        locale={locale}
        dictionary={dictionary}
        accessError="adminOnly"
      />
    );
  }
  
  // 削除ステータスを確認
  const deletionStatus = await checkDeletionStatusAction();
  
  // 削除申請されていない場合はエラーを表示
  if (!deletionStatus.isDeleted) {
    return (
      <AccountDeletionCancelPresentation 
        userAttributes={userAttributes}
        deletionStatus={deletionStatus}
        locale={locale}
        dictionary={dictionary}
        accessError="notDeleted"
      />
    );
  }
  
  return (
    <AccountDeletionCancelPresentation 
      userAttributes={userAttributes}
      deletionStatus={deletionStatus}
      locale={locale}
      dictionary={dictionary}
    />
  );
}

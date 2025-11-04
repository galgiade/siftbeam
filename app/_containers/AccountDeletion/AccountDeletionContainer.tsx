import { getUserCustomAttributes } from "@/app/utils/cognito-utils";
import { checkDeletionStatusAction } from "@/app/lib/actions/account-deletion-actions";
import AccountDeletionPresentation from "./AccountDeletionPresentation";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { accountDeletionDictionaries } from "@/app/dictionaries/mappings";

export default async function AccountDeletionContainer({ locale }: { locale: string }) {
  const dictionary = accountDeletionDictionaries[locale as keyof typeof accountDeletionDictionaries] || accountDeletionDictionaries['ja'];
  
  // ユーザーの属性を取得
  const userAttributes = await requireUserProfile();
  
  // 削除ステータスを確認（影響ユーザー数などの詳細情報を取得）
  const deletionStatus = await checkDeletionStatusAction();
  
  return (
    <AccountDeletionPresentation 
      userAttributes={userAttributes}
      deletionStatus={deletionStatus}
      dictionary={dictionary}
      locale={locale}
    />
  );
}

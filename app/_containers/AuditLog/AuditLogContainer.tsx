import AuditLogPresentation from "./AuditLogPresentation";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { getAuditLogsByCustomerIdAction } from "@/app/lib/actions/audit-log-actions";

export default async function AuditLogContainer({ locale }: { locale: string }) {
  // ユーザーの属性を取得（管理者権限チェック含む）
  const userAttributes = await requireUserProfile();
  
  // 管理者権限チェック
  if (userAttributes.role !== 'admin') {
    throw new Error('Admin privileges required');
  }

  // 初期データを取得（最初の50件）
  const initialAuditLogs = await getAuditLogsByCustomerIdAction(50);
  
  return (
    <AuditLogPresentation 
      userAttributes={userAttributes}
      initialAuditLogs={initialAuditLogs}
      locale={locale}
    />
  );
}

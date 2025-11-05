import AuditLogPresentation from "./AuditLogPresentation";
import AuditLogErrorDisplay from "./AuditLogErrorDisplay";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { getAuditLogsByCustomerIdAction } from "@/app/lib/actions/audit-log-actions";
import { auditLogDictionaries } from "@/app/dictionaries/mappings";

export default async function AuditLogContainer({ locale }: { locale: string }) {
  try {
    const dictionary = auditLogDictionaries[locale as keyof typeof auditLogDictionaries] || auditLogDictionaries['ja'];
    
    // ユーザーの属性を取得
    const userAttributes = await requireUserProfile();
    
    // 管理者権限チェック
    if (userAttributes.role !== 'admin') {
      return (
        <AuditLogErrorDisplay 
          error={dictionary.alert.adminRequired}
          dictionary={dictionary} 
        />
      );
    }

    // 初期データを取得（最初の50件）
    const initialAuditLogs = await getAuditLogsByCustomerIdAction(50);
    
    return (
      <AuditLogPresentation 
        userAttributes={userAttributes}
        initialAuditLogs={initialAuditLogs}
        locale={locale}
        dictionary={dictionary}
      />
    );
  } catch (error: any) {
    console.error('Error in AuditLogContainer:', error);
    
    const dictionary = auditLogDictionaries[locale as keyof typeof auditLogDictionaries] || auditLogDictionaries['ja'];
    
    return (
      <AuditLogErrorDisplay 
        error={error.message || dictionary.alert.unexpectedError}
        dictionary={dictionary} 
      />
    );
  }
}

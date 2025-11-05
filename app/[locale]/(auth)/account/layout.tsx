import { SideNavigation } from './SideNavigation';
import type { AccountLocale } from '@/app/dictionaries/account/AccountLocale.d.ts';
import { accountDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { ACCOUNT_NAVIGATION_ITEMS } from '@/app/lib/constants/navigation';
import { requireUserProfile } from '@/app/lib/utils/require-auth';


export default async function AccountLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const userAttributes = await requireUserProfile(params.locale);

  const {
    children
  } = props;

  // 対応していないロケールの場合はenをデフォルトに
  // URLのロケールを優先して使用
  const account: AccountLocale = pickDictionary(accountDictionaries, params.locale, 'en');

  // 管理者以外は特定リンクを非表示
  const isAdmin = userAttributes.role === 'admin';
  const modeLabel = isAdmin ? account.adminMode : account.userMode;
  const hiddenForNonAdmin = new Set([
    '/account/account-deletion', 
    '/account/payment',
    '/account/user-management', // ユーザー管理は管理者のみ表示
    '/account/policy-management', // ポリシー管理は管理者のみ表示
    '/account/api-management', // API管理は管理者のみ表示
    '/account/group-management', // グループ管理は管理者のみ表示
    '/account/limit-usage', // 使用量制限管理は管理者のみ表示
    '/account/audit-log' // 監査ログは管理者のみ表示
  ]);
  // ナビゲーション項目の翻訳されたラベルを含む配列を作成
  const localizedNavItems = ACCOUNT_NAVIGATION_ITEMS
    .filter(item => isAdmin || !hiddenForNonAdmin.has(item.href))
    .map(item => ({
      ...item,
      label: account[item.key] || item.key // フォールバック
    }));

  return (
    <div className="min-h-screen">
      <SideNavigation role={userAttributes.role} locale={params.locale} navigationItems={localizedNavItems} modeLabel={modeLabel} />
      <main className="ml-64 p-8 pt-16">
        {children}
      </main>
    </div>
  );
}
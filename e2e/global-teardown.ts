import { FullConfig } from '@playwright/test';

/**
 * グローバルティアダウン
 * 
 * 全テスト実行後に1回だけ実行されます
 */
async function globalTeardown(config: FullConfig) {
  console.log('');
  console.log('🏁 全てのテストが完了しました');
  console.log('');
  console.log('💡 認証状態をリセットする場合:');
  console.log('   playwright/.auth/user.json を削除してください');
  console.log('');
}

export default globalTeardown;


import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * グローバルセットアップ
 * 
 * テスト実行前に1回だけ実行され、認証状態を保存します
 * 手動でサインインした後、その認証状態を全テストで再利用できます
 */
async function globalSetup(config: FullConfig) {
  const storageStatePath = path.join(__dirname, '../playwright/.auth/user.json');
  
  // 既に認証状態が保存されている場合はスキップ
  if (fs.existsSync(storageStatePath)) {
    console.log('✅ 認証状態が既に保存されています。スキップします。');
    console.log('💡 再度サインインする場合は、以下のファイルを削除してください:');
    console.log(`   ${storageStatePath}`);
    return;
  }

  console.log('🔐 手動サインインを開始します...');
  console.log('');
  console.log('📝 手順:');
  console.log('1. ブラウザが自動的に開きます');
  console.log('2. サインインページでメールアドレスとパスワードを入力');
  console.log('3. 2段階認証コードを入力（メールを確認）');
  console.log('4. ダッシュボードが表示されたら、認証状態が自動保存されます');
  console.log('5. ブラウザは自動的に閉じます');
  console.log('');

  const browser = await chromium.launch({ 
    headless: false, // ブラウザを表示
    slowMo: 500, // 操作を少しゆっくりにして見やすくする
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // サインインページに移動
    await page.goto('http://localhost:3000/ja/signin');
    
    console.log('⏳ サインインを待機中...');
    console.log('   ブラウザでサインインを完了してください');
    
    // ダッシュボードにリダイレクトされるまで待機（最大5分）
    await page.waitForURL('**/account/**', { 
      timeout: 5 * 60 * 1000, // 5分
    });
    
    console.log('✅ サインイン成功！');
    console.log('💾 認証状態を保存中...');
    
    // 認証状態を保存
    await context.storageState({ path: storageStatePath });
    
    console.log('✅ 認証状態を保存しました:');
    console.log(`   ${storageStatePath}`);
    console.log('');
    console.log('🎉 これで全てのテストで認証状態が再利用されます！');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    console.log('');
    console.log('💡 トラブルシューティング:');
    console.log('1. 開発サーバーが起動しているか確認: npm run dev');
    console.log('2. サインインページにアクセスできるか確認');
    console.log('3. 認証情報が正しいか確認');
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;


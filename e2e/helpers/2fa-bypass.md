# 2段階認証（2FA）の突破方法

## 🔐 現在の2FA実装

このアプリケーションは**メールベースの2段階認証**を使用しています：

1. ユーザー名とパスワードでサインイン
2. メールに6桁の認証コードが送信される
3. 認証コードを入力して完了

## 🎯 E2Eテストでの2FA突破方法

### 方法1: テスト環境で2FAを無効化（推奨）⭐

#### メリット
- ✅ 最もシンプル
- ✅ テストが高速
- ✅ メール送信の依存がない

#### 実装方法

**オプションA: 環境変数で制御**

```typescript
// app/lib/auth/auth-actions.ts

export async function signInAction(
  prevState: SignInActionState,
  formData: FormData
): Promise<SignInActionState> {
  // ... 認証処理 ...

  if (response.AuthenticationResult) {
    // テスト環境では2FAをスキップ
    if (process.env.NODE_ENV === 'test' || process.env.SKIP_2FA === 'true') {
      // トークンを直接保存
      const cookieStore = await cookies();
      cookieStore.set('accessToken', response.AuthenticationResult.AccessToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1時間
      });
      
      return {
        success: true,
        message: 'Sign in successful',
        errors: {},
        redirectTo: `/${locale}/account/user`,
      };
    }

    // 本番環境では2FAを実行
    const emailResult = await sendVerificationEmailAction(email, email, locale);
    // ... 既存の2FA処理 ...
  }
}
```

**環境変数の設定**

```bash
# .env.test
SKIP_2FA=true
```

**Playwright設定**

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      SKIP_2FA: 'true', // テスト時は2FAをスキップ
    },
  },
});
```

---

### 方法2: テスト専用の固定コードを使用

#### メリット
- ✅ 2FAフローをテストできる
- ✅ メール送信不要
- ✅ 実装が簡単

#### 実装方法

```typescript
// app/lib/actions/user-verification-actions.ts

export async function sendVerificationEmailAction(
  email: string,
  userId: string,
  locale: string
): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  // テスト環境では固定コードを使用
  if (process.env.NODE_ENV === 'test' || process.env.USE_TEST_CODE === 'true') {
    const testCode = '123456'; // 固定の認証コード
    
    // DynamoDBに保存（既存の処理）
    await saveVerificationCode(email, testCode);
    
    return {
      success: true,
      verificationId: email,
    };
  }

  // 本番環境では通常のコード生成とメール送信
  // ... 既存の処理 ...
}
```

**テストコード**

```typescript
// e2e/signin-with-2fa.spec.ts
import { test, expect } from '@playwright/test';

test('2FAでサインインできる', async ({ page }) => {
  await page.goto('/ja/signin');
  
  // 認証情報を入力
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'ValidPass123');
  await page.click('button[type="submit"]');
  
  // 2FA画面が表示されるのを待つ
  await expect(page.locator('h1').filter({ hasText: /2段階認証|Two-Factor/ })).toBeVisible();
  
  // 固定コードを入力
  await page.fill('[name="code"]', '123456');
  await page.click('button[type="submit"]');
  
  // ダッシュボードにリダイレクト
  await expect(page).toHaveURL(/\/ja\/account\/user/);
});
```

---

### 方法3: メールサービスのAPIを使用

#### メリット
- ✅ 実際の2FAフローをテスト
- ✅ 本番に近い環境

#### デメリット
- ❌ 複雑
- ❌ 外部依存
- ❌ テストが遅い

#### 実装方法

**Mailinator / Mailtrap などのテストメールサービスを使用**

```typescript
// e2e/helpers/email-helper.ts
import axios from 'axios';

export async function getVerificationCodeFromEmail(email: string): Promise<string> {
  // Mailtrapなどのテストメールサービスから認証コードを取得
  const response = await axios.get(
    `https://mailtrap.io/api/v1/inboxes/${INBOX_ID}/messages`,
    {
      headers: { 'Api-Token': process.env.MAILTRAP_API_TOKEN },
    }
  );
  
  // 最新のメールから認証コードを抽出
  const latestEmail = response.data[0];
  const codeMatch = latestEmail.text_body.match(/\d{6}/);
  
  return codeMatch ? codeMatch[0] : '';
}
```

**テストコード**

```typescript
import { getVerificationCodeFromEmail } from './helpers/email-helper';

test('メールから認証コードを取得してサインイン', async ({ page }) => {
  const testEmail = 'test@inbox.mailtrap.io';
  
  await page.goto('/ja/signin');
  await page.fill('[name="email"]', testEmail);
  await page.fill('[name="password"]', 'ValidPass123');
  await page.click('button[type="submit"]');
  
  // 2FA画面が表示されるのを待つ
  await expect(page.locator('h1').filter({ hasText: /2段階認証/ })).toBeVisible();
  
  // メールから認証コードを取得（最大30秒待機）
  let code = '';
  for (let i = 0; i < 30; i++) {
    code = await getVerificationCodeFromEmail(testEmail);
    if (code) break;
    await page.waitForTimeout(1000);
  }
  
  // 認証コードを入力
  await page.fill('[name="code"]', code);
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/ja\/account\/user/);
});
```

---

### 方法4: DynamoDBから直接認証コードを取得

#### メリット
- ✅ 実際の2FAフローをテスト
- ✅ メール送信不要
- ✅ 高速

#### デメリット
- ❌ DynamoDBへのアクセスが必要
- ❌ やや複雑

#### 実装方法

```typescript
// e2e/helpers/dynamodb-helper.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function getVerificationCodeFromDynamoDB(email: string): Promise<string> {
  const command = new QueryCommand({
    TableName: 'VerificationCodes', // テーブル名を確認
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
    ScanIndexForward: false, // 最新を取得
    Limit: 1,
  });
  
  const response = await docClient.send(command);
  
  if (response.Items && response.Items.length > 0) {
    return response.Items[0].code;
  }
  
  return '';
}
```

**テストコード**

```typescript
import { getVerificationCodeFromDynamoDB } from './helpers/dynamodb-helper';

test('DynamoDBから認証コードを取得してサインイン', async ({ page }) => {
  const testEmail = 'test@example.com';
  
  await page.goto('/ja/signin');
  await page.fill('[name="email"]', testEmail);
  await page.fill('[name="password"]', 'ValidPass123');
  await page.click('button[type="submit"]');
  
  // 2FA画面が表示されるのを待つ
  await expect(page.locator('h1').filter({ hasText: /2段階認証/ })).toBeVisible();
  
  // DynamoDBから認証コードを取得（最大10秒待機）
  let code = '';
  for (let i = 0; i < 10; i++) {
    code = await getVerificationCodeFromDynamoDB(testEmail);
    if (code) break;
    await page.waitForTimeout(1000);
  }
  
  // 認証コードを入力
  await page.fill('[name="code"]', code);
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/ja\/account\/user/);
});
```

---

## 📊 方法の比較

| 方法 | 複雑度 | 速度 | 2FAテスト | 推奨度 |
|------|--------|------|-----------|--------|
| **1. 2FA無効化** | ⭐ 低 | ⭐⭐⭐ 高速 | ❌ できない | ⭐⭐⭐ 推奨 |
| **2. 固定コード** | ⭐⭐ 中 | ⭐⭐⭐ 高速 | ✅ できる | ⭐⭐⭐ 推奨 |
| **3. メールAPI** | ⭐⭐⭐ 高 | ⭐ 遅い | ✅ できる | ⭐ 非推奨 |
| **4. DynamoDB** | ⭐⭐ 中 | ⭐⭐ 中速 | ✅ できる | ⭐⭐ 条件付き |

---

## 🎯 推奨アプローチ

### 一般的なE2Eテスト: 方法1（2FA無効化）

大部分のE2Eテストでは、2FAをスキップして高速に実行：

```typescript
// .env.test
SKIP_2FA=true
```

### 2FA専用テスト: 方法2（固定コード）

2FAフロー自体をテストする場合は、固定コードを使用：

```typescript
// e2e/signin-2fa.spec.ts
test('2FAフローが正しく動作する', async ({ page }) => {
  // 固定コード '123456' を使用
});
```

---

## 🔧 実装の優先順位

1. **まず方法1を実装**（2FA無効化）
   - 環境変数 `SKIP_2FA=true` を追加
   - `auth-actions.ts` を修正

2. **必要に応じて方法2を追加**（固定コード）
   - 2FAフロー自体をテストしたい場合

3. **方法3と4は必要に応じて**
   - 本番に近い環境でテストしたい場合のみ

---

## ✅ 次のステップ

1. **方法1を実装** - `auth-actions.ts` に環境変数チェックを追加
2. **`.env.test`に追加** - `SKIP_2FA=true`
3. **テストを実行** - サインインテストが成功することを確認

```bash
npx playwright test e2e/signin.spec.ts --headed
```

---

**推奨**: まずは**方法1（2FA無効化）**から始めて、必要に応じて**方法2（固定コード）**を追加することをお勧めします。


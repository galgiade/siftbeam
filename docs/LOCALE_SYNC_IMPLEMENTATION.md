# Locale同期実装ドキュメント

## 📋 概要

このドキュメントでは、URLのlocaleとCognitoのlocale属性を同期する実装について説明します。

## 🎯 目的

多言語対応アプリケーションにおいて、以下の問題を解決します：

1. **未認証状態での言語変更**: ホームページで言語を変更後、サインインしてもCognitoのlocaleが古いまま
2. **直接リンクでの訪問**: ブックマークから特定の言語でアクセスした際の不整合
3. **クロスデバイス**: 異なるデバイスからアクセスした際の言語設定の引き継ぎ

## 🔄 言語決定の優先順位

```
1. URLパス（最優先）
   ↓ なければ
2. Cognitoのlocale属性（認証済みユーザーのみ）
   ↓ なければ
3. ブラウザの言語設定（Accept-Language）
   ↓ なければ
4. デフォルト言語（ja）
```

## 🛠️ 実装内容

### 1. LanguageSwitcher の改善

**ファイル**: `app/_components/common/LanguageSwitcher.tsx`

**変更点**:
- URLの変更を最優先で実行（即座に反映）
- 認証済みユーザーの場合、バックグラウンドでCognitoのlocale属性を更新
- エラーハンドリングを強化（Cognito更新失敗してもURL変更は成功）

**動作フロー**:
```typescript
1. ユーザーが言語を選択
2. router.push(newUrl) で即座にURL変更
3. 認証済みの場合:
   a. updateUser() でDynamoDBのlocaleを更新
   b. （バックグラウンド）Cognitoのlocale属性も更新される
4. 未認証の場合:
   - URLのみ変更（Cognitoの更新はスキップ）
```

### 2. 自動サインイン時のLocale同期

**ファイル**: `app/lib/actions/user-verification-actions.ts`

**新規関数**: `syncUserLocaleWithUrl()`

**機能**:
- サインイン成功時に、URLのlocaleをCognitoとDynamoDBに同期
- サポートされている言語のみ同期（ja, en, ko, zh, es, fr, de, pt, id）
- エラーが発生してもサインインは継続

**動作フロー**:
```typescript
1. 自動サインイン成功
2. URLからlocaleを抽出（例: /en/account/user → "en"）
3. Cognitoのlocale属性を更新
4. DynamoDBのユーザーテーブルのlocaleを更新
5. サインイン完了
```

**更新対象**:
- ✅ Cognito User Pool の `locale` カスタム属性
- ✅ DynamoDB Users テーブルの `locale` フィールド

### 3. performAutoSignInAction の拡張

**変更点**:
- 新しいパラメータ `urlLocale?: string` を追加
- 認証成功時に `syncUserLocaleWithUrl()` を呼び出し

**呼び出し箇所**:
- `verifyEmailCodeAction()` 内の自動サインイン処理

## 📊 シナリオ別の動作

### シナリオ1: 未認証状態で言語変更 → サインイン

```
1. ホームページ（/ja/）で言語を「English」に変更
   → URLが /en/ に変更される ✅

2. サインイン
   → Cognitoのlocaleは「ja」だが、URLの「en」が優先される ✅

3. 2段階認証完了（自動サインイン）
   → syncUserLocaleWithUrl() が実行される
   → Cognitoのlocale属性が「en」に更新される ✅
   → DynamoDBのlocaleも「en」に更新される ✅

4. 次回サインイン時
   → Cognitoのlocale「en」が使用される ✅
```

### シナリオ2: 直接リンクでの訪問

```
1. ブックマークから /en/account/user にアクセス
   → Cognitoのlocaleは「ja」

2. サインイン
   → URLの「en」が優先される ✅
   → ページは英語で表示される ✅

3. 2段階認証完了（自動サインイン）
   → syncUserLocaleWithUrl() が実行される
   → Cognitoのlocale属性が「en」に更新される ✅
```

### シナリオ3: 認証済み状態で言語変更

```
1. ユーザーがLanguageSwitcherで言語を「English」に変更

2. router.push('/en/...') で即座にURL変更 ✅

3. バックグラウンドで:
   a. updateUser() がDynamoDBのlocaleを「en」に更新 ✅
   b. Cognitoのlocale属性も「en」に更新される ✅

4. ページが英語で表示される ✅
```

### シナリオ4: 別デバイスからのアクセス

```
1. PCで言語を「English」に設定
   → Cognitoのlocaleが「en」に保存される ✅

2. スマホから /ja/ にアクセス

3. サインイン
   → URLは「ja」だが、サインイン後にCognitoのlocale「en」が優先される可能性
   → （現在の実装では、URLが優先されるため「ja」で表示される）

4. ユーザーが言語を変更しない限り、URLの言語が使用される
```

## 🔧 技術的な詳細

### サポートされている言語

```typescript
const SUPPORTED_LOCALES = ['ja', 'en', 'ko', 'zh', 'es', 'fr', 'de', 'pt', 'id'];
```

### Cognito更新

```typescript
const updateCommand = new AdminUpdateUserAttributesCommand({
  UserPoolId: userPoolId,
  Username: email,
  UserAttributes: [
    {
      Name: 'locale',
      Value: urlLocale
    }
  ]
});
```

### DynamoDB更新

```typescript
// 1. emailでユーザーを検索（GSI使用）
const queryCommand = new QueryCommand({
  TableName: usersTableName,
  IndexName: 'email-index',
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: {
    ':email': { S: email }
  }
});

// 2. ユーザーレコードを更新
const updateUserCommand = new PutItemCommand({
  TableName: usersTableName,
  Item: {
    ...user,
    locale: { S: urlLocale },
    updatedAt: { S: new Date().toISOString() }
  }
});
```

## 🚨 エラーハンドリング

### LanguageSwitcher

- Cognito更新失敗 → URL変更は成功（ユーザー体験に影響なし）
- ログにエラーを記録

### syncUserLocaleWithUrl

- Cognito更新失敗 → サインインは継続
- DynamoDB更新失敗 → サインインは継続（Cognitoは更新済み）
- 無効な言語コード → 同期をスキップ

## 📝 ログ出力

### 成功時

```
=== 言語変更開始 ===
新しい言語: en
認証状態: true
Cognitoのlocale属性を更新中: { newLocale: 'en', userId: 'user-123' }
✅ Cognitoのlocale属性が正常に更新されました

=== Locale同期開始 ===
Email: user@example.com
URLのlocale: en
✅ Cognitoのlocale属性を同期しました: en
✅ DynamoDBのlocale属性を同期しました: { userId: 'user-123', urlLocale: 'en' }
```

### エラー時

```
❌ Cognitoのlocale属性の更新に失敗: [エラーメッセージ]
❌ Locale同期エラー: [エラーメッセージ]
❌ DynamoDB locale同期エラー: [エラーメッセージ]
```

## 🧪 テスト項目

### 必須テスト

1. ✅ 未認証状態で言語変更 → サインイン → 言語が同期される
2. ✅ 認証済み状態で言語変更 → 即座に反映される
3. ✅ 直接リンクでアクセス → URLの言語が優先される
4. ✅ サインアップ → 自動サインイン → URLの言語が同期される
5. ✅ Cognito更新失敗 → サインインは成功する
6. ✅ DynamoDB更新失敗 → サインインは成功する（Cognitoは更新済み）
7. ✅ 無効な言語コード → エラーが発生しない

### 推奨テスト

1. 複数デバイスでの言語設定の引き継ぎ
2. ブラウザの言語設定との整合性
3. メール通知の言語（Cognitoのlocale属性を使用）

## 🔮 今後の改善案

### 1. ミドルウェアでの言語決定

現在はクライアントサイドで言語を決定していますが、ミドルウェアで以下の優先順位を実装することを検討：

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const urlLocale = request.nextUrl.pathname.split('/')[1];
  const cognitoLocale = getUserLocaleFromToken(request);
  const browserLocale = request.headers.get('accept-language');
  
  const finalLocale = urlLocale || cognitoLocale || browserLocale || 'ja';
  
  // 必要に応じてリダイレクト
  if (!urlLocale && cognitoLocale) {
    return NextResponse.redirect(new URL(`/${cognitoLocale}${request.nextUrl.pathname}`, request.url));
  }
}
```

### 2. サインイン直後のリダイレクト改善

Cognitoのlocaleとは異なるURLでサインインした場合、ユーザーの好みの言語にリダイレクトするオプションを追加：

```typescript
// オプション: ユーザーの好みの言語を優先
if (cognitoLocale && cognitoLocale !== urlLocale) {
  // ユーザーに確認ダイアログを表示
  // または自動的にCognitoのlocaleにリダイレクト
}
```

### 3. 言語設定の履歴管理

ユーザーの言語変更履歴をログに記録し、分析に活用：

```typescript
// DynamoDBに言語変更履歴を保存
{
  userId: 'user-123',
  timestamp: '2025-01-01T00:00:00Z',
  oldLocale: 'ja',
  newLocale: 'en',
  source: 'language_switcher' // or 'auto_signin', 'direct_link'
}
```

## 📚 関連ファイル

- `app/_components/common/LanguageSwitcher.tsx`
- `app/lib/actions/user-verification-actions.ts`
- `app/lib/actions/user-api.ts`
- `app/_containers/User/UserPresentation.tsx`
- `app/_containers/UserManagement/UserManagementPresentation.tsx`

## 🔗 参考資料

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [AWS Cognito Custom Attributes](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)


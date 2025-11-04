# エラーハンドリングガイド（シンプル版）

## 概要

サーバーアクションは`success: true/false`のみを返し、プレゼンテーション層で辞書を使って適切なメッセージを表示します。

## アーキテクチャ

```
サーバーアクション
  ↓ success: true/false のみ
プレゼンテーション層
  ↓ success分岐で辞書から取得
ユーザーに表示
```

詳細なエラー情報は**監査ログ**に記録され、管理者が確認できます。

## 1. サーバーアクション（修正不要）

### 基本パターン

```typescript
// app/lib/actions/user-api.ts
export async function createUser(input: CreateUserInput): Promise<ApiResponse<User>> {
  try {
    // バリデーション
    if (!input.email) {
      return {
        success: false,
        errors: {
          email: ['メールアドレスは必須です']
        }
      };
    }

    // 処理...
    const newUser = await saveUser(input);

    // 監査ログに成功を記録
    await logSuccessAction('CREATE', 'User', 'userName', '', input.userName);

    return {
      success: true,
      data: newUser
    };
  } catch (error: any) {
    // 監査ログに失敗を記録（詳細なエラー情報）
    await logFailureAction('CREATE', 'User', error?.message || 'ユーザー作成に失敗', 'userName', '', input.userName || '');

    return {
      success: false
    };
  }
}
```

### ポイント
- ✅ `success: true/false`のみ返す
- ✅ バリデーションエラーは`errors`フィールドに設定
- ✅ 詳細なエラーは監査ログに記録
- ✅ **既存のコードは修正不要**

## 2. プレゼンテーション層（Client Component）

### 基本的な使用方法

```typescript
'use client'

import { getFieldError } from '@/app/lib/utils/error-handler';
import { createUser } from '@/app/lib/actions/user-api';

export function UserForm({ dictionary }: { dictionary: UserLocale }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createUser({
        email: formData.get('email') as string,
        userName: formData.get('userName') as string,
        // ...
      });

      return result;
    },
    { success: false }
  );

  return (
    <form action={formAction}>
      {/* 成功メッセージ */}
      {state.success && (
        <Alert color="success">
          {dictionary.messages.user.createSuccess}
        </Alert>
      )}

      {/* エラーメッセージ */}
      {!state.success && state.errors && (
        <Alert color="danger">
          {dictionary.errors.user.createFailed}
        </Alert>
      )}

      {/* フィールドエラー */}
      <Input
        name="email"
        label={dictionary.label.email}
        errorMessage={getFieldError(state.errors, 'email')}
        isInvalid={!!getFieldError(state.errors, 'email')}
      />

      <Button type="submit" isLoading={isPending}>
        {dictionary.label.submit}
      </Button>
    </form>
  );
}
```

### パターン集

#### パターン1: 基本的なsuccess分岐

```typescript
const result = await createUser(input);

if (result.success) {
  toast.success(dictionary.messages.user.createSuccess);
  router.push('/users');
} else {
  toast.error(dictionary.errors.user.createFailed);
}
```

#### パターン2: バリデーションエラーの表示

```typescript
<Input
  name="email"
  errorMessage={getFieldError(state.errors, 'email')}
  isInvalid={!!getFieldError(state.errors, 'email')}
/>

<Input
  name="password"
  errorMessage={getFieldError(state.errors, 'password')}
  isInvalid={!!getFieldError(state.errors, 'password')}
/>
```

#### パターン3: 複数操作の結果表示

```typescript
const handleBulkDelete = async (userIds: string[]) => {
  const result = await deleteUsers(userIds);

  if (result.success) {
    toast.success(dictionary.messages.user.deleteSuccess);
    router.refresh(); // データ再取得
  } else {
    toast.error(dictionary.errors.user.deleteFailed);
  }
};
```

#### パターン4: useActionStateでの使用

```typescript
const [state, formAction, isPending] = useActionState(
  async (prevState: any, formData: FormData) => {
    const result = await updateUser({
      userId: formData.get('userId') as string,
      userName: formData.get('userName') as string,
    });
    return result;
  },
  { success: false }
);

// 成功時の処理
useEffect(() => {
  if (state.success) {
    toast.success(dictionary.messages.user.updateSuccess);
  }
}, [state.success]);
```

## 3. ApiResponse型

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>; // バリデーションエラー
  verificationId?: string; // 2段階認証用
  email?: string; // 2段階認証用
}
```

### フィールド説明

- `success`: 操作の成功/失敗
- `data`: 成功時のデータ
- `errors`: バリデーションエラー（フィールド名 → エラーメッセージ配列）
- `verificationId`: 2段階認証フロー用
- `email`: 2段階認証フロー用

## 4. ヘルパー関数

### `getFieldError(errors, field)`

フィールドの最初のエラーメッセージを取得

```typescript
const emailError = getFieldError(state.errors, 'email');
// 結果: "メールアドレスは必須です" または ""
```

### `getFieldErrors(errors, field)`

フィールドの全エラーメッセージを取得

```typescript
const passwordErrors = getFieldErrors(state.errors, 'password');
// 結果: ["8文字以上必要です", "大文字を含めてください"] または []
```

### `hasFieldError(errors, field?)`

エラーの存在チェック

```typescript
const hasErrors = hasFieldError(state.errors); // 全体チェック
const hasEmailError = hasFieldError(state.errors, 'email'); // 特定フィールド
```

## 5. 辞書ファイルの構造

### 各機能の辞書ファイル

```typescript
// app/dictionaries/user-management/ja.ts
export default {
  label: {
    email: 'メールアドレス',
    userName: 'ユーザー名',
    submit: '送信',
    // ...
  },
  messages: {
    user: {
      createSuccess: 'ユーザーの作成が完了しました',
      updateSuccess: 'ユーザー情報を更新しました',
      deleteSuccess: 'ユーザーを削除しました'
    }
  },
  errors: {
    user: {
      createFailed: 'ユーザーの作成に失敗しました',
      updateFailed: 'ユーザー情報の更新に失敗しました',
      deleteFailed: 'ユーザーの削除に失敗しました'
    }
  }
};
```

## 6. 監査ログでの詳細確認

詳細なエラー情報は監査ログに記録されます：

```typescript
// サーバーアクション内
try {
  // 処理...
  await logSuccessAction('CREATE', 'User', 'userName', '', input.userName);
} catch (error: any) {
  // 詳細なエラー情報を記録
  await logFailureAction(
    'CREATE',
    'User',
    error?.message || 'ユーザー作成に失敗',
    'userName',
    '',
    input.userName || ''
  );
}
```

管理者は監査ログ画面で以下を確認できます：
- エラーの詳細メッセージ
- スタックトレース
- タイムスタンプ
- 実行ユーザー
- 対象リソース

## 7. ベストプラクティス

### ✅ 推奨

```typescript
// シンプルで明確
if (result.success) {
  toast.success(dictionary.messages.user.createSuccess);
} else {
  toast.error(dictionary.errors.user.createFailed);
}
```

### ✅ バリデーションエラーの適切な処理

```typescript
<Input
  name="email"
  label={dictionary.label.email}
  errorMessage={getFieldError(state.errors, 'email')}
  isInvalid={!!getFieldError(state.errors, 'email')}
  description={dictionary.help.emailFormat}
/>
```

### ❌ 避けるべきパターン

```typescript
// ❌ ハードコーディング
if (result.success) {
  toast.success('ユーザーを作成しました');
}

// ❌ 複雑な条件分岐
if (result.success && result.data && result.data.userId) {
  // 複雑すぎる
}
```

## 8. 完全な実装例

### サーバーアクション

```typescript
// app/lib/actions/user-api.ts
export async function updateUser(
  input: UpdateUserInput
): Promise<ApiResponse<User>> {
  try {
    // バリデーション
    const validationErrors: Record<string, string[]> = {};
    
    if (!input.userName) {
      validationErrors.userName = ['ユーザー名は必須です'];
    }
    
    if (!input.email) {
      validationErrors.email = ['メールアドレスは必須です'];
    }
    
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        errors: validationErrors
      };
    }

    // 更新処理
    const updatedUser = await performUpdate(input);

    // 成功ログ
    await logSuccessAction('UPDATE', 'User', 'userId', '', input.userId);

    return {
      success: true,
      data: updatedUser
    };
  } catch (error: any) {
    // 失敗ログ（詳細情報）
    await logFailureAction('UPDATE', 'User', error?.message, 'userId', '', input.userId);

    return {
      success: false
    };
  }
}
```

### プレゼンテーション

```typescript
// app/_containers/User/UserEditForm.tsx
'use client'

import { getFieldError } from '@/app/lib/utils/error-handler';
import { updateUser } from '@/app/lib/actions/user-api';

export function UserEditForm({ user, dictionary }: Props) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateUser({
        userId: user.userId,
        userName: formData.get('userName') as string,
        email: formData.get('email') as string,
      });
      return result;
    },
    { success: false }
  );

  // 成功時の処理
  useEffect(() => {
    if (state.success) {
      toast.success(dictionary.messages.user.updateSuccess);
      router.push('/users');
    }
  }, [state.success]);

  return (
    <form action={formAction}>
      {/* エラーアラート */}
      {!state.success && state.errors && (
        <Alert color="danger" className="mb-4">
          {dictionary.errors.user.updateFailed}
        </Alert>
      )}

      {/* ユーザー名 */}
      <Input
        name="userName"
        label={dictionary.label.userName}
        defaultValue={user.userName}
        errorMessage={getFieldError(state.errors, 'userName')}
        isInvalid={!!getFieldError(state.errors, 'userName')}
        isRequired
      />

      {/* メールアドレス */}
      <Input
        name="email"
        type="email"
        label={dictionary.label.email}
        defaultValue={user.email}
        errorMessage={getFieldError(state.errors, 'email')}
        isInvalid={!!getFieldError(state.errors, 'email')}
        isRequired
      />

      {/* 送信ボタン */}
      <Button
        type="submit"
        color="primary"
        isLoading={isPending}
      >
        {dictionary.label.update}
      </Button>
    </form>
  );
}
```

## まとめ

このシンプルなエラーハンドリングシステムにより:

- ✅ **サーバーアクションの修正不要**
- ✅ シンプルで理解しやすい
- ✅ 完全な多言語対応
- ✅ 詳細なエラーは監査ログで確認
- ✅ バリデーションエラーの適切な表示
- ✅ 保守性の向上

が実現されます。

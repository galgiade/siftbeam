# テストガイド

このプロジェクトでは、Jestと@testing-library/reactを使用してテストを実行します。

## セットアップ

テストに必要なパッケージはすでにインストールされています：

- `jest`: テストフレームワーク
- `@testing-library/react`: Reactコンポーネントのテスト
- `@testing-library/jest-dom`: カスタムマッチャー
- `@testing-library/user-event`: ユーザーインタラクションのシミュレーション
- `jest-environment-jsdom`: ブラウザ環境のシミュレーション

## テストの実行

### すべてのテストを実行

```bash
npm test
```

### ウォッチモードでテストを実行

ファイルの変更を監視して自動的にテストを再実行します。

```bash
npm run test:watch
```

### カバレッジレポートを生成

```bash
npm run test:coverage
```

カバレッジレポートは `coverage/` ディレクトリに生成されます。
ブラウザで `coverage/lcov-report/index.html` を開くと、詳細なレポートを確認できます。

### CI環境でテストを実行

```bash
npm run test:ci
```

## テストファイルの配置

テストファイルは以下の場所に配置します：

1. **コンポーネントのテスト**: `app/_components/**/__tests__/*.test.tsx`
2. **ユーティリティのテスト**: `app/lib/utils/__tests__/*.test.ts`
3. **アクションのテスト**: `app/lib/actions/__tests__/*.test.ts`

## 既存のテスト

### GoogleAnalytics コンポーネント

- ファイル: `app/_components/common/__tests__/GoogleAnalytics.test.tsx`
- テスト内容:
  - 測定IDの検証
  - 測定IDの形式チェック
  - エッジケースの処理

### WebVitals コンポーネント

- ファイル: `app/_components/common/__tests__/WebVitals.test.tsx`
- テスト内容:
  - メトリクスの処理
  - Google Analyticsへの送信
  - 各種Web Vitalsメトリクス（LCP, FID, CLS, FCP, TTFB, INP）

### Analytics ユーティリティ

- ファイル: `app/lib/utils/__tests__/analytics.test.ts`
- テスト内容:
  - ページビューイベント
  - カスタムイベント
  - ヘルパー関数（trackButtonClick, trackFormSubmit, trackFileUpload, など）

## テストの書き方

### 基本的なコンポーネントテスト

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('正しくレンダリングされる', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### ユーザーインタラクションのテスト

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyButton from '../MyButton'

describe('MyButton', () => {
  it('クリックイベントが発火する', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<MyButton onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 非同期処理のテスト

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import AsyncComponent from '../AsyncComponent'

describe('AsyncComponent', () => {
  it('データを取得して表示する', async () => {
    render(<AsyncComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('Loaded Data')).toBeInTheDocument()
    })
  })
})
```

### モックの使用

```typescript
// 関数のモック
const mockFunction = jest.fn()
mockFunction.mockReturnValue('mocked value')

// モジュールのモック
jest.mock('../utils', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}))
```

## カバレッジのしきい値

プロジェクトでは以下のカバレッジしきい値を設定しています：

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

これらのしきい値を下回ると、テストが失敗します。

## ベストプラクティス

1. **テストは独立させる**: 各テストは他のテストに依存しないようにする
2. **AAA パターンを使用**: Arrange（準備）、Act（実行）、Assert（検証）
3. **わかりやすいテスト名**: テストが何を検証しているか明確にする
4. **エッジケースをテスト**: 正常系だけでなく、異常系やエッジケースもテストする
5. **モックは最小限に**: 必要な部分だけをモックする
6. **テストの可読性**: テストコードも本番コードと同様に読みやすく保つ

## トラブルシューティング

### テストが失敗する場合

1. エラーメッセージを確認
2. `console.log` でデバッグ
3. `--verbose` フラグを使用して詳細情報を表示

### モックが機能しない場合

1. モックの配置場所を確認（テストの前に配置）
2. `jest.clearAllMocks()` を `beforeEach` で呼び出す
3. モックの戻り値が正しいか確認

### カバレッジが低い場合

1. `npm run test:coverage` を実行
2. `coverage/lcov-report/index.html` を開く
3. カバーされていない行を確認
4. 必要なテストケースを追加

## 参考リンク

- [Jest公式ドキュメント](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)


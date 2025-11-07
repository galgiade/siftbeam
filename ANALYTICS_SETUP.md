# Google Analytics & Web Vitals セットアップガイド

このプロジェクトには、Google Analytics (GA4) と Web Vitals の計測機能が実装されています。

## 📊 実装済みの機能

### 1. Google Analytics (GA4)
- ページビュー自動追跡
- カスタムイベント送信
- ユーザー行動分析

### 2. Web Vitals
- Core Web Vitals の自動計測
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)
  - INP (Interaction to Next Paint)

### 3. パフォーマンスモニタリング
- ページ遷移の自動追跡
- リアルタイムパフォーマンス監視

## 🚀 セットアップ手順

### ステップ1: Google Analytics (GA4) プロパティの作成

1. [Google Analytics](https://analytics.google.com/) にアクセス
2. 「管理」→「プロパティを作成」
3. プロパティ名を入力（例: siftbeam）
4. 「データストリーム」→「ストリームを追加」→「ウェブ」
5. ウェブサイトのURLを入力
6. **測定ID（G-XXXXXXXXXX）をコピー**

### ステップ2: 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成（または既存のファイルに追加）:

```bash
# Google Analytics (GA4)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # ← ここに測定IDを貼り付け
```

### ステップ3: アプリケーションの起動

```bash
npm run dev
# または
yarn dev
```

### ステップ4: 動作確認

1. ブラウザで `http://localhost:3000` を開く
2. ブラウザの開発者ツール（F12）を開く
3. **Console タブ**で「Web Vitals:」のログを確認
4. **Network タブ**で `google-analytics.com` へのリクエストを確認

## 📈 カスタムイベントの使い方

アプリケーション内でカスタムイベントを送信する場合:

```typescript
import { trackButtonClick, trackFormSubmit, trackFileUpload } from '@/app/lib/utils/analytics'

// ボタンクリックの追跡
trackButtonClick('signup_button', 'homepage')

// フォーム送信の追跡
trackFormSubmit('contact_form', true)

// ファイルアップロードの追跡
trackFileUpload('pdf', 1024000) // ファイルサイズ(bytes)
```

### 利用可能なイベント関数

| 関数 | 用途 | 例 |
|------|------|-----|
| `trackButtonClick(name, location?)` | ボタンクリック | `trackButtonClick('cta', 'header')` |
| `trackFormSubmit(name, success)` | フォーム送信 | `trackFormSubmit('signup', true)` |
| `trackFileUpload(type, size)` | ファイルアップロード | `trackFileUpload('csv', 500000)` |
| `trackSignUp(method)` | サインアップ | `trackSignUp('email')` |
| `trackSignIn(method)` | サインイン | `trackSignIn('google')` |
| `trackError(message, location)` | エラー | `trackError('API Error', 'checkout')` |
| `trackSearch(term)` | 検索 | `trackSearch('data processing')` |
| `trackTimeOnPage(page, seconds)` | 滞在時間 | `trackTimeOnPage('pricing', 120)` |

## 🔍 Google Analytics でのデータ確認

### リアルタイムデータ
1. Google Analytics ダッシュボード
2. 「レポート」→「リアルタイム」
3. 現在のアクティブユーザーとページビューを確認

### Web Vitals データ
1. 「レポート」→「エンゲージメント」→「イベント」
2. イベント名で「Web Vitals」を検索
3. LCP、FID、CLSなどのメトリクスを確認

### カスタムイベント
1. 「レポート」→「エンゲージメント」→「イベント」
2. 送信したイベント名（例: `click`, `submit_success`）を確認

## 🎯 Web Vitals の目標値

良好なユーザー体験のための推奨値:

| メトリクス | 良好 | 改善が必要 | 不良 |
|-----------|------|-----------|------|
| **LCP** | ≤ 2.5秒 | 2.5〜4.0秒 | > 4.0秒 |
| **FID** | ≤ 100ms | 100〜300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1〜0.25 | > 0.25 |
| **FCP** | ≤ 1.8秒 | 1.8〜3.0秒 | > 3.0秒 |
| **TTFB** | ≤ 800ms | 800〜1800ms | > 1800ms |

## 🔧 トラブルシューティング

### データが送信されない場合

1. **環境変数の確認**
   ```bash
   # .env.local ファイルを確認
   cat .env.local | grep GA_MEASUREMENT_ID
   ```

2. **ブラウザのコンソールを確認**
   - エラーメッセージがないか確認
   - 開発環境では Web Vitals のログが表示される

3. **広告ブロッカーを無効化**
   - 広告ブロッカーが Google Analytics をブロックしている可能性

4. **測定IDの形式を確認**
   - 正しい形式: `G-XXXXXXXXXX`
   - 古い形式（UA-XXXXXXX）は使用不可

### 本番環境でのみ有効にする場合

`app/_components/common/GoogleAnalytics.tsx` を編集:

```typescript
export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  // 本番環境でのみ有効化
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') {
    return null
  }
  // ... 残りのコード
}
```

## 📚 参考リンク

- [Google Analytics 4 公式ドキュメント](https://support.google.com/analytics/answer/10089681)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/vitals/#core-web-vitals)

## 💡 ヒント

- 開発環境では、ブラウザのコンソールで Web Vitals のログを確認できます
- 本番環境では、Google Analytics のリアルタイムレポートで即座に確認できます
- カスタムイベントを活用して、ユーザーの行動を詳細に追跡しましょう


---
title: siftbeam コード規約
description: Next.js 15 / React 19 / TypeScript / Tailwind v4 / HeroUI / AWS SDK v3 / Stripe / Zod を前提とした実務的なガイドライン
---

# siftbeam コード規約

このドキュメントは、siftbeam リポジトリで統一された品質・可読性・安全性を実現するためのコード規約です。現行スタック（Next.js 15 App Router、React 19、TypeScript strict、Tailwind v4、HeroUI、AWS SDK v3、Stripe、Zod）に準拠します。

## 1. 目的とスコープ

- 本規約は、アプリケーションコード（`app/**`、`lib/**`、`utils/**` など）およびスタイル（Tailwind、HeroUI）に適用します。
- インフラや CI 設定は対象外ですが、関連するセキュリティ・運用上の注意点は付記します。

## 2. 技術スタックと前提

- Next.js: 15.x（App Router）
- React: 19.x
- TypeScript: strict モード（`tsconfig.json` に準拠）
- CSS: Tailwind CSS v4（`darkMode: "class"`、HeroUI プラグイン）
- UI: HeroUI（`@heroui/react`）
- i18n: ルートベース（`/[locale]/...`）+ `getPreferredLocale`
- バリデーション: Zod
- 外部サービス: AWS SDK v3（Cognito / DynamoDB / S3 / SES）、Stripe

参考:
- Tailwind 設定: `tailwind.config.ts`（`plugins: [heroui()]`）
- AWS クライアントの集約: `app/lib/aws-clients.ts`
- ルート/メタ: `app/layout.tsx`、ルート判定: `app/page.tsx`

## 3. ディレクトリ構成と責務境界

- `app/[locale]/**`: ロケール別のページ/レイアウト。言語依存の UI を配置。
- `app/_components/**`: 再利用可能な表示コンポーネント（副作用なし、状態最小）。
- `app/_containers/**`: 画面単位のコンテナ（データ取得/状態管理/ハンドラ）。
- `app/lib/actions/**`: Server Actions とサーバ側ユースケース（外部 API/AWS/DB の入出力、検証、権限確認）。
- `app/lib/auth/**`: 認証/認可（Cognito 連携など）。
- `app/lib/utils/**`・`app/utils/**`: 共有ユーティリティ。
- `app/dictionaries/**`: 各言語の辞書（キー構造を安定維持）。
- `app/providers.tsx`: グローバル Provider（HeroUI、ロケール）。
- `app/lib/aws-clients.ts`: AWS SDK v3 クライアントの単一化（インスタンス共有）。

原則:
- 表示（Presentational）とロジック（Container/Action）を分離する。
- コンポーネント内で外部クライアント（AWS/Stripe）を new しない。共有レイヤから Import。

## 4. TypeScript 規約

- `strict: true`を遵守。`any`/`unknown` は最小限。無根拠な型アサーション禁止。
- 型は「データ形状」を `type`、クラス的振る舞い/拡張が必要なら `interface`。
- 判別可能共用体（discriminated union）を積極活用し、分岐の網羅性を型で担保。
- 返り値・外部公開 API には明示的な型注釈。推論可能なローカルは冗長注釈を避ける。
- 非同期関数は `Promise<型>` を明示し、例外の可能性をドキュメント化。
- `@/*` エイリアスを用いて相対パスのネストを回避。
- 列挙はリテラル Union + `as const` を優先。必要時のみ `enum`。

命名:
- コンポーネント: PascalCase（例: `UserProfileCard`）
- 変数/関数: camelCase（例: `fetchUserProfile`）
- 定数: SCREAMING_SNAKE_CASE（例: `MAX_UPLOAD_SIZE_MB`）
- ファイル: 概念に忠実な英単語、コンポーネントは `*.tsx`、関数群は `*-actions.ts` 等で役割明示

## 5. React / Next.js 規約

Server / Client:
- Client コンポーネントはファイル先頭に厳密に1行 `"use client"` を記述。
- `headers()`/`redirect()` など Server 専用 API は Server ファイルのみで使用。
- Server Actions で副作用（DB/外部 API）・検証を実施し、Client は UI と入力のみ担う。

ルーティング/メタデータ:
- ルートは App Router 構造に従う。メタは `layout.tsx` の `metadata` で定義/継承。
- ルート直下でのリダイレクトは `redirect()` を使用し、条件は最小化。

i18n:
- 受理言語は `headers()` → `getPreferredLocale()` で決定し `/<locale>` に誘導。
- 静的テキストは辞書から取得。UI 内にハードコードしない。
- 追加言語は `dictionaries/**` にキーを追加し、既存キーを破壊的変更しない。

例（Server 専用 API の使用）:
```tsx
// app/page.tsx（抜粋）
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPreferredLocale } from '@/app/utils/locale-utils'

export default async function RootPage() {
  const h = await headers()
  const locale = getPreferredLocale(h.get('accept-language') ?? '')
  redirect(`/${locale}`)
}
```

## 6. スタイリング規約（Tailwind / HeroUI）

- UI は HeroUI を優先し、足りない箇所を Tailwind ユーティリティで補完。
- ダークモードは `class` 切替。`<html class="dark">` またはテーマトグルで制御。
- `globals.css` 以外に CSS を増やさない（コンポーネント内はユーティリティで完結）。
- レイアウト間隔は 4 の倍数（4, 8, 12, 16, ...）を基準に統一。
- 状態/サイズ/バリアントは HeroUI の props を優先し、任意の class は最小限。

例（Provider でロケールを渡す）:
```tsx
'use client'
import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider locale={'ja-JP'}>{children}</HeroUIProvider>
}
```

## 7. バリデーション/フォーム（Zod）

- スキーマは Zod で定義し、型は `z.infer<typeof Schema>` で一元化。
- フロントで事前検証しても、Server Actions で必ず再検証（信頼境界を越えるため）。
- 外部入力（クエリ/ヘッダ/ボディ/ファイル）はすべてスキーマで正規化。

```ts
import { z } from 'zod'

export const CreateTicketSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(['low','medium','high'])
})

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>
```

## 8. サーバ処理/外部サービス（AWS SDK v3 / Stripe）

- AWS クライアントは `app/lib/aws-clients.ts` で生成し、使い回す（コールドスタート抑制）。
- コンポーネント内 `new S3Client(...)` のような直接生成は禁止。
- Stripe の秘密操作（Price/Subscription 作成など）は Server 側のみ。Client は Elements 等の表示に限定。
- 環境変数は Server 専用のみで資格情報を扱う。Client に露出するのは `NEXT_PUBLIC_` 接頭辞のみ。

例（共有クライアント）:
```ts
// app/lib/aws-clients.ts（抜粋）
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient)
```

## 9. エラーハンドリング/ロギング

- 予期可能な失敗は型で表現し、業務例外は `throw` ではなく戻り値で返すことを検討。
- 例外は境界で捕捉（Action/Route）。UI 層では例外を投げない。
- ログは構造化（JSON）。機密情報（トークン/アクセスキー/PII）は記録禁止。
- `console.log` の常用禁止。本番想定ログ関数を用意し、開発時のみ出力。

## 10. パフォーマンス/アクセシビリティ

- 不要な Client 化を避け、Server Components をデフォルトにする。
- 大型ライブラリは必要箇所のみ `dynamic()` で遅延読込。
- 画像/アイコンは最適化（`next/image`、SVG スプライト）。
- メモ化（`useMemo`/`useCallback`）は計測に基づいて限定的に使用。
- HeroUI/フォーム要素には適切なラベルと `aria-*` を付与。

## 11. インポート順序/コードフォーマット

順序:
1. Node 組み込み（`fs`, `path` など）
2. 外部パッケージ（`react`, `next`, `@aws-sdk/*`, `@heroui/*` など）
3. 内部モジュール（`@/*`）

その他:
- 名前付きインポートを優先し、デフォルトは必要時のみ。
- 1 ファイル 1 概念。肥大化した場合は関数抽出/分割。
- 自動整形（Prettier 互換）はチーム標準に合わせる。行の長さは可読性優先。

ESLint（Next.js 準拠）:
- Next.js 組み込みの ESLint を使用し、初期セットアップ時は Strict を選択。
- `package.json` に `lint` スクリプトを追加する。

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

- `npm run lint` を実行して初期設定（Strict/Base）を選択。Strict を推奨。
- ESLint は `next build` 実行時にも自動実行される。エラーはビルドを失敗、警告は許容。
- ルール変更が必要な場合は `.eslintrc.json` にて最小限に留める（例外は理由をPRで明記）。

## 12. セキュリティ/シークレット管理

- シークレットは環境変数のみで管理し、リポジトリへコミットしない。
- `NEXT_PUBLIC_` でない変数は Client に渡さない（`metadataBase` 等の露出に注意）。
- 入力検証（Zod）・エンコーディング・エスケープで XSS/インジェクションを防止。
- S3 署名 URL の権限/期限は最小限に。DynamoDB はパーティションキー設計をレビュー。
- 追加事項は `docs/AWS_PERMISSIONS.md` と `docs/VERIFICATION_CODES_PERMISSIONS.md` を参照。

## 13. コミットメッセージ/レビュー

- Conventional Commits を推奨: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:` など。
- 1 PR = 1 目的。大規模変更は分割。説明に動機/影響/検証方法を含める。
- 追加・変更には最低 1 つ以上のスナップショット/スクリーンショット（UI の場合）。
- 変更により必要な辞書キーの追加/更新を明記し、影響言語を特定。

## 14. 例とアンチパターン

良い例（Server 専用 API を Server で使用）:
```tsx
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const h = await headers()
  const locale = 'ja' // 実際はユーティリティで解決
  redirect(`/${locale}`)
}
```

悪い例（Client から資格情報に触れる）:
```tsx
'use client'
// NG: Server 専用の資格情報/クライアントへ直接アクセス
// import { s3Client } from '@/app/lib/aws-clients' // ← Client では使用しない
```

良い例（AWS クライアントの共有）:
```ts
// app/lib/aws-clients.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient)
```

## 付録

- 環境変数の一覧・運用: `docs/ENV_VARIABLES_CHECKLIST.md`
- IAM/最小権限: `docs/AWS_PERMISSIONS.md`
- 検証コード周りの権限: `docs/VERIFICATION_CODES_PERMISSIONS.md`

---

改訂履歴:
- v1.0: 初版（Next.js 15 / React 19 / TS strict / Tailwind v4 / HeroUI / AWS SDK v3 / Stripe / Zod）



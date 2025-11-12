# LLMO対策ドキュメント (AI検索最適化)

## 📋 目次
- [概要](#概要)
- [実装済みの対策](#実装済みの対策)
- [今後の対策](#今後の対策)
- [効果測定方法](#効果測定方法)
- [メンテナンス](#メンテナンス)

---

## 概要

### LLMOとは?
**LLMO (Large Language Model Optimization)** = AI検索最適化

ChatGPT、Perplexity、Claude、Geminiなどの生成AIが回答を生成する際に、**自社のコンテンツを引用・参照してもらうための最適化戦略**です。

### 従来のSEOとの違い

| 項目 | SEO | LLMO |
|------|-----|------|
| **目的** | Google検索で上位表示 | AIの回答に引用される |
| **対象** | 検索エンジンアルゴリズム | LLM(大規模言語モデル) |
| **ユーザー行動** | 検索結果をクリック | AIが直接回答を生成 |
| **トラフィック** | サイトへの直接流入 | 引用元として認知 |

---

## 実装済みの対策

### ✅ 1. llms.txt の作成
**ファイル**: `public/llms.txt`

**内容**:
- サービス概要
- 主要機能
- 技術スタック
- ユースケース
- 料金体系
- ドキュメントリンク
- セキュリティ情報
- 競合優位性

**目的**: AIが効率的にサービス情報を取得できるようにする

**更新頻度**: 月1回、または大きな変更があった時

---

### ✅ 2. robots.txt の最適化
**ファイル**: `public/robots.txt`

**許可しているAIクローラー**:
- `GPTBot` (OpenAI/ChatGPT)
- `ChatGPT-User` (ChatGPT)
- `CCBot` (Common Crawl)
- `anthropic-ai` (Claude)
- `Claude-Web` (Claude)
- `PerplexityBot` (Perplexity AI)
- `Applebot` (Apple Intelligence)
- `Bingbot` (Microsoft Copilot)
- `Googlebot` (Google Gemini)

**除外設定**:
- 認証ページ (`/*/signin`, `/*/signup`, etc.)
- APIエンドポイント (`/api/`)

---

### ✅ 3. 構造化データ (Schema.org)
**実装場所**: `app/_components/common/StructuredData.tsx`

**実装済みのスキーマ**:
- `SoftwareApplication` (サービス概要)
- `Organization` (会社情報)
- `Product` (料金ページ)
- `HowTo` (フローページ)
- `BreadcrumbList` (ナビゲーション)
- `FAQPage` (サポートページ - 予定)

---

### ✅ 4. メタデータ最適化
**実装場所**: `app/lib/seo-helpers.ts`

**最適化項目**:
- タイトルタグ
- ディスクリプション
- キーワード
- OGPタグ
- Twitter Card
- hreflang (多言語対応)

---

### ✅ 5. サイトマップ
**実装場所**: `app/sitemap.ts`

**含まれるページ**:
- 全言語のホームページ
- 料金ページ
- フローページ
- 利用規約/プライバシーポリシー
- お知らせページ

---

## 今後の対策

### 🔜 Phase 1: コンテンツの強化 (優先度: 高)

#### 1. FAQページの作成/強化
**目的**: AIが質問形式のコンテンツを引用しやすくする

**実装場所**: `app/[locale]/faq/page.tsx` (新規作成)

**内容例**:
```markdown
## よくある質問

### Q: siftbeamはどのようなデータ形式に対応していますか?
A: CSV、JSON、XML、Excel、PDFなど、主要なデータ形式に対応しています。

### Q: データ処理のカスタマイズはどこまで可能ですか?
A: 顧客ごとに完全にカスタマイズ可能です。AWS Step Functionsを使用し、
   複雑なデータ処理ワークフローを構築できます。

### Q: セキュリティ対策は?
A: AWS S3の暗号化、Cognito認証、IAMによる厳格なアクセス制御を実装しています。
```

**構造化データ**: `FAQPage` スキーマを追加

---

#### 2. HowToコンテンツの強化
**目的**: ステップバイステップガイドをAIが理解しやすくする

**実装場所**: `app/[locale]/flow/page.tsx` (既存ページの強化)

**改善点**:
- より詳細な手順説明
- 各ステップの画像追加
- コード例の追加
- トラブルシューティングセクション

**構造化データ**: `HowTo` スキーマを強化

---

#### 3. ブログ/技術記事の作成
**目的**: 専門性と権威性を高める

**実装場所**: `app/[locale]/blog/` (新規作成)

**記事例**:
- 「AWS Step Functionsでデータ処理を自動化する方法」
- 「企業向けデータ処理のベストプラクティス」
- 「セキュアなファイル処理の実装方法」
- 「JSONataを使った高度なデータ変換」

**頻度**: 月2-4記事

---

### 🔜 Phase 2: 権威性の強化 (優先度: 中)

#### 4. ケーススタディの作成
**目的**: 実績を示し、信頼性を高める

**実装場所**: `app/[locale]/case-studies/` (新規作成)

**内容**:
- 導入企業名 (許可が得られた場合)
- 課題
- 解決策
- 成果 (具体的な数値)

---

#### 5. 比較コンテンツ
**目的**: 競合との差別化を明確にする

**実装場所**: `app/[locale]/comparison/` (新規作成)

**内容例**:
- 「siftbeam vs 従来のデータ処理方法」
- 「クラウドデータ処理サービスの選び方」
- 「AWS Step Functions vs その他のワークフローエンジン」

---

#### 6. 技術ドキュメント
**目的**: 開発者向けの詳細情報を提供

**実装場所**: `app/[locale]/docs/` (新規作成)

**内容**:
- API仕様書
- 統合ガイド
- SDK/ライブラリ
- トラブルシューティング

---

### 🔜 Phase 3: コンテンツの拡充 (優先度: 低)

#### 7. 動画コンテンツ
- YouTubeチャンネルの開設
- チュートリアル動画
- ウェビナー

#### 8. ポッドキャスト/インタビュー
- 業界ポッドキャストへの出演
- 技術カンファレンスでの発表

---

## 効果測定方法

### 1. AIツールでの直接確認 (週1回)

#### ChatGPT
```
プロンプト:
- "企業向けデータ処理サービスを教えて"
- "AWS based data processing service"
- "カスタマイズ可能なデータ処理ツール"
```

#### Perplexity
```
プロンプト:
- "Best enterprise data processing services"
- "AWS Step Functions data processing"
```

#### Claude
```
プロンプト:
- "データ処理サービスの比較"
- "クラウドベースのETLツール"
```

#### Gemini
```
プロンプト:
- "企業向けデータ変換サービス"
- "Serverless data processing platforms"
```

---

### 2. Google Analytics (月1回)

#### リファラー分析
以下のリファラーからの流入を確認:
- `chat.openai.com`
- `perplexity.ai`
- `claude.ai`
- `gemini.google.com`

#### 設定方法
```javascript
// Google Analytics 4
// カスタムディメンション: AI Referrer
if (document.referrer.includes('chat.openai.com') ||
    document.referrer.includes('perplexity.ai') ||
    document.referrer.includes('claude.ai')) {
  gtag('event', 'ai_referral', {
    'source': document.referrer
  });
}
```

---

### 3. ブランド言及の追跡 (月1回)

#### ツール
- Google Alerts: "siftbeam"
- Mention.com
- Brand24

#### 確認項目
- AIの回答に「siftbeam」が出現する頻度
- 引用されているコンテンツの種類
- 競合との比較での言及

---

### 4. 検索ボリューム (四半期ごと)

#### Google Trends
- 「siftbeam」の検索トレンド
- 関連キーワードの動向

#### Google Search Console
- ブランド名での検索インプレッション
- クリック率の変化

---

## メンテナンス

### 月次タスク

#### llms.txt の更新
- [ ] サービス情報の更新
- [ ] 新機能の追加
- [ ] ドキュメントリンクの確認
- [ ] 統計情報の更新 (導入企業数、処理件数など)

#### AIツールでの確認
- [ ] ChatGPT: 3つのプロンプトでテスト
- [ ] Perplexity: 2つのプロンプトでテスト
- [ ] Claude: 2つのプロンプトでテスト
- [ ] Gemini: 2つのプロンプトでテスト

#### 分析
- [ ] Google Analyticsでリファラー確認
- [ ] ブランド言及の追跡
- [ ] 改善点の洗い出し

---

### 四半期タスク

#### コンテンツ監査
- [ ] 全ページの情報が最新か確認
- [ ] 構造化データのエラーチェック
- [ ] リンク切れの確認
- [ ] 画像の最適化状況確認

#### 競合分析
- [ ] 競合のLLMO対策を調査
- [ ] 新しいAI検索サービスの確認
- [ ] 業界トレンドの把握

#### 戦略見直し
- [ ] 効果測定結果のレビュー
- [ ] 次四半期の施策計画
- [ ] 予算配分の見直し

---

### 年次タスク

#### 大規模アップデート
- [ ] llms.txt の全面見直し
- [ ] 構造化データの最新仕様への対応
- [ ] 新しいAIクローラーへの対応
- [ ] コンテンツ戦略の見直し

#### ROI分析
- [ ] LLMO対策の費用対効果
- [ ] AIからの流入による売上貢献
- [ ] ブランド認知度の向上効果

---

## チェックリスト

### ✅ 完了済み
- [x] llms.txt の作成
- [x] robots.txt の最適化
- [x] 構造化データの実装
- [x] メタデータの最適化
- [x] サイトマップの設定

### 🔜 実装予定 (Phase 1)
- [ ] FAQページの作成
- [ ] HowToコンテンツの強化
- [ ] ブログセクションの作成
- [ ] 最初の技術記事を3本公開

### 🔜 実装予定 (Phase 2)
- [ ] ケーススタディの作成
- [ ] 比較コンテンツの作成
- [ ] 技術ドキュメントの整備

### 🔜 実装予定 (Phase 3)
- [ ] 動画コンテンツの制作
- [ ] ポッドキャスト出演

---

## 参考リンク

### 公式ドキュメント
- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
- [Anthropic Claude Web Crawler](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity Bot](https://docs.perplexity.ai/docs/perplexitybot)

### 参考記事
- [LLMO対策とは？生成AI時代のSEO新戦略](https://seo-best.jp/topics/web/aio/llmo/)
- [ChatGPT検索最適化の方法](https://digitalidentity.co.jp/blog/generative-ai/about-llmo.html)

---

**最終更新**: 2025-01-12
**バージョン**: 1.0
**担当者**: 開発チーム


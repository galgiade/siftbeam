# Siftbeam ドキュメント

このディレクトリには、Siftbeamプロジェクトの技術ドキュメントが含まれています。

## 📚 主要ドキュメント

### **Step Functions関連**

1. **[JSONATA_STEPFUNCTIONS_GUIDE.md](./JSONATA_STEPFUNCTIONS_GUIDE.md)** ⭐ 最重要
   - JSONataの正しい使い方
   - `$states.input`の使用方法
   - DynamoDB List型の変換方法

2. **[PARENT_STEPFUNCTION_DESIGN.md](./PARENT_STEPFUNCTION_DESIGN.md)**
   - 親Step Functionの設計
   - 子Step Functionの起動方法
   - Stripe課金連携

3. **[CHILD_STEPFUNCTION_IMPLEMENTATION_GUIDE.md](./CHILD_STEPFUNCTION_IMPLEMENTATION_GUIDE.md)**
   - 子Step Functionの実装ガイド
   - 複数ファイル処理のループ
   - Void対応パターン

4. **[CHILD_STEPFUNCTION_TEST_SETUP.md](./CHILD_STEPFUNCTION_TEST_SETUP.md)**
   - 子Step Functionのテスト方法

### **IAM権限関連**

5. **[STEPFUNCTION_IAM_POLICY_SETUP.md](./STEPFUNCTION_IAM_POLICY_SETUP.md)**
   - 親Step FunctionのIAM権限設定

6. **[STEPFUNCTION_CHILD_IAM_POLICY_SETUP.md](./STEPFUNCTION_CHILD_IAM_POLICY_SETUP.md)**
   - 子Step FunctionのIAM権限設定

7. **[IAM_POLICY_SETUP_GUIDE.md](./IAM_POLICY_SETUP_GUIDE.md)**
   - Lambda関数のIAM権限設定

### **Stripe課金関連**

8. **[STRIPE_METER_SETUP_GUIDE.md](./STRIPE_METER_SETUP_GUIDE.md)** ⭐ 最重要
   - Stripe Billing Metersのセットアップ手順
   - 完全なステップバイステップガイド

9. **[STRIPE_METER_INTEGRATION_GUIDE.md](./STRIPE_METER_INTEGRATION_GUIDE.md)**
   - Stripe Meters APIの技術仕様

10. **[STRIPE_API_VERSION_UPDATE.md](./STRIPE_API_VERSION_UPDATE.md)**
    - 最新のStripe APIバージョン情報

### **Lambda関連**

11. **[LAMBDA_DEPLOYMENT_GUIDE.md](./LAMBDA_DEPLOYMENT_GUIDE.md)**
    - Lambda関数のデプロイ方法

12. **[S3_TRIGGER_COMPARISON.md](./S3_TRIGGER_COMPARISON.md)**
    - S3イベント通知の方法比較

### **データベース関連**

13. **[POLICY_STEPFUNCTION_MAPPING_TABLE_DESIGN.md](./POLICY_STEPFUNCTION_MAPPING_TABLE_DESIGN.md)**
    - ポリシーマッピングテーブルの設計

14. **[DYNAMODB_DATA_USAGE_TABLE.md](./DYNAMODB_DATA_USAGE_TABLE.md)**
    - データ使用量テーブルの設計

### **アーキテクチャ関連**

15. **[DATA_PROCESSING_ARCHITECTURE_REFINED.md](./DATA_PROCESSING_ARCHITECTURE_REFINED.md)**
    - データ処理アーキテクチャの全体像

16. **[S3_CUSTOMER_ID_PATH_REVIEW.md](./S3_CUSTOMER_ID_PATH_REVIEW.md)**
    - S3パス構造の設計

17. **[SERVICE_FILE_UPLOAD_ARCHITECTURE.md](./SERVICE_FILE_UPLOAD_ARCHITECTURE.md)**
    - サービスファイルアップロードの仕組み

18. **[SUPPORT_FILE_PATH_STRUCTURE.md](./SUPPORT_FILE_PATH_STRUCTURE.md)**
    - サポートファイルパス構造

19. **[TIMESTAMP_REMOVAL_SUMMARY.md](./TIMESTAMP_REMOVAL_SUMMARY.md)**
    - タイムスタンプ削除の変更まとめ

### **その他**

20. **[ENV_VARIABLES_CHECKLIST.md](./ENV_VARIABLES_CHECKLIST.md)**
    - 環境変数のチェックリスト

21. **[VERIFICATION_CODES_PERMISSIONS.md](./VERIFICATION_CODES_PERMISSIONS.md)**
    - 認証コードテーブルの権限設定

22. **[AWS_PERMISSIONS.md](./AWS_PERMISSIONS.md)**
    - AWS権限の概要

23. **[coding-guidelines.md](./coding-guidelines.md)**
    - コーディングガイドライン

---

## 🚀 クイックスタート

### **新しい子Step Functionを作成する場合**

1. **[JSONATA_STEPFUNCTIONS_GUIDE.md](./JSONATA_STEPFUNCTIONS_GUIDE.md)** を読む
2. **[CHILD_STEPFUNCTION_IMPLEMENTATION_GUIDE.md](./CHILD_STEPFUNCTION_IMPLEMENTATION_GUIDE.md)** のテンプレートを使う
3. **[STEPFUNCTION_CHILD_IAM_POLICY_SETUP.md](./STEPFUNCTION_CHILD_IAM_POLICY_SETUP.md)** でIAM権限を設定

### **Stripe課金を設定する場合**

1. **[STRIPE_METER_SETUP_GUIDE.md](./STRIPE_METER_SETUP_GUIDE.md)** の手順に従う

### **Lambda関数をデプロイする場合**

1. **[LAMBDA_DEPLOYMENT_GUIDE.md](./LAMBDA_DEPLOYMENT_GUIDE.md)** を参照

---

## 📁 JSONファイル

- **[stepfunction-orchestrator-iam-policy.json](./stepfunction-orchestrator-iam-policy.json)**: 親Step FunctionのIAMポリシー
- **[stepfunction-child-iam-policy.json](./stepfunction-child-iam-policy.json)**: 子Step FunctionのIAMポリシー
- **[iam-policy-fixed.json](./iam-policy-fixed.json)**: 修正されたIAMポリシー

---

## ⚠️ 注意事項

### **重複ドキュメントは削除しました**

以下のドキュメントは削除され、最新版に統合されています:
- ❌ `CHILD_STEPFUNCTION_DESIGN_PHILOSOPHY.md` → `CHILD_STEPFUNCTION_IMPLEMENTATION_GUIDE.md`に統合
- ❌ `DYNAMODB_LIST_TYPE_SUMMARY.md` → `JSONATA_STEPFUNCTIONS_GUIDE.md`に統合
- ❌ `DYNAMODB_LIST_UPDATE_EXAMPLE.md` → `JSONATA_STEPFUNCTIONS_GUIDE.md`に統合
- ❌ `PARENT_STEPFUNCTION_ARCHITECTURE.md` → `PARENT_STEPFUNCTION_DESIGN.md`が最新
- ❌ `DATA_PROCESSING_ARCHITECTURE_REVIEW.md` → `DATA_PROCESSING_ARCHITECTURE_REFINED.md`が最新

---

## 📝 更新履歴

| 日付 | 変更内容 |
|------|---------|
| 2025-10-16 | 重複ドキュメントを削除、README作成 |
| 2025-10-16 | JSONATA_STEPFUNCTIONS_GUIDE追加 |
| 2025-10-16 | Stripe Meter統合ドキュメント追加 |

---

**質問や追加が必要な場合は、このREADMEを更新してください。**


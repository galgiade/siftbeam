# S3ライフサイクルポリシー設定ガイド

## 概要

このガイドでは、SiftBeamのS3バケットに対してライフサイクルポリシーを設定し、コストを最適化しながらデータ保持要件を満たす方法を説明します。

---

## 📋 ポリシーの概要

### **Input Files（生データ）**

| パス | 保持期間 | ストレージクラス遷移 | 削除 |
|------|---------|-------------------|------|
| `service/input/` | 365日 | 30日→IA, 90日→Glacier IR | 365日後 |
| `support/input/` | 365日 | 30日→IA, 90日→Glacier IR | 365日後 |

### **Output Files（処理結果）**

| パス | 保持期間 | ストレージクラス遷移 | 削除 |
|------|---------|-------------------|------|
| `service/output/` | 730日（2年） | 90日→IA | 730日後 |
| `support/output/` | 730日（2年） | 90日→IA | 730日後 |

---

## 🚀 設定手順

### **方法1: AWS Management Console**

1. **S3コンソールを開く**
   ```
   https://console.aws.amazon.com/s3/
   ```

2. **バケットを選択**
   - `siftbeam` バケットをクリック

3. **Management タブを開く**
   - 「Management」タブをクリック
   - 「Create lifecycle rule」をクリック

4. **ルールを作成**
   - Rule name: `InputFilesLifecycle`
   - Choose a rule scope: **Limit the scope to specific prefixes or tags**
   - Prefix: `service/input/`

5. **Lifecycle rule actions を選択**
   - ✅ Transition current versions of objects between storage classes
   - ✅ Expire current versions of objects

6. **Transition を設定**
   - Transition 1:
     - Days after object creation: `30`
     - Storage class: `Standard-IA`
   - Transition 2:
     - Days after object creation: `90`
     - Storage class: `Glacier Instant Retrieval`

7. **Expiration を設定**
   - Days after object creation: `365`

8. **同様に他のルールも作成**
   - `SupportInputFilesLifecycle` (support/input/)
   - `OutputFilesLifecycle` (service/output/)
   - `SupportOutputFilesLifecycle` (support/output/)

---

### **方法2: AWS CLI（推奨）**

#### **1. ポリシーファイルを準備**

`S3_LIFECYCLE_POLICY.json` ファイルを使用します。

#### **2. CLIコマンドを実行**

```bash
# バケット名を設定
BUCKET_NAME="siftbeam"

# ライフサイクルポリシーを適用
aws s3api put-bucket-lifecycle-configuration \
  --bucket $BUCKET_NAME \
  --lifecycle-configuration file://docs/S3_LIFECYCLE_POLICY.json \
  --region ap-northeast-1
```

#### **3. 設定を確認**

```bash
# 現在のライフサイクルポリシーを確認
aws s3api get-bucket-lifecycle-configuration \
  --bucket $BUCKET_NAME \
  --region ap-northeast-1
```

---

### **方法3: Terraform（IaC）**

```hcl
resource "aws_s3_bucket_lifecycle_configuration" "siftbeam_lifecycle" {
  bucket = "siftbeam"

  rule {
    id     = "InputFilesLifecycle"
    status = "Enabled"

    filter {
      prefix = "service/input/"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }

    expiration {
      days = 365
    }
  }

  rule {
    id     = "SupportInputFilesLifecycle"
    status = "Enabled"

    filter {
      prefix = "support/input/"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }

    expiration {
      days = 365
    }
  }

  rule {
    id     = "OutputFilesLifecycle"
    status = "Enabled"

    filter {
      prefix = "service/output/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 730
    }
  }

  rule {
    id     = "SupportOutputFilesLifecycle"
    status = "Enabled"

    filter {
      prefix = "support/output/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 730
    }
  }
}
```

---

## 💰 コスト試算

### **前提条件**
- 月間アップロード: 100GB
- 東京リージョン（ap-northeast-1）

### **ストレージコスト（1GBあたり/月）**

| ストレージクラス | 料金 |
|---------------|------|
| S3 Standard | $0.025 |
| S3 Standard-IA | $0.019 |
| S3 Glacier IR | $0.005 |

### **年間コスト比較**

| シナリオ | 年間コスト | 削減率 |
|---------|-----------|--------|
| **全てStandard（ライフサイクルなし）** | $360 | - |
| **ライフサイクルあり（推奨設定）** | $180 | **50%削減** |
| **即時削除** | $30 | 92%削減（リスク大） |

---

## ⚠️ 注意事項

### **1. 最小保存期間**

各ストレージクラスには最小保存期間があります:

- **Standard-IA**: 30日間
- **Glacier IR**: 90日間

→ 早期削除すると追加料金が発生します

### **2. 取得コスト**

- **Standard**: 無料
- **Standard-IA**: $0.01/GB
- **Glacier IR**: $0.03/GB

→ アーカイブ後の頻繁なアクセスはコスト増

### **3. 最小オブジェクトサイズ**

- **Standard-IA**: 128KB未満のオブジェクトは128KBとして課金
- **Glacier IR**: 128KB未満のオブジェクトは128KBとして課金

→ 小さいファイルが多い場合は注意

---

## 🔍 モニタリング

### **CloudWatch Metrics**

```bash
# ストレージクラス別の使用量を確認
aws cloudwatch get-metric-statistics \
  --namespace AWS/S3 \
  --metric-name BucketSizeBytes \
  --dimensions Name=BucketName,Value=siftbeam Name=StorageType,Value=StandardStorage \
  --start-time 2025-10-01T00:00:00Z \
  --end-time 2025-10-18T00:00:00Z \
  --period 86400 \
  --statistics Average \
  --region ap-northeast-1
```

### **S3 Storage Lens**

1. S3コンソール → Storage Lens
2. ダッシュボードで以下を確認:
   - ストレージクラス別の使用量
   - ライフサイクルルールの適用状況
   - コスト最適化の機会

---

## 📊 DynamoDBへの記録（オプション）

ファイル削除時にDynamoDBに記録を残す場合:

### **処理履歴テーブルに削除日を記録**

```json
{
  "UpdateExpression": "SET inputFilesDeletedAt = :deletedAt, inputFilesStatus = :status",
  "ExpressionAttributeValues": {
    ":deletedAt": { "S": "2025-10-18T10:00:00Z" },
    ":status": { "S": "archived" }
  }
}
```

---

## 🎯 推奨アクション

### **即座に実施**
1. ✅ `S3_LIFECYCLE_POLICY.json` を確認
2. ✅ AWS CLIまたはConsoleでポリシーを適用
3. ✅ CloudWatch Metricsでモニタリング設定

### **1週間後**
- ストレージクラスの遷移状況を確認
- コスト削減効果を確認

### **1ヶ月後**
- 顧客からの再処理要求の頻度を確認
- 必要に応じて保持期間を調整

---

## 📚 関連ドキュメント

- [AWS S3 Lifecycle Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [S3 Storage Classes](https://aws.amazon.com/s3/storage-classes/)
- [S3 Pricing](https://aws.amazon.com/s3/pricing/)

---

## 🔄 ポリシーの更新

保持期間を変更する場合:

```bash
# 既存のポリシーを削除
aws s3api delete-bucket-lifecycle \
  --bucket siftbeam \
  --region ap-northeast-1

# 新しいポリシーを適用
aws s3api put-bucket-lifecycle-configuration \
  --bucket siftbeam \
  --lifecycle-configuration file://docs/S3_LIFECYCLE_POLICY.json \
  --region ap-northeast-1
```

---

**最終更新**: 2025-10-18


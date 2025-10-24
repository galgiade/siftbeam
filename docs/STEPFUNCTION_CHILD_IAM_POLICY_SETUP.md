# 子Step Function IAM ポリシー設定ガイド

## 概要
子Step Function (例: `TestCopyStateMachine`, `stateMachine-test2`) のロールに必要なIAM権限を設定するガイドです。

## エラー内容
```
User: arn:aws:sts::002689294103:assumed-role/StepFunctions-stateMachine-test2-role-u007bhokk/... 
is not authorized to perform: s3:GetObject on resource: 
"arn:aws:s3:::siftbeam/service/input/cus_TB7TNGpqOEFcst/912c4f9d-b33a-48de-b160-35b62119a227/icon.png"
because no identity-based policy allows the s3:GetObject action
```

## 必要な権限

### 1. **S3 読み取りアクセス (Input/Temp)**
- **バケット**: `siftbeam`
- **パス**: `service/input/*`, `service/temp/*`
- **アクション**: `GetObject`, `GetObjectVersion`
- **用途**: 入力ファイルと一時ファイルの読み取り

### 2. **S3 書き込みアクセス (Output/Temp)**
- **バケット**: `siftbeam`
- **パス**: `service/output/*`, `service/temp/*`
- **アクション**: `PutObject`, `PutObjectAcl`
- **用途**: 出力ファイルと一時ファイルの書き込み

### 3. **S3 リストアクセス**
- **バケット**: `siftbeam`
- **アクション**: `ListBucket`
- **用途**: ファイル一覧の取得 (オプション)

### 4. **CloudWatch Logs**
- **アクション**: `CreateLogDelivery`, `PutResourcePolicy`, など
- **用途**: Step Functionsの実行ログを記録

### 5. **X-Ray トレーシング**
- **アクション**: `PutTraceSegments`, `PutTelemetryRecords`, など
- **用途**: 分散トレーシング (既存)

## S3 CopyObject に必要な権限

`s3:CopyObject` APIを使用するには、以下の両方が必要です:

1. **コピー元**: `s3:GetObject` 権限
2. **コピー先**: `s3:PutObject` 権限

例:
```
service/input/cus_TEST/proc-123/icon.png  →  service/output/cus_TEST/proc-123/icon.png
          ↓ GetObject                                    ↓ PutObject
```

## 設定手順

### ステップ1: IAMコンソールを開く
1. AWSマネジメントコンソールにログイン
2. **IAM** サービスに移動
3. 左メニューから **ロール** を選択

### ステップ2: 子Step Functionロールを見つける
1. ロール一覧で `StepFunctions-stateMachine-test2-role-u007bhokk` を検索
   - または `StepFunctions-TestCopyStateMachine-role-*` など
2. ロールをクリックして詳細を開く

### ステップ3: ポリシーを追加
1. **許可を追加** → **ポリシーをアタッチ** をクリック
2. **ポリシーを作成** をクリック (新しいタブが開く)

### ステップ4: JSONポリシーをコピー
`docs/stepfunction-child-iam-policy.json` の内容をコピーして貼り付け:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "XRayAccess",
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords",
        "xray:GetSamplingRules",
        "xray:GetSamplingTargets"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam/service/input/*",
        "arn:aws:s3:::siftbeam/service/temp/*"
      ]
    },
    {
      "Sid": "S3WriteAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam/service/output/*",
        "arn:aws:s3:::siftbeam/service/temp/*"
      ]
    },
    {
      "Sid": "S3ListAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": [
            "service/input/*",
            "service/output/*",
            "service/temp/*"
          ]
        }
      }
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogDelivery",
        "logs:GetLogDelivery",
        "logs:UpdateLogDelivery",
        "logs:DeleteLogDelivery",
        "logs:ListLogDeliveries",
        "logs:PutResourcePolicy",
        "logs:DescribeResourcePolicies",
        "logs:DescribeLogGroups"
      ],
      "Resource": "*"
    }
  ]
}
```

### ステップ5: ポリシーを保存
1. **次へ: タグ** をクリック (タグは任意)
2. **次へ: 確認** をクリック
3. ポリシー名: `ChildStepFunctionS3AccessPolicy`
4. **ポリシーの作成** をクリック

### ステップ6: ロールにポリシーをアタッチ
1. 元のロール画面に戻る
2. 作成したポリシー `ChildStepFunctionS3AccessPolicy` を検索
3. チェックボックスをオンにして **許可を追加** をクリック

## 既存のポリシーを更新する場合

既存のポリシーがある場合は、そのポリシーを編集してS3アクセスを追加:

```json
{
  "Sid": "S3ReadAccess",
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:GetObjectVersion"
  ],
  "Resource": [
    "arn:aws:s3:::siftbeam/service/input/*",
    "arn:aws:s3:::siftbeam/service/temp/*"
  ]
},
{
  "Sid": "S3WriteAccess",
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:PutObjectAcl"
  ],
  "Resource": [
    "arn:aws:s3:::siftbeam/service/output/*",
    "arn:aws:s3:::siftbeam/service/temp/*"
  ]
}
```

## 権限の範囲説明

### **読み取り専用 (GetObject)**
```
service/input/*   ← 入力ファイル (アップロードされたファイル)
service/temp/*    ← 一時ファイル (処理中の中間ファイル)
```

### **書き込み専用 (PutObject)**
```
service/output/*  ← 出力ファイル (処理済みファイル)
service/temp/*    ← 一時ファイル (処理中の中間ファイル)
```

この設計により:
- ✅ 入力ファイルは読み取り専用 (誤って上書きされない)
- ✅ 出力ファイルは書き込み専用 (元ファイルを保護)
- ✅ 一時ファイルは読み書き可能 (処理フローの柔軟性)

## 確認方法

### 1. ロールの権限を確認
```bash
aws iam list-attached-role-policies --role-name StepFunctions-stateMachine-test2-role-u007bhokk
```

### 2. ポリシー内容を確認
```bash
aws iam get-policy-version --policy-arn arn:aws:iam::002689294103:policy/ChildStepFunctionS3AccessPolicy --version-id v1
```

### 3. テスト実行
ファイルをアップロードして、子Step Functionsが正常に実行されることを確認。

## トラブルシューティング

### エラー: `AccessDeniedException` (s3:GetObject)
- **原因**: 読み取り権限が不足
- **解決**: `S3ReadAccess` ステートメントを追加

### エラー: `AccessDeniedException` (s3:PutObject)
- **原因**: 書き込み権限が不足
- **解決**: `S3WriteAccess` ステートメントを追加

### エラー: `NoSuchKey`
- **原因**: S3パスが間違っている
- **解決**: S3キーのパス構造を確認 (`service/input/...`)

### エラー: `InvalidParameter`
- **原因**: ポリシーのJSON構文エラー
- **解決**: JSONの構文を確認 (カンマ、括弧など)

## 複数の子Step Functionがある場合

### オプション1: 共通ポリシーを使用
すべての子Step Functionロールに同じポリシーをアタッチ。

### オプション2: 個別ポリシーを作成
子Step Functionごとに異なるS3パスやリソースへのアクセスが必要な場合。

例:
```json
{
  "Resource": [
    "arn:aws:s3:::siftbeam/service/input/policy-specific/*"
  ]
}
```

## セキュリティのベストプラクティス

1. **最小権限の原則**
   - 必要なパスのみにアクセスを制限
   - 読み取りと書き込みを明確に分離

2. **パスベースの制限**
   ```json
   "Resource": [
     "arn:aws:s3:::siftbeam/service/input/*",   // OK
     "arn:aws:s3:::siftbeam/*"                   // NG (広すぎる)
   ]
   ```

3. **条件付きアクセス**
   ```json
   "Condition": {
     "StringLike": {
       "s3:prefix": ["service/input/*"]
     }
   }
   ```

## 注意事項

1. **support/ パスへのアクセス禁止**
   - 子Step Functionは `service/*` パスのみアクセス可能
   - `support/*` パスは別の権限で管理

2. **バケット名**
   - `siftbeam` バケット専用
   - 他のバケットへのアクセスは不可

3. **リージョン・アカウントID**
   - ARNのリージョン (`ap-northeast-1`) とアカウントID (`002689294103`) を環境に合わせて変更

## 関連ドキュメント

- [AWS Step Functions IAM ポリシー](https://docs.aws.amazon.com/step-functions/latest/dg/procedure-create-iam-role.html)
- [S3 IAM ポリシー](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-policies-s3.html)
- [S3 CopyObject API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html)


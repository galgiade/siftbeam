# Step Functions IAM ポリシー設定ガイド

## 概要
親Step Function (`ServiceProcessingOrchestrator`) のロールに必要なIAM権限を設定するガイドです。

## エラー内容
```
User: arn:aws:sts::002689294103:assumed-role/StepFunctions-ServiceProcessingOrchestrator-role-axor710ls/... 
is not authorized to perform: dynamodb:GetItem on resource: 
arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-policy-stepfunction-mapping
```

## 必要な権限

### 1. **DynamoDB - Policy-StepFunction マッピングテーブル (読み取り)**
- **テーブル**: `siftbeam-policy-stepfunction-mapping`
- **アクション**: `GetItem`, `Query`
- **用途**: `policyId`から子Step FunctionのARNを取得

### 2. **DynamoDB - 処理履歴テーブル (書き込み)**
- **テーブル**: `siftbeam-processing-history`
- **アクション**: `UpdateItem`, `PutItem`
- **用途**: 処理ステータス、完了時刻、エラー情報を更新

### 3. **Step Functions - 子ステートマシンの実行**
- **リソース**: 子Step Function ARN (例: `TestCopyStateMachine`)
- **アクション**: `StartExecution`, `DescribeExecution`, `StopExecution`
- **用途**: 子Step Functionを起動・監視・停止

### 4. **CloudWatch Logs - ロギング**
- **アクション**: `CreateLogDelivery`, `PutResourcePolicy`, など
- **用途**: Step Functionsの実行ログを記録

### 5. **X-Ray - トレーシング**
- **アクション**: `PutTraceSegments`, `PutTelemetryRecords`, など
- **用途**: 分散トレーシング

## 設定手順

### ステップ1: IAMコンソールを開く
1. AWSマネジメントコンソールにログイン
2. **IAM** サービスに移動
3. 左メニューから **ロール** を選択

### ステップ2: Step Functionsロールを見つける
1. ロール一覧で `StepFunctions-ServiceProcessingOrchestrator-role-axor710ls` を検索
2. ロールをクリックして詳細を開く

### ステップ3: ポリシーを追加
1. **許可を追加** → **ポリシーをアタッチ** をクリック
2. **ポリシーを作成** をクリック (新しいタブが開く)

### ステップ4: JSONポリシーをコピー
`docs/stepfunction-orchestrator-iam-policy.json` の内容をコピーして貼り付け:

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
      "Sid": "DynamoDBReadAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-policy-stepfunction-mapping",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-policy-stepfunction-mapping/index/*"
      ]
    },
    {
      "Sid": "DynamoDBWriteAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:UpdateItem",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-processing-history",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-processing-history/index/*"
      ]
    },
    {
      "Sid": "StepFunctionsExecuteChild",
      "Effect": "Allow",
      "Action": [
        "states:StartExecution",
        "states:DescribeExecution",
        "states:StopExecution"
      ],
      "Resource": [
        "arn:aws:states:ap-northeast-1:002689294103:stateMachine:TestCopyStateMachine",
        "arn:aws:states:ap-northeast-1:002689294103:execution:TestCopyStateMachine:*"
      ]
    },
    {
      "Sid": "EventsForCallback",
      "Effect": "Allow",
      "Action": [
        "events:PutTargets",
        "events:PutRule",
        "events:DescribeRule"
      ],
      "Resource": [
        "arn:aws:events:ap-northeast-1:002689294103:rule/StepFunctionsGetEventsForStepFunctionsExecutionRule"
      ]
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
3. ポリシー名: `ServiceProcessingOrchestratorPolicy`
4. **ポリシーの作成** をクリック

### ステップ6: ロールにポリシーをアタッチ
1. 元のロール画面に戻る
2. 作成したポリシー `ServiceProcessingOrchestratorPolicy` を検索
3. チェックボックスをオンにして **許可を追加** をクリック

## 既存のポリシーを更新する場合

既存のポリシーがある場合は、そのポリシーを編集して以下を追加:

```json
{
  "Sid": "DynamoDBReadAccess",
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:Query"
  ],
  "Resource": [
    "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-policy-stepfunction-mapping",
    "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-policy-stepfunction-mapping/index/*"
  ]
}
```

## 確認方法

### 1. ロールの権限を確認
```bash
aws iam list-attached-role-policies --role-name StepFunctions-ServiceProcessingOrchestrator-role-axor710ls
```

### 2. ポリシー内容を確認
```bash
aws iam get-policy-version --policy-arn arn:aws:iam::002689294103:policy/ServiceProcessingOrchestratorPolicy --version-id v1
```

### 3. テスト実行
ファイルをアップロードして、Step Functionsが正常に実行されることを確認。

## トラブルシューティング

### エラー: `AccessDeniedException`
- **原因**: 必要なIAM権限が不足
- **解決**: 上記の手順でポリシーを追加

### エラー: `ResourceNotFoundException`
- **原因**: テーブル名やARNが間違っている
- **解決**: `siftbeam-policy-stepfunction-mapping` テーブルが存在するか確認

### エラー: `InvalidParameter`
- **原因**: ポリシーのJSON構文エラー
- **解決**: JSONの構文を確認 (カンマ、括弧など)

## 注意事項

1. **子Step Functionを追加する場合**
   - `StepFunctionsExecuteChild` の `Resource` に新しいARNを追加
   
2. **最小権限の原則**
   - 本番環境では必要最小限の権限のみを付与
   
3. **リージョン・アカウントID**
   - ARNのリージョン (`ap-northeast-1`) とアカウントID (`002689294103`) を環境に合わせて変更

## 関連ドキュメント

- [AWS Step Functions IAM ポリシー](https://docs.aws.amazon.com/step-functions/latest/dg/procedure-create-iam-role.html)
- [DynamoDB IAM ポリシー](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-examples.html)
- [IAM ポリシーのベストプラクティス](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)


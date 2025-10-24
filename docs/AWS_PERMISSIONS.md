# AWS権限設定ガイド

## 概要
このアプリケーションはDynamoDBとCognitoを使用するため、適切なIAM権限が必要です。

## 必要な権限

### DynamoDB権限
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-1:*:table/User",
                "arn:aws:dynamodb:ap-northeast-1:*:table/User/index/*"
            ]
        }
    ]
}
```

### Cognito権限
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminGetUser",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminUpdateUserAttributes",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:ListUsers"
            ],
            "Resource": [
                "arn:aws:cognito-idp:ap-northeast-1:*:userpool/*"
            ]
        }
    ]
}
```

## 環境変数

以下の環境変数を設定してください：

```bash
# DynamoDB
USER_TABLE_NAME=User

# Cognito
COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx

# AWS認証情報
REGION=ap-northeast-1
ACCESS_KEY_ID=your-access-key-id
SECRET_ACCESS_KEY=your-secret-access-key
```

## エラーの対処方法

### AccessDeniedException
```
User: arn:aws:iam::002689294103:user/siftbeam is not authorized to perform: dynamodb:GetItem
```

**解決方法:**
1. IAMユーザー `siftbeam` にDynamoDB権限を付与
2. 上記のDynamoDB権限ポリシーをアタッチ

### ResourceNotFoundException
```
Requested resource not found
```

**解決方法:**
1. DynamoDBテーブル `User` が存在することを確認
2. リージョンが正しいことを確認
3. テーブル名の環境変数 USER_TABLE_NAME を確認

### UserNotFoundException (Cognito)
```
User does not exist
```

**解決方法:**
1. Cognito User Poolが存在することを確認
2. User Pool IDが正しいことを確認
3. ユーザーがUser Poolに登録されていることを確認

## IAMポリシーの作成手順

1. AWS Management Consoleにログイン
2. IAMサービスに移動
3. 「ポリシー」→「ポリシーの作成」
4. 上記のJSON権限をコピー&ペースト
5. ポリシー名を設定（例：`SiftBeamAppPolicy`）
6. IAMユーザーまたはロールにポリシーをアタッチ

## トラブルシューティング

### 権限エラーが続く場合
1. IAMユーザーのアクセスキーが正しいか確認
2. ポリシーが正しくアタッチされているか確認
3. リソースARNが正しいか確認（アカウントID、リージョン）

### 接続エラーが発生する場合
1. ネットワーク接続を確認
2. AWSサービスのステータスを確認
3. リージョン設定を確認

## 本番環境での推奨事項

1. **最小権限の原則**: 必要最小限の権限のみを付与
2. **IAMロールの使用**: EC2やLambdaではIAMロールを使用
3. **アクセスキーの定期ローテーション**: セキュリティ向上のため
4. **CloudTrailでの監査**: API呼び出しをログに記録

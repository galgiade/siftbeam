# API Gateway タグ管理のIAM権限設定

## 概要
APIキーにタグを追加・管理するために、以下のIAM権限が必要です。

## 必要な権限

### 1. API Gateway管理権限
API Gatewayのタグは、APIキーの作成・更新時に含めることができます。
タグ専用のアクションは存在せず、標準のAPI Gateway操作権限で管理されます。

```json
{
  "Sid": "APIGatewayManagement",
  "Effect": "Allow",
  "Action": [
    "apigateway:GET",
    "apigateway:POST",
    "apigateway:PUT",
    "apigateway:PATCH",
    "apigateway:DELETE"
  ],
  "Resource": [
    "arn:aws:apigateway:ap-northeast-1::/apikeys",
    "arn:aws:apigateway:ap-northeast-1::/apikeys/*",
    "arn:aws:apigateway:ap-northeast-1::/usageplans",
    "arn:aws:apigateway:ap-northeast-1::/usageplans/*",
    "arn:aws:apigateway:ap-northeast-1::/usageplans/*/keys",
    "arn:aws:apigateway:ap-northeast-1::/usageplans/*/keys/*",
    "arn:aws:apigateway:ap-northeast-1::/tags/*"
  ]
}
```

> **重要**: 
> - API Gatewayには `TagResource`、`UntagResource`、`GetTags` のような専用のタグ管理アクションは存在しません
> - タグはAPIキーの作成・更新時に `tags` パラメータとして含めます
> - タグ付きでAPIキーを作成する場合、`/tags/*` リソースへの `apigateway:PUT` 権限が必要です

## 完全なIAMポリシー例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-*",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-*/index/*"
      ]
    },
    {
      "Sid": "CognitoAdminAccess",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:AdminUpdateUserAttributes",
        "cognito-idp:AdminConfirmSignUp",
        "cognito-idp:AdminSetUserPassword"
      ],
      "Resource": "arn:aws:cognito-idp:ap-northeast-1:002689294103:userpool/*"
    },
    {
      "Sid": "CognitoUserAccess",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:ForgotPassword",
        "cognito-idp:GlobalSignOut",
        "cognito-idp:ConfirmForgotPassword",
        "cognito-idp:RespondToAuthChallenge",
        "cognito-idp:GetUser",
        "cognito-idp:ConfirmSignUp",
        "cognito-idp:SignUp",
        "cognito-idp:InitiateAuth",
        "cognito-idp:ResendConfirmationCode"
      ],
      "Resource": "arn:aws:cognito-idp:ap-northeast-1:002689294103:userpool/*"
    },
    {
      "Sid": "SESAccess",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendTemplatedEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam",
        "arn:aws:s3:::siftbeam/*"
      ]
    },
    {
      "Sid": "APIGatewayAccess",
      "Effect": "Allow",
      "Action": [
        "apigateway:POST",
        "apigateway:DELETE",
        "apigateway:GET",
        "apigateway:PUT",
        "apigateway:PATCH"
      ],
      "Resource": [
        "arn:aws:apigateway:ap-northeast-1::/apikeys",
        "arn:aws:apigateway:ap-northeast-1::/apikeys/*",
        "arn:aws:apigateway:ap-northeast-1::/usageplans",
        "arn:aws:apigateway:ap-northeast-1::/usageplans/*",
        "arn:aws:apigateway:ap-northeast-1::/usageplans/*/keys",
        "arn:aws:apigateway:ap-northeast-1::/usageplans/*/keys/*",
        "arn:aws:apigateway:ap-northeast-1::/tags/*"
      ]
    }
  ]
}
```

## タグの使用例

### 自動付与されるタグ（すべてのAPIキー）
すべてのAPIキーには以下のタグが自動的に付与されます：

```typescript
{
  Project: 'siftbeam',           // 固定値
  customerId: 'cus_xxxxx',       // 認証ユーザーのID
  environment: 'Production',     // デフォルト値（更新可能）
  version: 'v1.0'                // デフォルト値（更新可能）
}
```

### タグの更新
- `Project`と`customerId`は固定値で変更できません
- `environment`と`version`は作成後に更新可能です

## 権限の適用方法

### AWS CLIでの適用
```bash
aws iam put-user-policy \
  --user-name siftbeam \
  --policy-name SiftbeamAPIGatewayPolicy \
  --policy-document file://policy.json
```

### AWS Consoleでの適用
1. IAM > ユーザー > siftbeam を選択
2. 「アクセス権限」タブ > 「インラインポリシーの追加」
3. JSON タブを選択
4. 上記のポリシーをペースト
5. ポリシー名を入力（例: SiftbeamAPIGatewayTagPolicy）
6. 「ポリシーの作成」をクリック

## トラブルシューティング

### 重要な注意事項

**API Gatewayのタグ制限**:
- API Gatewayでは、`TagResource`、`UntagResource`、`GetTags`のような専用のタグ管理APIは**存在しません**
- タグはAPIキーの作成時に`CreateApiKeyCommand`の`tags`パラメータで設定します
- タグの更新は`UpdateApiKeyCommand`の`patchOperations`で行います
- タグの取得は`GetApiKeyCommand`のレスポンスに含まれます

### エラー: AccessDeniedException (タグリソース)
```
User: arn:aws:iam::002689294103:user/siftbeam is not authorized to perform: apigateway:PUT on resource: arn:aws:apigateway:ap-northeast-1::/tags/arn%3Aaws%3Aapigateway%3Aap-northeast-1%3A%3A%2Fapikeys%2F*
```

**原因**: タグ付きでAPIキーを作成する際、API Gatewayが内部的に `/tags/*` リソースに対して `PUT` 操作を実行します。

**解決方法**: IAMポリシーのResourceセクションに以下を追加してください：
```json
"arn:aws:apigateway:ap-northeast-1::/tags/*"
```

### エラー: AccessDeniedException (一般)
```
User: arn:aws:iam::002689294103:user/siftbeam is not authorized to perform: apigateway:POST
```

**解決方法**: 上記のIAMポリシーに `apigateway:POST`、`apigateway:GET`、`apigateway:PUT`、`apigateway:PATCH` 権限を追加してください。

### タグが更新されない

**原因**: API Gatewayのタグ更新には制限があります。

**解決方法**: 
- DynamoDBのタグを信頼できるソースとして使用
- 必要に応じてAPIキーを再作成

## セキュリティのベストプラクティス

1. **最小権限の原則**: 必要な権限のみを付与
2. **タグによるアクセス制御**: タグを使用してリソースへのアクセスを制限
3. **監査ログの有効化**: すべてのタグ操作を監査ログに記録
4. **定期的なレビュー**: タグと権限を定期的にレビュー

## 参考リンク

- [AWS API Gateway タグ付け](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-tagging.html)
- [AWS IAM ポリシー](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- [API Gateway アクセス許可リファレンス](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html)


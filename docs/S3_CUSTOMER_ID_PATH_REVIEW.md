# S3パスにCustomerIDを含めるべきか？再検討

## 現在の設計

### 現在のS3パス構造
```
service/input/{customerId}/{processingHistoryId}/{fileName}
service/output/{customerId}/{processingHistoryId}/{fileName}
service/temp/{customerId}/{processingHistoryId}/{stepName}/{fileName}
```

**注**: タイムスタンプは削除（`processingHistoryId`で一意性保証、元のファイル名保持）

## 検討: customerIdをS3パスに含めない方がいいのでは？

### 【customerIdを含めない場合】
```
service/input/{processingHistoryId}/{timestamp}_{fileName}
service/output/{processingHistoryId}/{timestamp}_{fileName}
service/temp/{processingHistoryId}/{stepName}/{timestamp}_{fileName}
```

---

## メリット・デメリット比較

### 【customerIdを含める場合（現在の設計）】

#### メリット:
1. **企業ごとのフォルダ分離**
   - S3コンソールで企業別にファイルを確認しやすい
   - 企業単位でのバックアップ・削除が容易

2. **アクセス制御の簡略化**
   - IAMポリシーで企業ごとにアクセス制限が可能
   - 例: `service/input/customer123/*`へのアクセスのみ許可

3. **データの組織化**
   - 企業別にデータが整理される
   - 監査・コンプライアンスの観点で有利

4. **S3ライフサイクルポリシーの柔軟性**
   - 企業ごとに異なるライフサイクルルールを適用可能
   - 例: 特定の企業のファイルを90日後に削除

#### デメリット:
1. **パスが1階層深くなる**
   - 最大1024文字のS3キー制限に近づきやすい
   - URLエンコード後のパス長に注意が必要

2. **Step Functionsでの冗長性**
   - `customerId`は既にDynamoDBの`processing-history`に保存されている
   - S3パスから抽出する必要がある（ただし、軽微な処理）

3. **マルチテナント管理の複雑さ**
   - 企業数が増えるとS3のルートレベルのフォルダが増える
   - S3 Consoleでのリスト表示が遅くなる可能性（1000+企業の場合）

---

### 【customerIdを含めない場合】

#### メリット:
1. **パスがシンプル**
   - 階層が浅く、S3キーの長さを節約
   - `processingHistoryId`が一意なので、競合の心配がない

2. **Step Functionsの処理が簡素化**
   - S3パスから`processingHistoryId`を抽出するだけで処理開始可能
   - DynamoDBから`customerId`を含む全情報を取得できる

3. **スケーラビリティ**
   - 企業数が増えてもS3のルートフォルダ数は変わらない
   - S3 Consoleのパフォーマンスが安定

4. **冗長性の削減**
   - `customerId`はDynamoDBとS3メタデータに保存されているので、パスに含める必要がない
   - Single Source of Truth（DynamoDB）を維持

#### デメリット:
1. **企業別の確認が困難**
   - S3コンソールで企業別にファイルを直接確認できない
   - AWS CLIやSDKでフィルタリングが必要

2. **アクセス制御の複雑化**
   - IAMポリシーで企業ごとにアクセス制限が難しい
   - S3メタデータやタグを使った制御が必要（より複雑）

3. **企業単位での操作が困難**
   - 企業ごとのバックアップ・削除にはDynamoDBクエリが必要
   - S3パスだけでは企業を特定できない

4. **ライフサイクルポリシーの適用が困難**
   - 企業ごとに異なるライフサイクルを適用できない
   - S3オブジェクトタグを使う必要がある（追加コスト）

---

## 推奨: **customerIdをS3パスに含める（現在の設計を維持）**

### 理由

#### 1. **セキュリティとコンプライアンス**
企業データを明確に分離することで:
- **データ漏洩リスクの低減**: 企業ごとにフォルダが分離されているため、誤って他社のデータにアクセスするリスクが低い
- **監査の容易性**: S3アクセスログで企業ごとのアクセス状況を追跡しやすい
- **GDPR/個人情報保護**: 企業の削除要求時に、S3パスで企業のデータを一括削除できる

#### 2. **運用の柔軟性**
```bash
# 企業ごとのバックアップ
aws s3 sync s3://siftbeam/service/input/customer123/ ./backup/customer123/

# 企業ごとの削除（契約終了時）
aws s3 rm s3://siftbeam/service/input/customer123/ --recursive
aws s3 rm s3://siftbeam/service/output/customer123/ --recursive
aws s3 rm s3://siftbeam/service/temp/customer123/ --recursive
```

#### 3. **アクセス制御の簡素化**
IAMポリシーでの企業単位のアクセス制限:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::siftbeam/service/*/customer123/*"
    }
  ]
}
```

#### 4. **S3パスの長さは問題ない**
- `processingHistoryId`はUUIDv4（36文字）
- `customerId`も短い識別子（10-20文字程度）
- 合計でも100文字以下に収まり、S3の1024文字制限には余裕

#### 5. **企業数が多くてもS3のパフォーマンスは問題ない**
- S3は数百万のオブジェクトを効率的に管理できる
- 企業数が1000社でも、`service/input/`配下のフォルダが1000個増えるだけ
- S3のプレフィックスベースのパーティショニングにより、パフォーマンスは維持される

---

## 代替案: S3オブジェクトタグの活用

customerIdをS3パスから削除しても、S3オブジェクトタグで管理できる:

```python
# アップロード時にタグを付与
s3.put_object(
    Bucket='siftbeam',
    Key=f'service/input/{processing_history_id}/{timestamp}_{file_name}',
    Body=file_data,
    Tagging='customerId=customer123&policyId=policy456'
)

# タグベースでの検索（ただし、コストが高い）
response = s3_client.list_objects_v2(
    Bucket='siftbeam',
    Prefix='service/input/'
)

for obj in response['Contents']:
    tags = s3_client.get_object_tagging(Bucket='siftbeam', Key=obj['Key'])
    if any(tag['Key'] == 'customerId' and tag['Value'] == 'customer123' for tag in tags['TagSet']):
        # 処理
        pass
```

**問題点:**
- タグベースの検索は、全オブジェクトをスキャンする必要がある（非効率）
- S3のタグAPIコールにはコストがかかる（特に大量のオブジェクト）
- IAMポリシーでのタグベースのアクセス制御は複雑

---

## 結論

**現在の設計（customerIdを含める）を維持すべき**

### 最終的な判断基準:

| 項目 | customerIdあり | customerIdなし |
|------|---------------|---------------|
| セキュリティ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 運用性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| パフォーマンス | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| スケーラビリティ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| コスト | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **総合** | **⭐⭐⭐⭐** | **⭐⭐⭐** |

**セキュリティと運用性を優先し、customerIdをS3パスに含める現在の設計を推奨します。**

---

## 実装のベストプラクティス

### 1. S3パス生成関数の標準化
```typescript
function generateServiceS3Key(input: {
  customerId: string;
  processingHistoryId: string;
  fileType: 'input' | 'output' | 'temp';
  fileName: string;
  stepName?: string;
}): string {
  const timestamp = generateTimestamp();
  const sanitizedFileName = sanitizeFileName(input.fileName);
  const fileNameWithTimestamp = `${timestamp}_${sanitizedFileName}`;
  
  if (input.fileType === 'temp' && input.stepName) {
    return `service/temp/${input.customerId}/${input.processingHistoryId}/${input.stepName}/${fileNameWithTimestamp}`;
  }
  
  return `service/${input.fileType}/${input.customerId}/${input.processingHistoryId}/${fileNameWithTimestamp}`;
}
```

### 2. S3パス検証関数
```typescript
function validateServiceS3Key(s3Key: string): {
  valid: boolean;
  customerId?: string;
  processingHistoryId?: string;
  fileType?: 'input' | 'output' | 'temp';
  error?: string;
} {
  const parts = s3Key.split('/');
  
  if (parts[0] !== 'service') {
    return { valid: false, error: 'Invalid service prefix' };
  }
  
  const fileType = parts[1];
  if (!['input', 'output', 'temp'].includes(fileType)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  if (parts.length < 5) {
    return { valid: false, error: 'Invalid path structure' };
  }
  
  return {
    valid: true,
    customerId: parts[2],
    processingHistoryId: parts[3],
    fileType: fileType as 'input' | 'output' | 'temp'
  };
}
```

### 3. Step Functions起動時の検証
```python
def lambda_handler(event, context):
    s3_key = event['Records'][0]['s3']['object']['key']
    
    # S3パスからcustomerIdとprocessingHistoryIdを抽出
    parts = s3_key.split('/')
    if len(parts) < 5 or parts[0] != 'service':
        return {'statusCode': 400, 'message': 'Invalid S3 key'}
    
    customer_id = parts[2]
    processing_history_id = parts[3]
    
    # DynamoDBで検証
    table = dynamodb.Table('siftbeam-processing-history')
    response = table.get_item(Key={'processing-historyId': processing_history_id})
    
    if 'Item' not in response:
        return {'statusCode': 404, 'message': 'Processing history not found'}
    
    history = response['Item']
    
    # customerIdの整合性チェック
    if history['customerId'] != customer_id:
        print(f"CustomerID mismatch: path={customer_id}, db={history['customerId']}")
        return {'statusCode': 400, 'message': 'CustomerID mismatch'}
    
    # Step Functionsを起動
    ...
```

---

## まとめ

**customerIdをS3パスに含める現在の設計は適切であり、変更の必要はありません。**

- **セキュリティ**: 企業データの明確な分離
- **運用性**: 企業単位での管理が容易
- **柔軟性**: IAMポリシー、ライフサイクルポリシーの適用が簡単
- **パフォーマンス**: S3の制限内で十分なパフォーマンス
- **コスト**: 追加コストなし

userIdやpolicyIdと同様に、customerIdもS3パスに含めることで、システム全体の管理性とセキュリティが向上します。


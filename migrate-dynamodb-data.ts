/**
 * DynamoDB データ移行スクリプト
 * 
 * 旧テーブル（ハイフン区切りPK）から新テーブル（camelCase PK）へデータを移行します
 * 
 * 使用方法:
 * 1. AWS認証情報を設定
 * 2. npx ts-node migrate-dynamodb-data.ts
 * 
 * 注意:
 * - 本番環境での実行前に必ずテスト環境で確認してください
 * - バックアップを取得してから実行してください
 */

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// AWS設定
const client = new DynamoDBClient({
  region: process.env.REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// 移行対象テーブルの定義
interface TableMigration {
  oldTableName: string;
  newTableName: string;
  pkMapping: { oldKey: string; newKey: string };
  skMapping?: { oldKey: string; newKey: string };
  additionalMappings?: Array<{ oldKey: string; newKey: string }>;
}

const tableMigrations: TableMigration[] = [
  {
    oldTableName: 'siftbeam-support-request',
    newTableName: 'siftbeam-support-requests',
    pkMapping: { oldKey: 'support-requestId', newKey: 'supportRequestId' },
  },
  {
    oldTableName: 'siftbeam-support-reply',
    newTableName: 'siftbeam-support-replies',
    pkMapping: { oldKey: 'support-replyId', newKey: 'supportReplyId' },
    additionalMappings: [
      { oldKey: 'support-requestId', newKey: 'supportRequestId' },
    ],
  },
  {
    oldTableName: 'siftbeam-neworder-request',
    newTableName: 'siftbeam-new-order-requests',
    pkMapping: { oldKey: 'neworder-requestId', newKey: 'newOrderRequestId' },
  },
  {
    oldTableName: 'siftbeam-neworder-reply',
    newTableName: 'siftbeam-new-order-replies',
    pkMapping: { oldKey: 'neworder-replyId', newKey: 'newOrderReplyId' },
    additionalMappings: [
      { oldKey: 'neworder-requestId', newKey: 'newOrderRequestId' },
    ],
  },
  {
    oldTableName: 'siftbeam-processing-history',
    newTableName: 'siftbeam-processing-histories',
    pkMapping: { oldKey: 'processing-historyId', newKey: 'processingHistoryId' },
  },
  {
    oldTableName: 'siftbeam-group',
    newTableName: 'siftbeam-groups',
    pkMapping: { oldKey: 'groupId', newKey: 'groupId' }, // 変更なし
  },
  {
    oldTableName: 'siftbeam-user-group',
    newTableName: 'siftbeam-user-groups',
    pkMapping: { oldKey: 'user-groupId', newKey: 'userGroupId' },
  },
  {
    oldTableName: 'siftbeam-policy-group',
    newTableName: 'siftbeam-policy-groups',
    pkMapping: { oldKey: 'policy-groupId', newKey: 'policyGroupId' },
  },
  {
    oldTableName: 'siftbeam-policy',
    newTableName: 'siftbeam-policies',
    pkMapping: { oldKey: 'policyId', newKey: 'policyId' }, // 変更なし
  },
  {
    oldTableName: 'siftbeam-policy-analysis',
    newTableName: 'siftbeam-policy-analyses',
    pkMapping: { oldKey: 'policy-analysisId', newKey: 'policyAnalysisId' },
  },
  {
    oldTableName: 'siftbeam-data-usage',
    newTableName: 'siftbeam-data-usages',
    pkMapping: { oldKey: 'data-usageId', newKey: 'dataUsageId' },
  },
  {
    oldTableName: 'siftbeam-audit-logs',
    newTableName: 'siftbeam-audit-logs',
    pkMapping: { oldKey: 'audit-logsId', newKey: 'auditLogId' },
  },
  {
    oldTableName: 'siftbeam-api-keys',
    newTableName: 'siftbeam-api-keys',
    pkMapping: { oldKey: 'api-keysId', newKey: 'apiKeyId' },
  },
  {
    oldTableName: 'siftbeam-usage-limits',
    newTableName: 'siftbeam-usage-limits',
    pkMapping: { oldKey: 'usage-limitsId', newKey: 'usageLimitId' },
  },
];

/**
 * テーブルからすべてのアイテムをスキャン
 */
async function scanTable(tableName: string): Promise<any[]> {
  const items: any[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    try {
      const response = await client.send(command);
      
      if (response.Items) {
        const unmarshalled = response.Items.map(item => unmarshall(item));
        items.push(...unmarshalled);
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
      
      console.log(`Scanned ${items.length} items from ${tableName}...`);
    } catch (error) {
      console.error(`Error scanning ${tableName}:`, error);
      throw error;
    }
  } while (lastEvaluatedKey);

  return items;
}

/**
 * アイテムのキー名を変換
 */
function transformItem(item: any, migration: TableMigration): any {
  const transformed: any = { ...item };

  // PKの変換
  if (migration.pkMapping.oldKey !== migration.pkMapping.newKey) {
    transformed[migration.pkMapping.newKey] = item[migration.pkMapping.oldKey];
    delete transformed[migration.pkMapping.oldKey];
  }

  // SKの変換（存在する場合）
  if (migration.skMapping && migration.skMapping.oldKey !== migration.skMapping.newKey) {
    transformed[migration.skMapping.newKey] = item[migration.skMapping.oldKey];
    delete transformed[migration.skMapping.oldKey];
  }

  // 追加のマッピング
  if (migration.additionalMappings) {
    for (const mapping of migration.additionalMappings) {
      if (item[mapping.oldKey] !== undefined) {
        transformed[mapping.newKey] = item[mapping.oldKey];
        delete transformed[mapping.oldKey];
      }
    }
  }

  return transformed;
}

/**
 * バッチでアイテムを書き込み
 */
async function batchWriteItems(tableName: string, items: any[]): Promise<void> {
  const batchSize = 25; // DynamoDBのバッチ書き込み上限
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: batch.map(item => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    });

    try {
      await docClient.send(command);
      console.log(`Wrote batch ${Math.floor(i / batchSize) + 1} (${batch.length} items) to ${tableName}`);
    } catch (error) {
      console.error(`Error writing batch to ${tableName}:`, error);
      throw error;
    }

    // レート制限を避けるため少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * テーブルを移行
 */
async function migrateTable(migration: TableMigration): Promise<void> {
  console.log(`\n========================================`);
  console.log(`Migrating: ${migration.oldTableName} → ${migration.newTableName}`);
  console.log(`========================================`);

  try {
    // 1. 旧テーブルからデータを読み取り
    console.log(`Step 1: Scanning ${migration.oldTableName}...`);
    const oldItems = await scanTable(migration.oldTableName);
    console.log(`✓ Found ${oldItems.length} items`);

    if (oldItems.length === 0) {
      console.log(`⚠ No items to migrate`);
      return;
    }

    // 2. データを変換
    console.log(`Step 2: Transforming items...`);
    const transformedItems = oldItems.map(item => transformItem(item, migration));
    console.log(`✓ Transformed ${transformedItems.length} items`);

    // 3. 新テーブルに書き込み
    console.log(`Step 3: Writing to ${migration.newTableName}...`);
    await batchWriteItems(migration.newTableName, transformedItems);
    console.log(`✓ Successfully migrated ${transformedItems.length} items`);

  } catch (error) {
    console.error(`✗ Migration failed for ${migration.oldTableName}:`, error);
    throw error;
  }
}

/**
 * すべてのテーブルを移行
 */
async function migrateAllTables(): Promise<void> {
  console.log('='.repeat(60));
  console.log('DynamoDB Data Migration Script');
  console.log('='.repeat(60));
  console.log(`Region: ${process.env.REGION || 'ap-northeast-1'}`);
  console.log(`Total tables to migrate: ${tableMigrations.length}`);
  console.log('='.repeat(60));

  const results: Array<{ table: string; success: boolean; error?: any }> = [];

  for (const migration of tableMigrations) {
    try {
      await migrateTable(migration);
      results.push({ table: migration.oldTableName, success: true });
    } catch (error) {
      results.push({ table: migration.oldTableName, success: false, error });
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✓ Successful: ${successful}/${results.length}`);
  console.log(`✗ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\nFailed migrations:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.table}: ${r.error?.message || 'Unknown error'}`);
    });
  }

  console.log('='.repeat(60));
}

/**
 * ドライラン（実際には書き込まない）
 */
async function dryRun(): Promise<void> {
  console.log('='.repeat(60));
  console.log('DRY RUN MODE - No data will be written');
  console.log('='.repeat(60));

  for (const migration of tableMigrations) {
    console.log(`\nChecking: ${migration.oldTableName}`);
    try {
      const items = await scanTable(migration.oldTableName);
      console.log(`  ✓ Found ${items.length} items`);
      
      if (items.length > 0) {
        const transformed = transformItem(items[0], migration);
        console.log(`  Sample transformation:`);
        console.log(`    Old keys: ${Object.keys(items[0]).join(', ')}`);
        console.log(`    New keys: ${Object.keys(transformed).join(', ')}`);
      }
    } catch (error: any) {
      console.log(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Dry run complete. Run without --dry-run to perform migration.');
  console.log('='.repeat(60));
}

// メイン実行
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  dryRun().catch(console.error);
} else {
  console.log('\n⚠️  WARNING: This will migrate data to new tables!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  
  setTimeout(() => {
    migrateAllTables().catch(console.error);
  }, 5000);
}


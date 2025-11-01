"""
S3イベントハンドラーのテストスクリプト
"""

import json
from handler import lambda_handler

# テスト用S3イベント
test_event = {
    "Records": [
        {
            "eventVersion": "2.1",
            "eventSource": "aws:s3",
            "awsRegion": "ap-northeast-1",
            "eventTime": "2025-01-27T10:30:00.000Z",
            "eventName": "ObjectCreated:Put",
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "test-config",
                "bucket": {
                    "name": "siftbeam",
                    "arn": "arn:aws:s3:::siftbeam"
                },
                "object": {
                    "key": "service/input/customer-001/550e8400-e29b-41d4-a716-446655440000/document.pdf",
                    "size": 1024000,
                    "eTag": "d41d8cd98f00b204e9800998ecf8427e",
                    "sequencer": "0055AED6DCD90281E5"
                }
            }
        }
    ]
}

if __name__ == "__main__":
    print("=" * 60)
    print("S3イベントハンドラーテスト")
    print("=" * 60)
    print()
    
    print("テストイベント:")
    print(json.dumps(test_event, indent=2))
    print()
    
    print("Lambda関数を実行中...")
    print()
    
    try:
        result = lambda_handler(test_event, None)
        
        print("=" * 60)
        print("実行結果:")
        print("=" * 60)
        print(json.dumps(result, indent=2))
        print()
        
        if result['statusCode'] == 200:
            print("✅ テスト成功!")
        else:
            print("❌ テスト失敗!")
            
    except Exception as e:
        print("=" * 60)
        print("エラー:")
        print("=" * 60)
        print(str(e))
        import traceback
        traceback.print_exc()
        print()
        print("❌ テスト失敗!")


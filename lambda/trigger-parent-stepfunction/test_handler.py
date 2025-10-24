"""
Lambda関数のテストスクリプト
"""

import json
from handler import lambda_handler, validate_s3_key


class MockContext:
    """Lambda contextのモック"""
    
    def get_remaining_time_in_millis(self):
        return 30000


def test_validate_s3_key():
    """S3キー検証のテスト"""
    print("\n=== Testing validate_s3_key ===\n")
    
    # 正常なパス
    test_cases = [
        {
            "key": "service/input/customer-123/processing-456/20251016120000_file.jpg",
            "expected_valid": True,
            "description": "Valid input file path"
        },
        {
            "key": "service/output/customer-123/processing-456/result.jpg",
            "expected_valid": True,
            "description": "Valid output file path (but will be skipped)"
        },
        {
            "key": "service/temp/customer-123/processing-456/step1/temp.jpg",
            "expected_valid": True,
            "description": "Valid temp file path (but will be skipped)"
        },
        {
            "key": "invalid/input/customer-123/file.jpg",
            "expected_valid": False,
            "description": "Invalid prefix (not 'service')"
        },
        {
            "key": "service/unknown/customer-123/file.jpg",
            "expected_valid": False,
            "description": "Invalid file type"
        },
        {
            "key": "service/input/customer-123",
            "expected_valid": False,
            "description": "Too short path"
        }
    ]
    
    for test_case in test_cases:
        result = validate_s3_key(test_case["key"])
        is_valid = result['valid']
        
        status = "✅ PASS" if is_valid == test_case["expected_valid"] else "❌ FAIL"
        print(f"{status}: {test_case['description']}")
        print(f"  Key: {test_case['key']}")
        print(f"  Result: {json.dumps(result, indent=2)}")
        print()


def test_lambda_handler_mock():
    """Lambda関数のモックテスト（実際のAWSリソースには接続しない）"""
    print("\n=== Testing lambda_handler (mock) ===\n")
    
    # テストイベント
    event = {
        "Records": [
            {
                "eventVersion": "2.1",
                "eventSource": "aws:s3",
                "awsRegion": "ap-northeast-1",
                "eventTime": "2025-10-16T12:00:00.000Z",
                "eventName": "ObjectCreated:Put",
                "s3": {
                    "bucket": {
                        "name": "siftbeam"
                    },
                    "object": {
                        "key": "service/input/customer-123/processing-456/20251016120000_test.jpg",
                        "size": 1234567
                    }
                }
            }
        ]
    }
    
    print("Test Event:")
    print(json.dumps(event, indent=2))
    print("\nNote: This will attempt to connect to AWS resources.")
    print("To run this test, ensure AWS credentials are configured and resources exist.")
    print("\nSkipping actual execution in test mode.")
    
    # 実際の実行をテストする場合は、以下のコメントを解除
    # context = MockContext()
    # result = lambda_handler(event, context)
    # print("\nResult:")
    # print(json.dumps(result, indent=2))


def create_test_event_json():
    """テストイベントのJSONファイルを作成"""
    test_event = {
        "Records": [
            {
                "eventVersion": "2.1",
                "eventSource": "aws:s3",
                "awsRegion": "ap-northeast-1",
                "eventTime": "2025-10-16T12:00:00.000Z",
                "eventName": "ObjectCreated:Put",
                "s3": {
                    "bucket": {
                        "name": "siftbeam"
                    },
                    "object": {
                        "key": "service/input/customer-123/processing-456/20251016120000_test.jpg",
                        "size": 1234567
                    }
                }
            }
        ]
    }
    
    with open('test_event.json', 'w', encoding='utf-8') as f:
        json.dump(test_event, f, indent=2, ensure_ascii=False)
    
    print("\n=== Test Event JSON Created ===")
    print("File: test_event.json")
    print("Use this file for testing in AWS Lambda console")


if __name__ == "__main__":
    print("=" * 60)
    print("Lambda Function Test Suite: TriggerParentStepFunction")
    print("=" * 60)
    
    # S3キー検証のテスト
    test_validate_s3_key()
    
    # Lambda関数のモックテスト
    test_lambda_handler_mock()
    
    # テストイベントJSONの作成
    create_test_event_json()
    
    print("\n" + "=" * 60)
    print("Test Suite Completed")
    print("=" * 60)


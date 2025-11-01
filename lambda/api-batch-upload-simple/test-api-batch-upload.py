#!/usr/bin/env python3
"""
API Batch Upload Test Script (Python)
複数ファイルを一度にアップロードするテストスクリプト
"""

import requests
import json
import os
import sys
from pathlib import Path

# ============================================
# 設定
# ============================================
API_URL = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/process"
API_KEY = "LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd"
TEST_FILES = [
    "icon.png",
    "icon2.png"
]

# ============================================
# ヘルパー関数
# ============================================

def format_file_size(size):
    """ファイルサイズを人間が読みやすい形式に変換"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"

def batch_upload_files(api_url, api_key, file_paths):
    """複数ファイルをバッチアップロード (multipart/form-data)"""
    
    print("=" * 50)
    print("API Batch Upload Test (multipart/form-data)")
    print("=" * 50)
    print(f"\nAPI URL: {api_url}")
    print(f"ファイル数: {len(file_paths)}")
    print()
    
    # ファイル数チェック（最大10ファイル）
    if len(file_paths) > 10:
        raise ValueError("ファイル数が多すぎます（最大10ファイル）")
    
    # ファイルの存在確認とサイズ計算
    total_size = 0
    files_to_upload = []
    
    for file_path in file_paths:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"ファイルが見つかりません: {file_path}")
        
        file_name = Path(file_path).name
        file_size = os.path.getsize(file_path)
        
        # ファイルサイズチェック（100MB制限）
        max_size = 100 * 1024 * 1024
        if file_size > max_size:
            raise ValueError(f"{file_name} のサイズが大きすぎます（最大100MB）")
        
        total_size += file_size
        print(f"✓ {file_name} - {format_file_size(file_size)}")
        
        # ファイルをオープン（後でrequestsが読み込む）
        files_to_upload.append(
            ('files', (file_name, open(file_path, 'rb'), 'application/octet-stream'))
        )
    
    print(f"\n合計サイズ: {format_file_size(total_size)}")
    print(f"形式: multipart/form-data")
    print()
    
    # ヘッダーを設定（Content-Typeは指定しない。requestsが自動設定）
    headers = {
        'x-api-key': api_key
    }
    
    # APIリクエストを送信
    print("アップロード中...")
    try:
        response = requests.post(
            api_url,
            headers=headers,
            files=files_to_upload,
            timeout=300
        )
        
        # ファイルハンドルをクローズ
        for _, (_, file_handle, _) in files_to_upload:
            file_handle.close()
        
        # レスポンスを解析
        response.raise_for_status()
        result = response.json()
        
        # 成功時の処理
        print("\n" + "=" * 50)
        print("✅ アップロード成功!")
        print("=" * 50)
        print(f"\nMessage: {result['message']}")
        print(f"Processing History ID: {result['data']['processingHistoryId']}")
        print(f"S3 Bucket: {result['data']['s3Bucket']}")
        print(f"Status: {result['data']['status']}")
        
        print("\nアップロードされたファイル:")
        for file_info in result['data']['files']:
            print(f"  - {file_info['fileName']}")
            print(f"    S3 Key: {file_info['s3Key']}")
            print(f"    Size: {format_file_size(file_info['fileSize'])}")
            print(f"    Content-Type: {file_info['contentType']}")
            print()
        
        print("レスポンス詳細:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        return result
        
    except requests.exceptions.HTTPError as e:
        # HTTPエラー
        print("\n" + "=" * 50)
        print("❌ アップロード失敗!")
        print("=" * 50)
        print(f"\nHTTPステータスコード: {e.response.status_code}")
        
        try:
            error_response = e.response.json()
            print("\nエラー詳細:")
            print(json.dumps(error_response, indent=2, ensure_ascii=False))
        except:
            print(f"\nエラーメッセージ: {e.response.text}")
        
        raise
        
    except requests.exceptions.RequestException as e:
        # その他のリクエストエラー
        print("\n" + "=" * 50)
        print("❌ リクエストエラー!")
        print("=" * 50)
        print(f"\nエラー: {str(e)}")
        raise

# ============================================
# メイン処理
# ============================================

if __name__ == "__main__":
    try:
        # コマンドライン引数からファイルパスを取得
        if len(sys.argv) > 1:
            test_files = sys.argv[1:]
        else:
            test_files = TEST_FILES
        
        # ファイルをバッチアップロード
        result = batch_upload_files(API_URL, API_KEY, test_files)
        
        print("\n" + "=" * 50)
        print("テスト完了")
        print("=" * 50)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"\n❌ エラー: {str(e)}", file=sys.stderr)
        sys.exit(1)


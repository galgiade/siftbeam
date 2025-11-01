#!/usr/bin/env python3
"""
API Upload Test Script (Python)
シンプルで使いやすいAPIテストスクリプト
"""

import requests
import json
import os
import sys
from pathlib import Path

# ============================================
# 設定
# ============================================
API_URL = "https://YOUR_API_GATEWAY_URL/prod/upload"
API_KEY = "YOUR_API_KEY"
TEST_FILE = "test.png"

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

def get_content_type(file_path):
    """ファイル拡張子からContent-Typeを取得"""
    ext = Path(file_path).suffix.lower()
    content_types = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
        '.csv': 'text/csv',
    }
    return content_types.get(ext, 'application/octet-stream')

def upload_file(api_url, api_key, file_path):
    """ファイルをアップロード"""
    
    # ファイルの存在確認
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"ファイルが見つかりません: {file_path}")
    
    # ファイル情報を取得
    file_name = Path(file_path).name
    file_size = os.path.getsize(file_path)
    content_type = get_content_type(file_path)
    
    print("=" * 50)
    print("API Upload Test")
    print("=" * 50)
    print(f"\nAPI URL: {api_url}")
    print(f"ファイル: {file_path}")
    print(f"ファイル名: {file_name}")
    print(f"ファイルサイズ: {format_file_size(file_size)}")
    print(f"Content-Type: {content_type}")
    print()
    
    # ファイルサイズチェック（100MB制限）
    max_size = 100 * 1024 * 1024
    if file_size > max_size:
        raise ValueError(f"ファイルサイズが大きすぎます（最大100MB）")
    
    # ファイルを読み込む
    print("ファイルを読み込み中...")
    with open(file_path, 'rb') as f:
        file_data = f.read()
    print("✓ ファイル読み込み完了")
    
    # ヘッダーを設定
    headers = {
        'x-api-key': api_key,
        'Content-Type': content_type
    }
    
    # URLにファイル名を追加
    upload_url = f"{api_url}?fileName={file_name}"
    
    # APIリクエストを送信
    print("\nアップロード中...")
    try:
        response = requests.post(
            upload_url,
            headers=headers,
            data=file_data,
            timeout=300
        )
        
        # レスポンスを解析
        response.raise_for_status()
        result = response.json()
        
        # 成功時の処理
        print("\n" + "=" * 50)
        print("✅ アップロード成功!")
        print("=" * 50)
        print(f"\nProcessing History ID: {result['data']['processingHistoryId']}")
        print(f"S3 Bucket: {result['data']['s3Bucket']}")
        print(f"S3 Key: {result['data']['s3Key']}")
        print(f"Status: {result['data']['status']}")
        print(f"Uploaded At: {result['data']['uploadedAt']}")
        
        print("\nレスポンス詳細:")
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
            test_file = sys.argv[1]
        else:
            test_file = TEST_FILE
        
        # ファイルをアップロード
        result = upload_file(API_URL, API_KEY, test_file)
        
        print("\n" + "=" * 50)
        print("テスト完了")
        print("=" * 50)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"\n❌ エラー: {str(e)}", file=sys.stderr)
        sys.exit(1)


#!/usr/bin/env python3
"""
S3 Presigned URL を使用したファイルアップロードテストスクリプト

大容量ファイル(100MB以上)のアップロードに対応
"""

import requests
import json
import os
import sys
from pathlib import Path
import mimetypes

# ============================================
# 設定
# ============================================
GENERATE_URL_API = "https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/process"
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


def get_content_type(file_path):
    """ファイルのContent-Typeを取得"""
    content_type, _ = mimetypes.guess_type(file_path)
    return content_type or 'application/octet-stream'


def step1_generate_upload_urls(api_url, api_key, file_paths):
    """
    ステップ1: 署名付きURLを生成
    """
    print("=" * 60)
    print("ステップ1: 署名付きURL生成")
    print("=" * 60)
    print(f"\nAPI URL: {api_url}")
    print(f"ファイル数: {len(file_paths)}")
    print()
    
    # ファイル情報を収集（ファイル名のみ）
    files_info = []
    total_size = 0
    
    for file_path in file_paths:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"ファイルが見つかりません: {file_path}")
        
        file_name = Path(file_path).name
        file_size = os.path.getsize(file_path)
        
        total_size += file_size
        print(f"✓ {file_name}")
        print(f"  サイズ: {format_file_size(file_size)}")
        print()
        
        # ファイル名のみを送信（サイズとタイプは不要）
        files_info.append({
            'fileName': file_name
        })
    
    print(f"合計サイズ: {format_file_size(total_size)}")
    print()
    
    # 署名付きURL生成APIを呼び出し
    print("署名付きURLを生成中...")
    
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    
    body = {
        'files': files_info
    }
    
    response = requests.post(
        api_url,
        headers=headers,
        json=body,
        timeout=30
    )
    
    response.raise_for_status()
    result = response.json()
    
    if not result.get('success'):
        raise Exception(f"URL生成失敗: {result.get('message')}")
    
    print("✅ 署名付きURL生成完了!")
    print()
    
    return result['data'], file_paths


def step2_upload_files(upload_data, file_paths):
    """
    ステップ2: ファイルをS3に直接アップロード
    """
    print("=" * 60)
    print("ステップ2: ファイルをS3にアップロード")
    print("=" * 60)
    print()
    
    upload_urls = upload_data['uploadUrls']
    
    for i, (upload_info, file_path) in enumerate(zip(upload_urls, file_paths), 1):
        file_name = upload_info['fileName']
        upload_url = upload_info['uploadUrl']
        content_type = upload_info['contentType']
        
        print(f"[{i}/{len(upload_urls)}] {file_name} をアップロード中...")
        
        # ファイルを読み込む
        with open(file_path, 'rb') as f:
            file_data = f.read()
        
        # S3に直接アップロード (PUT リクエスト)
        response = requests.put(
            upload_url,
            data=file_data,
            headers={'Content-Type': content_type},
            timeout=300
        )
        
        response.raise_for_status()
        
        print(f"  ✅ アップロード完了!")
        print(f"  S3 Key: {upload_info['s3Key']}")
        print()
    
    print("✅ 全ファイルのアップロード完了!")
    print()


def step3_trigger_processing(upload_data):
    """
    ステップ3: トリガーファイルをアップロードして処理を開始
    """
    print("=" * 60)
    print("ステップ3: 処理を開始")
    print("=" * 60)
    print()
    
    trigger_url = upload_data['triggerUrl']
    trigger_content = upload_data['triggerContent']
    
    print("トリガーファイルをアップロード中...")
    print(f"Processing History ID: {upload_data['processingHistoryId']}")
    print()
    
    # トリガーファイルをJSON形式でアップロード
    trigger_json = json.dumps(trigger_content, ensure_ascii=False, indent=2)
    
    response = requests.put(
        trigger_url,
        data=trigger_json.encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        timeout=30
    )
    
    response.raise_for_status()
    
    print("✅ トリガーファイルアップロード完了!")
    print("✅ Step Functions が起動しました!")
    print()


def upload_files_with_presigned_urls(api_url, api_key, file_paths):
    """
    署名付きURLを使用してファイルをアップロード
    """
    try:
        # ステップ1: 署名付きURLを生成
        upload_data, file_paths = step1_generate_upload_urls(api_url, api_key, file_paths)
        
        # ステップ2: ファイルをS3に直接アップロード
        step2_upload_files(upload_data, file_paths)
        
        # ステップ3: トリガーファイルをアップロードして処理を開始
        step3_trigger_processing(upload_data)
        
        # 結果サマリー
        print("=" * 60)
        print("✅ アップロード完了!")
        print("=" * 60)
        print()
        print(f"Processing History ID: {upload_data['processingHistoryId']}")
        print(f"ファイル数: {len(upload_data['uploadUrls'])}")
        print()
        print("処理状況は以下で確認できます:")
        print("- ブラウザの処理履歴画面")
        print("- DynamoDB: siftbeam-processing-history")
        print("- Step Functions: ServiceProcessingOrchestrator")
        print()
        
        return upload_data
        
    except requests.exceptions.HTTPError as e:
        print("\n" + "=" * 60)
        print("❌ エラーが発生しました!")
        print("=" * 60)
        print(f"\nHTTPステータスコード: {e.response.status_code}")
        
        try:
            error_response = e.response.json()
            print("\nエラー詳細:")
            print(json.dumps(error_response, indent=2, ensure_ascii=False))
        except:
            print(f"\nエラーメッセージ: {e.response.text}")
        
        raise
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ エラーが発生しました!")
        print("=" * 60)
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
        
        # ファイルをアップロード
        result = upload_files_with_presigned_urls(GENERATE_URL_API, API_KEY, test_files)
        
        print("=" * 60)
        print("テスト完了")
        print("=" * 60)
        
        sys.exit(0)
        
    except Exception as e:
        print(f"\n❌ エラー: {str(e)}", file=sys.stderr)
        sys.exit(1)


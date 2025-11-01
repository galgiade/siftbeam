#!/usr/bin/env python3
"""
SiftBeam API を使用してファイルをアップロードするテストスクリプト

使い方:
    python test_api_upload.py --api-key YOUR_API_KEY --file path/to/file.pdf --policy POLICY_ID

環境変数での設定も可能:
    export SIFTBEAM_API_KEY=your_api_key
    export SIFTBEAM_API_URL=https://your-api-gateway-url.execute-api.ap-northeast-1.amazonaws.com/prod/upload
    python test_api_upload.py --file path/to/file.pdf --policy POLICY_ID
"""

import argparse
import json
import os
import sys
import requests
from pathlib import Path
from datetime import datetime

# サポートされているファイルタイプ
SUPPORTED_EXTENSIONS = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
}

def get_content_type(file_path: str) -> str:
    """ファイル拡張子からContent-Typeを取得"""
    ext = Path(file_path).suffix.lower()
    return SUPPORTED_EXTENSIONS.get(ext, 'application/octet-stream')

def validate_file(file_path: str) -> tuple[bool, str]:
    """ファイルの検証"""
    if not os.path.exists(file_path):
        return False, f"ファイルが見つかりません: {file_path}"
    
    if not os.path.isfile(file_path):
        return False, f"指定されたパスはファイルではありません: {file_path}"
    
    ext = Path(file_path).suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        return False, f"サポートされていないファイルタイプです: {ext}\nサポート: {', '.join(SUPPORTED_EXTENSIONS.keys())}"
    
    file_size = os.path.getsize(file_path)
    if file_size == 0:
        return False, "ファイルサイズが0バイトです"
    
    # 最大ファイルサイズ: 100MB
    max_size = 100 * 1024 * 1024
    if file_size > max_size:
        return False, f"ファイルサイズが大きすぎます: {file_size / 1024 / 1024:.2f}MB (最大: 100MB)"
    
    return True, ""

def request_upload_url(api_url: str, api_key: str, file_path: str) -> dict:
    """Lambda関数からアップロードURLを取得"""
    print(f"\n{'='*60}")
    print("ステップ1: アップロードURL取得")
    print(f"{'='*60}")
    print(f"API URL: {api_url}")
    
    # ファイル情報を取得
    document_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    
    print(f"ドキュメント名: {document_name}")
    print(f"ファイルサイズ: {file_size:,} bytes ({file_size / 1024 / 1024:.2f} MB)")
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    payload = {
        'document': document_name,
        'fileSize': file_size
    }
    
    print(f"\nリクエスト送信中...")
    response = requests.post(api_url, headers=headers, json=payload)
    
    print(f"ステータスコード: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ エラー: {response.text}")
        sys.exit(1)
    
    data = response.json()
    print(f"✅ アップロードURL取得成功")
    print(f"プロセスID: {data.get('processId')}")
    print(f"S3キー: {data.get('s3Key')}")
    
    return data

def upload_file(upload_url: str, file_path: str, content_type: str) -> bool:
    """S3にファイルをアップロード"""
    print(f"\n{'='*60}")
    print("ステップ2: ファイルアップロード")
    print(f"{'='*60}")
    print(f"ファイル: {file_path}")
    print(f"Content-Type: {content_type}")
    
    headers = {
        'Content-Type': content_type
    }
    
    print(f"\nアップロード中...")
    with open(file_path, 'rb') as f:
        response = requests.put(upload_url, headers=headers, data=f)
    
    print(f"ステータスコード: {response.status_code}")
    
    if response.status_code in [200, 204]:
        print(f"✅ ファイルアップロード成功")
        return True
    else:
        print(f"❌ エラー: {response.text}")
        return False

def main():
    parser = argparse.ArgumentParser(
        description='SiftBeam API を使用してファイルをアップロード',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # 基本的な使い方
  python test_api_upload.py --api-key YOUR_API_KEY --file document.pdf
  
  # 環境変数を使用
  export SIFTBEAM_API_KEY=your_api_key
  export SIFTBEAM_API_URL=https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload
  python test_api_upload.py --file document.pdf
  
  # APIエンドポイントを指定
  python test_api_upload.py --api-key YOUR_API_KEY --api-url https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload --file document.pdf
        """
    )
    
    parser.add_argument('--api-key', 
                       help='API キー (環境変数 SIFTBEAM_API_KEY でも設定可能)',
                       default=os.environ.get('SIFTBEAM_API_KEY'))
    
    parser.add_argument('--api-url',
                       help='API Gateway エンドポイントURL (環境変数 SIFTBEAM_API_URL でも設定可能)',
                       default=os.environ.get('SIFTBEAM_API_URL'))
    
    parser.add_argument('--file', '-f',
                       required=True,
                       help='アップロードするファイルのパス')
    
    parser.add_argument('--verbose', '-v',
                       action='store_true',
                       help='詳細なログを表示')
    
    args = parser.parse_args()
    
    # バリデーション
    if not args.api_key:
        print("❌ エラー: APIキーが指定されていません")
        print("--api-key オプションまたは環境変数 SIFTBEAM_API_KEY を設定してください")
        sys.exit(1)
    
    if not args.api_url:
        print("❌ エラー: API URLが指定されていません")
        print("--api-url オプションまたは環境変数 SIFTBEAM_API_URL を設定してください")
        sys.exit(1)
    
    # ファイル検証
    is_valid, error_msg = validate_file(args.file)
    if not is_valid:
        print(f"❌ エラー: {error_msg}")
        sys.exit(1)
    
    # ファイル情報取得
    file_path = args.file
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    content_type = get_content_type(file_path)
    
    print(f"\n{'='*60}")
    print("SiftBeam API ファイルアップロードテスト")
    print(f"{'='*60}")
    print(f"開始時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"ファイル: {file_name}")
    print(f"サイズ: {file_size:,} bytes ({file_size / 1024 / 1024:.2f} MB)")
    print(f"タイプ: {content_type}")
    
    try:
        # ステップ1: アップロードURL取得（ファイルパスを渡す）
        upload_data = request_upload_url(
            args.api_url,
            args.api_key,
            file_path
        )
        
        # ステップ2: ファイルアップロード
        success = upload_file(
            upload_data['uploadUrl'],
            file_path,
            content_type
        )
        
        if success:
            print(f"\n{'='*60}")
            print("✅ アップロード完了")
            print(f"{'='*60}")
            print(f"プロセスID: {upload_data.get('processId')}")
            print(f"S3バケット: {upload_data.get('s3Bucket')}")
            print(f"S3キー: {upload_data.get('s3Key')}")
            print(f"ステータス: {upload_data.get('status')}")
            
            if args.verbose:
                print(f"\n詳細情報:")
                print(json.dumps(upload_data, indent=2, ensure_ascii=False))
            
            print(f"\n完了時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            return 0
        else:
            print(f"\n❌ アップロード失敗")
            return 1
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ ネットワークエラー: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ 予期しないエラー: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())


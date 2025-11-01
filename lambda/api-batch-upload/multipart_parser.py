"""
multipart/form-data パーサー (Lambda用)
python-multipartライブラリを使わない軽量実装
"""

import re
from typing import Dict, List, Tuple, Any
from io import BytesIO


def parse_multipart_form_data(body: str, content_type: str, is_base64_encoded: bool = False) -> List[Dict[str, Any]]:
    """
    multipart/form-dataをパースしてファイルリストを返す
    
    Args:
        body: リクエストボディ
        content_type: Content-Typeヘッダー
        is_base64_encoded: ボディがBase64エンコードされているか
        
    Returns:
        ファイル情報のリスト [{'fileName': str, 'fileData': bytes, 'contentType': str}, ...]
    """
    import base64
    
    # Base64デコード
    if is_base64_encoded:
        body_bytes = base64.b64decode(body)
    else:
        body_bytes = body.encode('utf-8') if isinstance(body, str) else body
    
    # boundaryを取得
    boundary_match = re.search(r'boundary=([^;]+)', content_type)
    if not boundary_match:
        raise ValueError("boundary not found in Content-Type")
    
    boundary = boundary_match.group(1).strip('"')
    boundary_bytes = f'--{boundary}'.encode('utf-8')
    
    # パートに分割
    parts = body_bytes.split(boundary_bytes)
    
    files = []
    
    for part in parts:
        if not part or part == b'--\r\n' or part == b'--':
            continue
        
        # ヘッダーとボディを分離
        if b'\r\n\r\n' not in part:
            continue
        
        header_section, file_data = part.split(b'\r\n\r\n', 1)
        
        # 末尾の\r\nを削除
        file_data = file_data.rstrip(b'\r\n')
        
        # Content-Dispositionからファイル名を取得
        header_str = header_section.decode('utf-8', errors='ignore')
        filename_match = re.search(r'filename="([^"]+)"', header_str)
        
        if not filename_match:
            continue
        
        filename = filename_match.group(1)
        
        # Content-Typeを取得
        content_type_match = re.search(r'Content-Type:\s*([^\r\n]+)', header_str, re.IGNORECASE)
        file_content_type = content_type_match.group(1).strip() if content_type_match else 'application/octet-stream'
        
        files.append({
            'fileName': filename,
            'fileData': file_data,
            'contentType': file_content_type
        })
    
    return files


def parse_files_from_event(event: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    API Gatewayイベントからファイルを抽出
    multipart/form-data と application/json (Base64) の両方に対応
    
    Args:
        event: API Gatewayイベント
        
    Returns:
        ファイル情報のリスト [{'fileName': str, 'fileData': bytes, 'contentType': str}, ...]
    """
    import json
    import base64
    
    headers = event.get('headers', {})
    body = event.get('body', '')
    is_base64_encoded = event.get('isBase64Encoded', False)
    
    # Content-Typeを取得 (大文字小文字を区別しない)
    content_type = None
    for key, value in headers.items():
        if key.lower() == 'content-type':
            content_type = value
            break
    
    if not content_type:
        raise ValueError("Content-Type header not found")
    
    # multipart/form-data の場合
    if 'multipart/form-data' in content_type.lower():
        return parse_multipart_form_data(body, content_type, is_base64_encoded)
    
    # application/json (Base64) の場合
    elif 'application/json' in content_type.lower():
        try:
            request_data = json.loads(body)
            files_data = request_data.get('files', [])
            
            files = []
            for file_info in files_data:
                file_name = file_info.get('fileName')
                file_data_base64 = file_info.get('fileData')
                file_content_type = file_info.get('contentType', 'application/octet-stream')
                
                if not file_name or not file_data_base64:
                    continue
                
                # Base64デコード
                file_data = base64.b64decode(file_data_base64)
                
                files.append({
                    'fileName': file_name,
                    'fileData': file_data,
                    'contentType': file_content_type
                })
            
            return files
        
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {str(e)}")
    
    else:
        raise ValueError(f"Unsupported Content-Type: {content_type}")


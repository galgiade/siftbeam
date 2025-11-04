"""
辞書ファイルと型定義ファイルの整合性をチェックする汎用スクリプト

使い方:
  python check_dictionary_types.py                    # 全ての辞書をチェック
  python check_dictionary_types.py signIn             # 特定の辞書のみチェック
  python check_dictionary_types.py signIn signUpAuth  # 複数の辞書をチェック
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, Set, List, Tuple

def extract_type_properties(type_file_path: str) -> Dict[str, Set[str]]:
    """
    型定義ファイル(.d.ts)からプロパティ構造を抽出
    Returns: {"label": {"prop1", "prop2"}, "alert": {"prop3"}}
    """
    if not os.path.exists(type_file_path):
        return {}
    
    with open(type_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # コメントを削除
    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    properties = {}
    current_section = None
    
    # ネストされた構造を解析
    lines = content.split('\n')
    brace_level = 0
    
    for line in lines:
        line = line.strip()
        
        # セクション名を検出 (例: "label: {")
        section_match = re.match(r'^(\w+):\s*\{', line)
        if section_match and brace_level == 1:
            current_section = section_match.group(1)
            properties[current_section] = set()
            continue
        
        # プロパティを検出 (例: "signInTitle: string;")
        if current_section and brace_level == 2:
            prop_match = re.match(r'^(\w+):\s*[\w\[\]<>|]+;?', line)
            if prop_match:
                properties[current_section].add(prop_match.group(1))
        
        # ブレースレベルを追跡
        brace_level += line.count('{')
        brace_level -= line.count('}')
    
    return properties

def extract_dict_properties(dict_file_path: str) -> Dict[str, Set[str]]:
    """
    辞書ファイル(.ts)からプロパティ構造を抽出
    Returns: {"label": {"prop1", "prop2"}, "alert": {"prop3"}}
    """
    if not os.path.exists(dict_file_path):
        return {}
    
    with open(dict_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # コメントを削除
    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    properties = {}
    current_section = None
    
    lines = content.split('\n')
    brace_level = 0
    in_const_declaration = False
    
    for line in lines:
        line = line.strip()
        
        # const宣言の開始を検出
        if re.match(r'^const \w+.*=\s*\{', line):
            in_const_declaration = True
            brace_level = 1
            continue
        
        if not in_const_declaration:
            continue
        
        # セクション名を検出 (例: "label: {")
        section_match = re.match(r'^(\w+):\s*\{', line)
        if section_match and brace_level == 1:
            current_section = section_match.group(1)
            properties[current_section] = set()
            continue
        
        # プロパティを検出 (例: "signInTitle: 'サインイン',")
        if current_section and brace_level == 2:
            prop_match = re.match(r'^(\w+):\s*["\']', line)
            if prop_match:
                properties[current_section].add(prop_match.group(1))
        
        # ブレースレベルを追跡
        brace_level += line.count('{')
        brace_level -= line.count('}')
        
        if brace_level == 0:
            in_const_declaration = False
    
    return properties

def compare_properties(
    type_props: Dict[str, Set[str]], 
    dict_props: Dict[str, Set[str]], 
    dict_name: str
) -> Tuple[bool, List[str]]:
    """
    型定義と辞書データのプロパティを比較
    Returns: (is_valid, error_messages)
    """
    errors = []
    is_valid = True
    
    # 型定義にあるセクションが辞書にあるかチェック
    for section in type_props:
        if section not in dict_props:
            errors.append(f"  [X] セクション '{section}' が辞書に存在しません")
            is_valid = False
            continue
        
        # 型定義にあるプロパティが辞書にあるかチェック
        missing_props = type_props[section] - dict_props[section]
        if missing_props:
            errors.append(f"  [X] セクション '{section}' に不足しているプロパティ: {', '.join(sorted(missing_props))}")
            is_valid = False
        
        # 辞書にあるが型定義にないプロパティをチェック
        extra_props = dict_props[section] - type_props[section]
        if extra_props:
            errors.append(f"  [!] セクション '{section}' に余分なプロパティ: {', '.join(sorted(extra_props))}")
            # 余分なプロパティは警告のみ（エラーにしない）
    
    # 辞書にあるが型定義にないセクションをチェック
    extra_sections = set(dict_props.keys()) - set(type_props.keys())
    if extra_sections:
        errors.append(f"  [!] 余分なセクション: {', '.join(sorted(extra_sections))}")
    
    return is_valid, errors

def check_dictionary(dict_name: str, base_dir: str = "app/dictionaries") -> Tuple[bool, List[str]]:
    """
    特定の辞書ディレクトリをチェック
    """
    dict_dir = os.path.join(base_dir, dict_name)
    
    if not os.path.exists(dict_dir):
        return False, [f"[X] ディレクトリが存在しません: {dict_dir}"]
    
    # 型定義ファイルを探す
    type_files = list(Path(dict_dir).glob("*.d.ts"))
    if not type_files:
        return False, [f"[X] 型定義ファイル(.d.ts)が見つかりません: {dict_dir}"]
    
    type_file = str(type_files[0])
    type_props = extract_type_properties(type_file)
    
    if not type_props:
        return False, [f"[X] 型定義からプロパティを抽出できませんでした: {type_file}"]
    
    # 全ての言語ファイルをチェック
    lang_files = [f for f in os.listdir(dict_dir) if f.endswith('.ts') and not f.endswith('.d.ts')]
    
    if not lang_files:
        return False, [f"[X] 辞書ファイルが見つかりません: {dict_dir}"]
    
    all_valid = True
    all_errors = []
    
    for lang_file in sorted(lang_files):
        lang_path = os.path.join(dict_dir, lang_file)
        dict_props = extract_dict_properties(lang_path)
        
        if not dict_props:
            all_errors.append(f"  [X] {lang_file}: プロパティを抽出できませんでした")
            all_valid = False
            continue
        
        is_valid, errors = compare_properties(type_props, dict_props, lang_file)
        
        if is_valid:
            all_errors.append(f"  [OK] {lang_file}: OK")
        else:
            all_errors.append(f"  [X] {lang_file}:")
            all_errors.extend(errors)
            all_valid = False
    
    return all_valid, all_errors

def main():
    base_dir = "app/dictionaries"
    
    # コマンドライン引数から辞書名を取得
    if len(sys.argv) > 1:
        dict_names = sys.argv[1:]
    else:
        # 全ての辞書ディレクトリを取得
        if not os.path.exists(base_dir):
            print(f"❌ ディレクトリが存在しません: {base_dir}")
            sys.exit(1)
        
        dict_names = [
            d for d in os.listdir(base_dir)
            if os.path.isdir(os.path.join(base_dir, d))
        ]
    
    print("=" * 60)
    print("辞書ファイルと型定義の整合性チェック")
    print("=" * 60)
    print()
    
    all_valid = True
    results = []
    
    for dict_name in sorted(dict_names):
        is_valid, errors = check_dictionary(dict_name, base_dir)
        
        status = "[OK]" if is_valid else "[ERROR]"
        results.append((dict_name, status, is_valid))
        
        print(f"[{dict_name}]: {status}")
        for error in errors:
            print(error)
        print()
        
        if not is_valid:
            all_valid = False
    
    # サマリー
    print("=" * 60)
    print("チェック結果サマリー")
    print("=" * 60)
    
    ok_count = sum(1 for _, _, valid in results if valid)
    error_count = len(results) - ok_count
    
    print(f"[OK]: {ok_count} 個")
    print(f"[ERROR]: {error_count} 個")
    print()
    
    if not all_valid:
        print("[WARNING] エラーが見つかりました。修正が必要です。")
        sys.exit(1)
    else:
        print("[SUCCESS] 全ての辞書ファイルが型定義と一致しています!")
        sys.exit(0)

if __name__ == "__main__":
    main()


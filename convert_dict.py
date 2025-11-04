import os
import re

def convert_file(filepath, type_name, lang_code):
    """辞書ファイルを形式1に変換"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 既に形式1の場合はスキップ
    if 'import type' in content:
        print(f'Already converted: {filepath}')
        return False
    
    # export default { を変換
    content = re.sub(
        r'^export default \{',
        f"import type {{ {type_name} }} from './{type_name.replace('Locale', '').lower()}.d.ts';\n\nconst {lang_code}: {type_name} = {{",
        content,
        flags=re.MULTILINE
    )
    
    # } as const; を変換
    content = re.sub(
        r'\} as const;?\s*$',
        f'}};\n\nexport default {lang_code};',
        content,
        flags=re.MULTILINE
    )
    
    # クォート付きキーを削除
    content = re.sub(r'"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:', r'\1:', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Converted: {filepath}')
    return True

# limitUsage
dict_dir = 'app/dictionaries/limitUsage'
files = ['en.ts', 'ja.ts', 'de.ts', 'fr.ts', 'id.ts', 'ko.ts', 'pt.ts', 'zh.ts']

for file in files:
    filepath = os.path.join(dict_dir, file)
    lang_code = file.replace('.ts', '')
    convert_file(filepath, 'LimitUsageLocale', lang_code)

print('\nAll files converted!')


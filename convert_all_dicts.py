import os
import re
import glob

def convert_file(filepath, type_name, lang_code):
    """辞書ファイルを形式1に変換"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 既に形式1の場合はスキップ
    if 'import type' in content:
        return False
    
    # 型定義ファイル名を推測
    type_file = type_name.replace('Locale', '')
    # キャメルケースをケバブケースに変換
    type_file = re.sub(r'(?<!^)(?=[A-Z])', '-', type_file).lower()
    
    # export default { を変換
    content = re.sub(
        r'^export default \{',
        f"import type {{ {type_name} }} from './{type_file}.d.ts';\n\nconst {lang_code}: {type_name} = {{",
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
    
    return True

# 変換対象のディレクトリと型名のマッピング
directories = {
    'account': 'AccountLocale',
    'service': 'ServiceLocale',
    'createPayment': 'CreatePaymentLocale',
    'createCompanyInfo': 'CreateCompanyInfoLocale',
    'user-management': 'UserManagementLocale',
    'signUpAuth': 'SignUpAuthLocale',
    'signIn': 'SignInLocale',
    'policy-management': 'PolicyManagementLocale',
    'group-management': 'GroupManagementLocale',
    'paymentMethods': 'PaymentMethodsLocale',
    'createSupportCenter': 'SupportCenterLocale',
    'company': 'CompanyProfileLocale',
    'createAdmin': 'CreateAdminLocale',
    'forgotPassword': 'ForgotPasswordLocale',
    'deleteAccount': 'DeleteAccountLocale',
    'cancelDeleteAccount': 'CancelDeleteAccountLocale',
    'SupportCenterDetail': 'SupportCenterDetailLocale',
    'auditLog': 'AuditLogLocale',
    'navigation': 'AccountLocale',
}

total_converted = 0
total_skipped = 0

for dir_name, type_name in directories.items():
    dict_dir = f'app/dictionaries/{dir_name}'
    if not os.path.exists(dict_dir):
        print(f'Directory not found: {dict_dir}')
        continue
    
    print(f'\nProcessing {dir_name}...')
    
    # すべての.tsファイルを取得(.d.tsを除く)
    files = glob.glob(os.path.join(dict_dir, '*.ts'))
    files = [f for f in files if not f.endswith('.d.ts')]
    
    for filepath in files:
        filename = os.path.basename(filepath)
        lang_code = filename.replace('.ts', '')
        
        if convert_file(filepath, type_name, lang_code):
            print(f'  [OK] Converted: {filename}')
            total_converted += 1
        else:
            print(f'  [SKIP] Already converted: {filename}')
            total_skipped += 1

print(f'\n\n=== Summary ===')
print(f'Total converted: {total_converted}')
print(f'Total skipped: {total_skipped}')
print(f'All done!')


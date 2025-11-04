import os
import re
import glob

# 型定義ファイル名のマッピング(特殊なケース)
type_file_mapping = {
    'AccountLocale': 'AccountLocale.d.ts',
    'ServiceLocale': 'ServiceLocale.d.ts',
    'CreatePaymentLocale': 'createPayment.d.ts',
    'CreateCompanyInfoLocale': 'createCompanyInfo.d.ts',
    'UserManagementLocale': 'user-management.d.ts',
    'SignUpAuthLocale': 'signUpAuth.d.ts',
    'SignInLocale': 'signIn.d.ts',
    'PolicyManagementLocale': 'policy-management.d.ts',
    'GroupManagementLocale': 'group-management.d.ts',
    'PaymentMethodsLocale': 'paymentMethods.d.ts',
    'SupportCenterLocale': 'createSupportCenter.d.ts',
    'CompanyProfileLocale': 'company.d.ts',
    'CreateAdminLocale': 'createAdmin.d.ts',
    'ForgotPasswordLocale': 'forgotPassword.d.ts',
    'DeleteAccountLocale': 'deleteAccount.d.ts',
    'CancelDeleteAccountLocale': 'cancelDeleteAccount.d.ts',
    'SupportCenterDetailLocale': 'supportCenterDetail.d.ts',
    'AuditLogLocale': 'auditLog.d.ts',
    'LimitUsageLocale': 'limitUsage.d.ts',
    'NewOrderLocale': 'newOrder.d.ts',
}

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
    'limitUsage': 'LimitUsageLocale',
    'newOrder': 'NewOrderLocale',
}

total_fixed = 0

for dir_name, type_name in directories.items():
    dict_dir = f'app/dictionaries/{dir_name}'
    if not os.path.exists(dict_dir):
        continue
    
    # 正しい型定義ファイル名を取得
    correct_type_file = type_file_mapping.get(type_name)
    if not correct_type_file:
        # デフォルトの命名規則
        correct_type_file = re.sub(r'(?<!^)(?=[A-Z])', '-', type_name.replace('Locale', '')).lower() + '.d.ts'
    
    print(f'\nProcessing {dir_name}... (type file: {correct_type_file})')
    
    # すべての.tsファイルを取得(.d.tsを除く)
    files = glob.glob(os.path.join(dict_dir, '*.ts'))
    files = [f for f in files if not f.endswith('.d.ts')]
    
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # import文を修正
        old_pattern = r"import type \{ " + type_name + r" \} from '\./[^']+\.d\.ts';"
        new_import = f"import type {{ {type_name} }} from './{correct_type_file}';"
        
        new_content = re.sub(old_pattern, new_import, content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'  [FIXED] {os.path.basename(filepath)}')
            total_fixed += 1

print(f'\n\n=== Summary ===')
print(f'Total fixed: {total_fixed}')
print(f'All done!')


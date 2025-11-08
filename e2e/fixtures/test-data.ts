/**
 * テストデータフィクスチャ
 * 
 * Playwrightベストプラクティス: テストデータを一元管理
 */

/**
 * テストユーザー情報
 */
export const testUsers = {
  valid: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'ValidPass123',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'InvalidPassword123',
  },
};

/**
 * テストファイル情報
 */
export const testFiles = {
  smallPdf: {
    name: 'test-small.pdf',
    size: '100KB',
    path: 'e2e/fixtures/test-small.pdf',
  },
  largePdf: {
    name: 'test-large.pdf',
    size: '10MB',
    path: 'e2e/fixtures/test-large.pdf',
  },
};

/**
 * テスト用URL
 */
export const testUrls = {
  ja: {
    home: '/ja',
    signin: '/ja/signin',
    signup: '/ja/signup/auth',
    service: '/ja/service',
    account: {
      user: '/ja/account/user',
      apiKeys: '/ja/account/api-keys',
      apiManagement: '/ja/account/api-management',
      userManagement: '/ja/account/user-management',
      groupManagement: '/ja/account/group-management',
      group: '/ja/account/group',
      policyManagement: '/ja/account/policy-management',
      payment: '/ja/account/payment',
      usageLimit: '/ja/account/limit-usage',
      auditLog: '/ja/account/audit-log',
      company: '/ja/account/company',
      accountDeletion: '/ja/account/account-deletion',
      support: '/ja/account/support',
      newOrder: '/ja/account/new-order',
    },
    announcement: '/ja/announcement',
    flow: '/ja/flow',
    terms: '/ja/terms',
    privacy: '/ja/privacy',
    pricing: '/ja/pricing',
    legalDisclosures: '/ja/legal-disclosures',
    forgotPassword: '/ja/forgot-password',
  },
  en: {
    home: '/en',
    signin: '/en/signin',
    // ... 必要に応じて追加
  },
};

/**
 * テスト用タイムアウト設定
 */
export const timeouts = {
  short: 5000,    // 5秒
  medium: 10000,  // 10秒
  long: 30000,    // 30秒
  veryLong: 60000, // 60秒
};

/**
 * テスト用エラーメッセージ
 */
export const errorMessages = {
  ja: {
    emailRequired: 'メールアドレスを入力してください',
    passwordRequired: 'パスワードを入力してください',
    invalidEmail: 'メールアドレスの形式が正しくありません',
    invalidPassword: 'パスワードの形式が正しくありません',
    authFailed: '認証に失敗しました',
  },
  en: {
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    invalidEmail: 'Invalid email format',
    invalidPassword: 'Invalid password format',
    authFailed: 'Authentication failed',
  },
};


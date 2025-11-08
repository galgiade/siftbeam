/**
 * セレクターヘルパー
 * 
 * Playwrightベストプラクティス: セレクターを一元管理して保守性を向上
 */

/**
 * 共通セレクター
 */
export const selectors = {
  // 認証関連
  auth: {
    emailInput: '[name="email"]',
    passwordInput: '[name="password"]',
    submitButton: 'button[type="submit"]',
    signUpLink: 'a[href*="/signup"]',
    forgotPasswordLink: 'a[href*="/forgot-password"]',
  },

  // ナビゲーション
  navigation: {
    sideNav: 'nav, aside, [role="navigation"]',
    signOutButton: 'button, a',
    menuButton: 'button[aria-label*="menu"]',
  },

  // フォーム
  form: {
    form: 'form',
    submitButton: 'button[type="submit"]',
    cancelButton: 'button[type="button"]',
  },

  // 共通UI要素
  common: {
    heading: 'h1, h2',
    card: 'div[class*="card"]',
    table: 'table',
    list: 'ul, ol',
    loading: 'text=/読み込み中|Loading/i',
    error: '[class*="error"], [class*="alert"]',
  },
};

/**
 * テキストベースのセレクターを生成
 * 
 * @param text - 検索するテキスト（正規表現）
 * @returns セレクター文字列
 */
export function textSelector(text: string | RegExp): string {
  return `text=${text}`;
}

/**
 * 複数の条件に一致するセレクターを生成
 * 
 * @param baseSelector - ベースセレクター
 * @param textPattern - テキストパターン
 * @returns セレクター文字列
 */
export function combinedSelector(baseSelector: string, textPattern: RegExp): string {
  return `${baseSelector}:has-text("${textPattern.source}")`;
}


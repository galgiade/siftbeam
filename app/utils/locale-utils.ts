// 対応している言語のリスト（2文字コードに統一）
export const supportedLocales = ['ja', 'en', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'id'] as const;
export type SupportedLocale = typeof supportedLocales[number];

// デフォルト言語の設定
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// 旧ロケールコードから新ロケールコードへのマッピング（後方互換性のため）
const legacyLocaleMap: Record<string, SupportedLocale> = {
  'en-US': 'en',
  'en-us': 'en',
  'zh-CN': 'zh',
  'zh-cn': 'zh',
};

// 言語選択のヘルパー関数
export function getPreferredLocale(acceptLanguage: string): SupportedLocale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  // accept-languageヘッダーをパース
  const languages: Array<{ language: string; q: number }> = acceptLanguage
    .split(',')
    .map(lang => {
      const [language, q = '1.0'] = lang.trim().split(';q=');
      const normalized = (language && language.length > 0) ? language : DEFAULT_LOCALE;
      return {
        language: normalized, // そのまま保持（地域コード含む）
        q: parseFloat(q)
      };
    })
    .sort((a, b) => b.q - a.q); // q値で降順ソート

  // 対応している言語を優先度順に探す（地域コードの厳密一致→ベース言語の順）
  const canonical = new Map<string, SupportedLocale>(
    supportedLocales.map(l => [l.toLowerCase(), l])
  );

  for (const item of languages) {
    const langStr = item.language;
    const lowerLang = langStr.toLowerCase();
    
    // 旧ロケールコードのマッピングをチェック
    if (legacyLocaleMap[lowerLang]) {
      return legacyLocaleMap[lowerLang];
    }
    
    const exact = canonical.get(lowerLang);
    if (exact) return exact;

    const base = (langStr.split('-')[0] || '').toLowerCase();
    const baseMatch = canonical.get(base);
    if (baseMatch) return baseMatch;
  }

  return DEFAULT_LOCALE; // 対応している言語が見つからない場合はデフォルト
}

// パスからロケールを抽出する関数
export function getLocaleFromPath(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  const canonical = new Map<string, SupportedLocale>(
    supportedLocales.map(l => [l.toLowerCase(), l])
  );
  const match = canonical.get((firstSegment || '').toLowerCase());
  if (match) return match;
  
  return null;
}

// ロケールが有効かどうかをチェックする関数
export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

// 有効なロケールを取得する関数（無効な場合はデフォルトを返す）
export function getValidLocale(locale: string): SupportedLocale {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

// 検索エンジンボットを検出する関数
export function isSearchEngineBot(userAgent: string | null): boolean {
  if (!userAgent) {
    return false;
  }

  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i, // Internet Archive
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
} 
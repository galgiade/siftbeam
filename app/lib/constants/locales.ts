export type SupportedLocale = 'ja' | 'en' | 'es' | 'fr' | 'de' | 'ko' | 'pt' | 'id' | 'zh';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['ja', 'en', 'es', 'fr', 'de', 'ko', 'pt', 'id', 'zh'];

export function mapToStripeLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    'ja': 'ja',
    'en': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'ko': 'ko',
    'pt': 'pt',
    'id': 'id',
    'zh': 'zh',
    'zh-CN': 'zh'
  };
  
  return localeMap[locale] || 'en';
}

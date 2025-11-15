import NavigationBar from '@/app/_components/common/navigation/NavigationBar';
import Footer from '@/app/_components/common/Footer';
import { pickDictionary, commonDictionaries } from '@/app/dictionaries/mappings';
import type { CommonLocale } from '@/app/dictionaries/common/common.d.ts';
import Script from 'next/script';

// 静的生成のためのgenerateStaticParams
export async function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'en-US' },
    { locale: 'zh-CN' },
    { locale: 'zh' },
    { locale: 'ko' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'id' },
  ];
}

// ロケールを正規化（zh-CN → zh, en-US → en）
function normalizeLocale(locale: string): string {
  if (locale === 'zh-CN') return 'zh';
  if (locale === 'en-US') return 'en';
  return locale;
}

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;
  let locale = params.locale;
  
  // 共通辞書を取得
  const commonDict = pickDictionary(commonDictionaries, locale, 'en');
  const navigationDict: CommonLocale['common']['navigation'] = commonDict.common.navigation;
  const footerDict: CommonLocale['common']['footer'] = commonDict.common.footer;

  // HTML lang属性用に正規化されたロケール
  const htmlLang = normalizeLocale(locale);

  return (
    <>
      {/* SSRで即座にlang属性を設定（パフォーマンス最適化） */}
      <Script
        id="set-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang='${htmlLang}'`,
        }}
      />
      <div>
        <div className="min-h-screen mx-auto">
        <NavigationBar locale={locale} dictionary={navigationDict} />
        {children}
        <Footer dictionary={footerDict} locale={locale} />
        </div>
      </div>
    </>
  );
}

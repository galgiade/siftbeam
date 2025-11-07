import {
  supportedLocales,
  DEFAULT_LOCALE,
  getPreferredLocale,
  getLocaleFromPath,
  isValidLocale,
  getValidLocale,
} from '../locale-utils'

describe('locale-utils', () => {
  describe('supportedLocales', () => {
    it('サポートされている言語のリストが定義されている', () => {
      expect(supportedLocales).toBeDefined()
      expect(Array.isArray(supportedLocales)).toBe(true)
      expect(supportedLocales.length).toBeGreaterThan(0)
    })

    it('主要な言語が含まれている', () => {
      expect(supportedLocales).toContain('ja')
      expect(supportedLocales).toContain('en')
      expect(supportedLocales).toContain('en-US')
      expect(supportedLocales).toContain('ko')
      expect(supportedLocales).toContain('zh-CN')
    })

    it('11の言語がサポートされている', () => {
      expect(supportedLocales.length).toBe(11)
    })
  })

  describe('DEFAULT_LOCALE', () => {
    it('デフォルト言語が英語である', () => {
      expect(DEFAULT_LOCALE).toBe('en')
    })

    it('デフォルト言語がサポートされている言語に含まれる', () => {
      expect(supportedLocales).toContain(DEFAULT_LOCALE)
    })
  })

  describe('getPreferredLocale', () => {
    it('日本語を優先言語として取得する', () => {
      expect(getPreferredLocale('ja')).toBe('ja')
      expect(getPreferredLocale('ja-JP')).toBe('ja')
    })

    it('英語を優先言語として取得する', () => {
      expect(getPreferredLocale('en')).toBe('en')
      expect(getPreferredLocale('en-US')).toBe('en-US')
    })

    it('韓国語を優先言語として取得する', () => {
      expect(getPreferredLocale('ko')).toBe('ko')
      expect(getPreferredLocale('ko-KR')).toBe('ko')
    })

    it('中国語を優先言語として取得する', () => {
      expect(getPreferredLocale('zh')).toBe('zh')
      expect(getPreferredLocale('zh-CN')).toBe('zh-CN')
    })

    it('フランス語を優先言語として取得する', () => {
      expect(getPreferredLocale('fr')).toBe('fr')
      expect(getPreferredLocale('fr-FR')).toBe('fr')
    })

    it('ドイツ語を優先言語として取得する', () => {
      expect(getPreferredLocale('de')).toBe('de')
      expect(getPreferredLocale('de-DE')).toBe('de')
    })

    it('スペイン語を優先言語として取得する', () => {
      expect(getPreferredLocale('es')).toBe('es')
      expect(getPreferredLocale('es-ES')).toBe('es')
    })

    it('ポルトガル語を優先言語として取得する', () => {
      expect(getPreferredLocale('pt')).toBe('pt')
      expect(getPreferredLocale('pt-BR')).toBe('pt')
    })

    it('インドネシア語を優先言語として取得する', () => {
      expect(getPreferredLocale('id')).toBe('id')
      expect(getPreferredLocale('id-ID')).toBe('id')
    })

    it('複数の言語を含むAccept-Languageヘッダーを解析する', () => {
      expect(getPreferredLocale('ja,en;q=0.9')).toBe('ja')
      expect(getPreferredLocale('en;q=0.9,ja;q=1.0')).toBe('ja')
      expect(getPreferredLocale('fr;q=0.8,en;q=0.9,ja;q=0.7')).toBe('en')
    })

    it('q値で優先順位を決定する', () => {
      expect(getPreferredLocale('en;q=0.5,ja;q=0.9')).toBe('ja')
      expect(getPreferredLocale('ja;q=0.3,en;q=0.8')).toBe('en')
    })

    it('サポートされていない言語の場合はデフォルトを返す', () => {
      expect(getPreferredLocale('xx')).toBe(DEFAULT_LOCALE)
      expect(getPreferredLocale('invalid')).toBe(DEFAULT_LOCALE)
    })

    it('空文字の場合はデフォルトを返す', () => {
      expect(getPreferredLocale('')).toBe(DEFAULT_LOCALE)
    })

    it('複雑なAccept-Languageヘッダーを処理する', () => {
      const header = 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7'
      expect(getPreferredLocale(header)).toBe('ja')
    })

    it('大文字小文字を区別せずに処理する', () => {
      expect(getPreferredLocale('JA')).toBe('ja')
      expect(getPreferredLocale('EN-US')).toBe('en-US')
    })

    it('スペースを含むヘッダーを処理する', () => {
      expect(getPreferredLocale('ja, en;q=0.9')).toBe('ja')
      expect(getPreferredLocale('ja , en ; q=0.9')).toBe('ja')
    })
  })

  describe('getLocaleFromPath', () => {
    it('パスから日本語ロケールを抽出する', () => {
      expect(getLocaleFromPath('/ja/home')).toBe('ja')
      expect(getLocaleFromPath('/ja')).toBe('ja')
      expect(getLocaleFromPath('/ja/')).toBe('ja')
    })

    it('パスから英語ロケールを抽出する', () => {
      expect(getLocaleFromPath('/en/home')).toBe('en')
      expect(getLocaleFromPath('/en-US/home')).toBe('en-US')
    })

    it('パスから韓国語ロケールを抽出する', () => {
      expect(getLocaleFromPath('/ko/about')).toBe('ko')
    })

    it('パスから中国語ロケールを抽出する', () => {
      expect(getLocaleFromPath('/zh/contact')).toBe('zh')
      expect(getLocaleFromPath('/zh-CN/contact')).toBe('zh-CN')
    })

    it('ロケールがない場合はnullを返す', () => {
      expect(getLocaleFromPath('/home')).toBeNull()
      expect(getLocaleFromPath('/')).toBeNull()
    })

    it('無効なロケールの場合はnullを返す', () => {
      expect(getLocaleFromPath('/invalid/home')).toBeNull()
      expect(getLocaleFromPath('/xx/about')).toBeNull()
    })

    it('深いパスからロケールを抽出する', () => {
      expect(getLocaleFromPath('/ja/products/category/item')).toBe('ja')
      expect(getLocaleFromPath('/en/blog/2024/01/post')).toBe('en')
    })

    it('大文字小文字を区別せずに処理する', () => {
      expect(getLocaleFromPath('/JA/home')).toBe('ja')
      expect(getLocaleFromPath('/EN-US/home')).toBe('en-US')
    })

    it('空文字の場合はnullを返す', () => {
      expect(getLocaleFromPath('')).toBeNull()
    })

    it('スラッシュのみの場合はnullを返す', () => {
      expect(getLocaleFromPath('/')).toBeNull()
      expect(getLocaleFromPath('//')).toBeNull()
    })
  })

  describe('isValidLocale', () => {
    it('有効なロケールを検証する', () => {
      expect(isValidLocale('ja')).toBe(true)
      expect(isValidLocale('en')).toBe(true)
      expect(isValidLocale('en-US')).toBe(true)
      expect(isValidLocale('ko')).toBe(true)
      expect(isValidLocale('zh-CN')).toBe(true)
    })

    it('無効なロケールを拒否する', () => {
      expect(isValidLocale('invalid')).toBe(false)
      expect(isValidLocale('xx')).toBe(false)
      expect(isValidLocale('ja-XX')).toBe(false)
    })

    it('空文字を拒否する', () => {
      expect(isValidLocale('')).toBe(false)
    })

    it('大文字のロケールを拒否する', () => {
      expect(isValidLocale('JA')).toBe(false)
      expect(isValidLocale('EN')).toBe(false)
    })

    it('すべてのサポートされている言語を検証する', () => {
      supportedLocales.forEach(locale => {
        expect(isValidLocale(locale)).toBe(true)
      })
    })
  })

  describe('getValidLocale', () => {
    it('有効なロケールをそのまま返す', () => {
      expect(getValidLocale('ja')).toBe('ja')
      expect(getValidLocale('en')).toBe('en')
      expect(getValidLocale('ko')).toBe('ko')
    })

    it('無効なロケールの場合はデフォルトを返す', () => {
      expect(getValidLocale('invalid')).toBe(DEFAULT_LOCALE)
      expect(getValidLocale('xx')).toBe(DEFAULT_LOCALE)
    })

    it('空文字の場合はデフォルトを返す', () => {
      expect(getValidLocale('')).toBe(DEFAULT_LOCALE)
    })

    it('大文字のロケールの場合はデフォルトを返す', () => {
      expect(getValidLocale('JA')).toBe(DEFAULT_LOCALE)
    })

    it('すべてのサポートされている言語を正しく処理する', () => {
      supportedLocales.forEach(locale => {
        expect(getValidLocale(locale)).toBe(locale)
      })
    })
  })

  describe('統合テスト', () => {
    it('Accept-Languageヘッダーからロケールを取得してパスを生成する', () => {
      const locale = getPreferredLocale('ja,en;q=0.9')
      const path = `/${locale}/home`

      expect(path).toBe('/ja/home')
      expect(getLocaleFromPath(path)).toBe('ja')
    })

    it('パスからロケールを抽出して検証する', () => {
      const path = '/ja/products'
      const locale = getLocaleFromPath(path)

      expect(locale).toBe('ja')
      expect(isValidLocale(locale!)).toBe(true)
    })

    it('無効なロケールを安全に処理する', () => {
      const invalidLocale = 'invalid'
      const validLocale = getValidLocale(invalidLocale)

      expect(validLocale).toBe(DEFAULT_LOCALE)
      expect(isValidLocale(validLocale)).toBe(true)
    })

    it('複数の関数を組み合わせて使用できる', () => {
      const acceptLanguage = 'ja-JP,ja;q=0.9,en;q=0.8'
      const preferredLocale = getPreferredLocale(acceptLanguage)
      const isValid = isValidLocale(preferredLocale)
      const validLocale = getValidLocale(preferredLocale)

      expect(preferredLocale).toBe('ja')
      expect(isValid).toBe(true)
      expect(validLocale).toBe('ja')
    })
  })

  describe('エッジケース', () => {
    it('非常に長いAccept-Languageヘッダーを処理する', () => {
      const longHeader = 'ja,en,ko,zh,fr,de,es,pt,id,ru,ar;q=0.9'
      expect(() => getPreferredLocale(longHeader)).not.toThrow()
    })

    it('不正な形式のAccept-Languageヘッダーを処理する', () => {
      expect(() => getPreferredLocale('ja;;q=0.9')).not.toThrow()
      expect(() => getPreferredLocale('ja,,,en')).not.toThrow()
    })

    it('非常に長いパスを処理する', () => {
      const longPath = '/ja/' + 'segment/'.repeat(100)
      expect(getLocaleFromPath(longPath)).toBe('ja')
    })

    it('特殊文字を含むパスを処理する', () => {
      expect(getLocaleFromPath('/ja/products?id=123')).toBe('ja')
      expect(getLocaleFromPath('/ja/products#section')).toBe('ja')
    })

    it('空文字列やfalsyな値を安全に処理する', () => {
      expect(getPreferredLocale('')).toBe(DEFAULT_LOCALE)
      expect(getLocaleFromPath('')).toBeNull()
    })
  })
})


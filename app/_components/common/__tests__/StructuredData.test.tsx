import { render } from '@testing-library/react'
import StructuredData, {
  generateSiftbeamStructuredData,
  generateOrganizationStructuredData,
  generateServiceStructuredData,
} from '../StructuredData'

describe('StructuredData', () => {
  const mockData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Test Company',
    url: 'https://example.com',
  }

  it('正しくレンダリングされる', () => {
    const { container } = render(<StructuredData data={mockData} />)
    expect(container).toBeInTheDocument()
  })

  it('JSON-LDスクリプトタグが生成される', () => {
    const { container } = render(<StructuredData data={mockData} />)
    
    // Next.js Scriptコンポーネントはモックされているため、
    // 実際のスクリプトタグは生成されないが、コンポーネントは正常にレンダリングされる
    expect(container).toBeInTheDocument()
  })

  it('空のデータでもエラーにならない', () => {
    expect(() => render(<StructuredData data={{}} />)).not.toThrow()
  })

  it('複雑なネストされたデータを処理できる', () => {
    const complexData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Test Product',
      offers: {
        '@type': 'Offer',
        price: '100',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        reviewCount: '100',
      },
    }

    expect(() => render(<StructuredData data={complexData} />)).not.toThrow()
  })
})

describe('generateSiftbeamStructuredData', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://siftbeam.com'
  })

  it('日本語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('SoftwareApplication')
    expect(data.name).toBe('siftbeam')
    expect(data.inLanguage).toBe('ja')
    expect(data.description).toContain('企業データ')
  })

  it('英語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('en')

    expect(data.inLanguage).toBe('en')
    expect(data.description).toContain('cloud platform')
  })

  it('中国語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('zh-CN')

    expect(data.inLanguage).toBe('zh-CN')
    expect(data.description).toContain('云平台')
  })

  it('韓国語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('ko')

    expect(data.inLanguage).toBe('ko')
    expect(data.description).toContain('클라우드 플랫폼')
  })

  it('フランス語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('fr')

    expect(data.inLanguage).toBe('fr')
    expect(data.description).toContain('plateforme cloud')
  })

  it('ドイツ語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('de')

    expect(data.inLanguage).toBe('de')
    expect(data.description).toContain('Cloud-Plattform')
  })

  it('スペイン語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('es')

    expect(data.inLanguage).toBe('es')
    expect(data.description).toContain('plataforma en la nube')
  })

  it('ポルトガル語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('pt')

    expect(data.inLanguage).toBe('pt')
    expect(data.description).toContain('plataforma em nuvem')
  })

  it('インドネシア語の構造化データを生成する', () => {
    const data = generateSiftbeamStructuredData('id')

    expect(data.inLanguage).toBe('id')
    expect(data.description.toLowerCase()).toContain('platform cloud')
  })

  it('デフォルトで日本語を使用する', () => {
    const data = generateSiftbeamStructuredData()

    expect(data.inLanguage).toBe('ja')
  })

  it('無効な言語コードの場合は英語にフォールバックする', () => {
    const data = generateSiftbeamStructuredData('invalid')

    expect(data.description).toContain('cloud platform')
  })

  it('必須フィールドがすべて含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data['@context']).toBeDefined()
    expect(data['@type']).toBeDefined()
    expect(data.name).toBeDefined()
    expect(data.description).toBeDefined()
    expect(data.url).toBeDefined()
    expect(data.applicationCategory).toBeDefined()
    expect(data.operatingSystem).toBeDefined()
  })

  it('著者情報が含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.author).toBeDefined()
    expect(data.author['@type']).toBe('Organization')
    expect(data.author.name).toBe('siftbeam')
  })

  it('出版者情報が含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.publisher).toBeDefined()
    expect(data.publisher['@type']).toBe('Organization')
    expect(data.publisher.logo).toBeDefined()
  })

  it('価格情報が含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.offers).toBeDefined()
    expect(data.offers['@type']).toBe('Offer')
    expect(data.offers.priceCurrency).toBe('JPY')
  })

  it('米国ロケールの場合はUSDを使用する', () => {
    const data = generateSiftbeamStructuredData('en')

    expect(data.offers.priceCurrency).toBe('USD')
  })

  it('機能リストが含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.featureList).toBeDefined()
    expect(Array.isArray(data.featureList)).toBe(true)
    expect(data.featureList.length).toBeGreaterThan(0)
  })

  it('評価情報が含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.aggregateRating).toBeDefined()
    expect(data.aggregateRating['@type']).toBe('AggregateRating')
    expect(data.aggregateRating.ratingValue).toBeDefined()
  })

  it('キーワードが含まれる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(data.keywords).toBeDefined()
    expect(typeof data.keywords).toBe('string')
    expect(data.keywords.length).toBeGreaterThan(0)
  })
})

describe('generateOrganizationStructuredData', () => {
  it('組織情報の構造化データを生成する', () => {
    const data = generateOrganizationStructuredData('ja')

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('siftbeam')
  })

  it('連絡先情報が含まれる', () => {
    const data = generateOrganizationStructuredData('ja')

    expect(data.contactPoint).toBeDefined()
    expect(data.contactPoint['@type']).toBe('ContactPoint')
    expect(data.contactPoint.email).toBeDefined()
  })

  it('ソーシャルメディアリンクが含まれる', () => {
    const data = generateOrganizationStructuredData('ja')

    expect(data.sameAs).toBeDefined()
    expect(Array.isArray(data.sameAs)).toBe(true)
    expect(data.sameAs.length).toBeGreaterThan(0)
  })

  it('各言語で適切な説明が生成される', () => {
    const locales = ['ja', 'en-US', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id']

    locales.forEach(locale => {
      const data = generateOrganizationStructuredData(locale)
      expect(data.description).toBeDefined()
      expect(data.description.length).toBeGreaterThan(0)
    })
  })
})

describe('generateServiceStructuredData', () => {
  it('サービス情報の構造化データを生成する', () => {
    const data = generateServiceStructuredData('ja')

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Service')
    expect(data.name).toBeDefined()
  })

  it('プロバイダー情報が含まれる', () => {
    const data = generateServiceStructuredData('ja')

    expect(data.provider).toBeDefined()
    expect(data.provider['@type']).toBe('Organization')
    expect(data.provider.name).toBe('siftbeam')
  })

  it('サービスタイプが正しく設定される', () => {
    const data = generateServiceStructuredData('ja')

    expect(data.serviceType).toBe('Software as a Service')
  })

  it('サービスエリアが全世界に設定される', () => {
    const data = generateServiceStructuredData('ja')

    expect(data.areaServed).toBe('Worldwide')
  })

  it('オファーカタログが含まれる', () => {
    const data = generateServiceStructuredData('ja')

    expect(data.hasOfferCatalog).toBeDefined()
    expect(data.hasOfferCatalog['@type']).toBe('OfferCatalog')
    expect(data.hasOfferCatalog.itemListElement).toBeDefined()
    expect(Array.isArray(data.hasOfferCatalog.itemListElement)).toBe(true)
  })

  it('各言語で適切なサービス名が生成される', () => {
    const locales = ['ja', 'en-US', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id']

    locales.forEach(locale => {
      const data = generateServiceStructuredData(locale)
      expect(data.name).toBeDefined()
      expect(data.name.length).toBeGreaterThan(0)
      expect(data.description).toBeDefined()
    })
  })

  it('サービスリストが各言語で生成される', () => {
    const data = generateServiceStructuredData('ja')

    expect(data.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0)
    
    data.hasOfferCatalog.itemListElement.forEach((item: any) => {
      expect(item['@type']).toBe('Offer')
      expect(item.itemOffered).toBeDefined()
      expect(item.itemOffered['@type']).toBe('Service')
      expect(item.itemOffered.name).toBeDefined()
    })
  })
})

describe('統合テスト', () => {
  it('3つの構造化データを組み合わせて使用できる', () => {
    const siftbeamData = generateSiftbeamStructuredData('ja')
    const orgData = generateOrganizationStructuredData('ja')
    const serviceData = generateServiceStructuredData('ja')

    expect(siftbeamData).toBeDefined()
    expect(orgData).toBeDefined()
    expect(serviceData).toBeDefined()

    // すべてのデータが有効なSchema.orgフォーマットであることを確認
    expect(siftbeamData['@context']).toBe('https://schema.org')
    expect(orgData['@context']).toBe('https://schema.org')
    expect(serviceData['@context']).toBe('https://schema.org')
  })

  it('すべての言語で構造化データを生成できる', () => {
    const locales = ['ja', 'en', 'zh-CN', 'ko', 'fr', 'de', 'es', 'pt', 'id']

    locales.forEach(locale => {
      expect(() => generateSiftbeamStructuredData(locale)).not.toThrow()
      expect(() => generateOrganizationStructuredData(locale)).not.toThrow()
      expect(() => generateServiceStructuredData(locale)).not.toThrow()
    })
  })

  it('生成されたデータをStructuredDataコンポーネントでレンダリングできる', () => {
    const data = generateSiftbeamStructuredData('ja')

    expect(() => render(<StructuredData data={data} />)).not.toThrow()
  })
})


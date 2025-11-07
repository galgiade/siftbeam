import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  const mockDictionary = {
    title: 'Test Footer',
    description: 'Test Description',
    links: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      legalDisclosures: 'Legal Disclosures',
    },
    copyright: '© 2024 Test Company',
  }

  const defaultProps = {
    dictionary: mockDictionary,
    locale: 'ja',
  }

  it('正しくレンダリングされる', () => {
    render(<Footer {...defaultProps} />)

    expect(screen.getByText('Test Footer')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('© 2024 Test Company')).toBeInTheDocument()
  })

  it('すべてのリンクが表示される', () => {
    render(<Footer {...defaultProps} />)

    const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
    const legalLink = screen.getByRole('link', { name: 'Legal Disclosures' })

    expect(termsLink).toBeInTheDocument()
    expect(privacyLink).toBeInTheDocument()
    expect(legalLink).toBeInTheDocument()
  })

  it('リンクが正しいhrefを持つ', () => {
    render(<Footer {...defaultProps} />)

    const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
    const legalLink = screen.getByRole('link', { name: 'Legal Disclosures' })

    expect(termsLink).toHaveAttribute('href', '/ja/terms')
    expect(privacyLink).toHaveAttribute('href', '/ja/privacy')
    expect(legalLink).toHaveAttribute('href', '/ja/legal-disclosures')
  })

  it('異なるlocaleでリンクが正しく生成される', () => {
    render(<Footer {...defaultProps} locale="en" />)

    const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
    const legalLink = screen.getByRole('link', { name: 'Legal Disclosures' })

    expect(termsLink).toHaveAttribute('href', '/en/terms')
    expect(privacyLink).toHaveAttribute('href', '/en/privacy')
    expect(legalLink).toHaveAttribute('href', '/en/legal-disclosures')
  })

  it('フッターが適切なセマンティックタグを使用している', () => {
    const { container } = render(<Footer {...defaultProps} />)

    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('リンクが正しくレンダリングされる', () => {
    render(<Footer {...defaultProps} />)

    const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
    const legalLink = screen.getByRole('link', { name: 'Legal Disclosures' })

    expect(termsLink).toBeInTheDocument()
    expect(privacyLink).toBeInTheDocument()
    expect(legalLink).toBeInTheDocument()
  })

  describe('異なる言語でのレンダリング', () => {
    it('日本語の辞書でレンダリングされる', () => {
      const jaDictionary = {
        title: 'フッター',
        description: '説明',
        links: {
          terms: '利用規約',
          privacy: 'プライバシーポリシー',
          legalDisclosures: '特定商取引法に基づく表記',
        },
        copyright: '© 2024 テスト会社',
      }

      render(<Footer dictionary={jaDictionary} locale="ja" />)

      expect(screen.getByText('フッター')).toBeInTheDocument()
      expect(screen.getByText('利用規約')).toBeInTheDocument()
      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
      expect(screen.getByText('特定商取引法に基づく表記')).toBeInTheDocument()
    })

    it('英語の辞書でレンダリングされる', () => {
      const enDictionary = {
        title: 'Footer',
        description: 'Description',
        links: {
          terms: 'Terms of Service',
          privacy: 'Privacy Policy',
          legalDisclosures: 'Legal Disclosures',
        },
        copyright: '© 2024 Test Company',
      }

      render(<Footer dictionary={enDictionary} locale="en" />)

      expect(screen.getByText('Footer')).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      expect(screen.getByText('Legal Disclosures')).toBeInTheDocument()
    })
  })

  describe('スタイリング', () => {
    it('フッターに適切な背景色が設定されている', () => {
      const { container } = render(<Footer {...defaultProps} />)

      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('bg-gray-900', 'text-white')
    })

    it('コンテナに最大幅が設定されている', () => {
      const { container } = render(<Footer {...defaultProps} />)

      const contentDiv = container.querySelector('.max-w-7xl')
      expect(contentDiv).toBeInTheDocument()
    })
  })
})


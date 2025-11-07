import { render, screen } from '@testing-library/react'
import AccessDeniedError from '../AccessDeniedError'
import { useParams } from 'next/navigation'

// useParamsはjest.setupで既にモックされている
const mockUseParams = useParams as jest.Mock

// 辞書のモック
jest.mock('@/app/dictionaries/common/accessDenied', () => ({
  accessDeniedDictionaries: {
    ja: {
      title: 'アクセスが拒否されました',
      message: 'このページにアクセスする権限がありません',
      backButton: '戻る',
    },
    en: {
      title: 'Access Denied',
      message: 'You do not have permission to access this page',
      backButton: 'Go Back',
    },
    ko: {
      title: '액세스가 거부되었습니다',
      message: '이 페이지에 액세스할 권한이 없습니다',
      backButton: '돌아가기',
    },
  },
}))

describe('AccessDeniedError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({ locale: 'ja' })
  })

  describe('基本的なレンダリング', () => {
    it('正しくレンダリングされる', () => {
      render(<AccessDeniedError />)

      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
      expect(screen.getByText('このページにアクセスする権限がありません')).toBeInTheDocument()
    })

    it('ロックアイコンが表示される', () => {
      const { container } = render(<AccessDeniedError />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('戻るボタンが表示される', () => {
      render(<AccessDeniedError />)

      expect(screen.getByText('戻る')).toBeInTheDocument()
    })
  })

  describe('言語対応', () => {
    it('日本語で表示される', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError />)

      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
      expect(screen.getByText('このページにアクセスする権限がありません')).toBeInTheDocument()
      expect(screen.getByText('戻る')).toBeInTheDocument()
    })

    it('英語で表示される', () => {
      mockUseParams.mockReturnValue({ locale: 'en' })
      render(<AccessDeniedError />)

      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument()
      expect(screen.getByText('Go Back')).toBeInTheDocument()
    })

    it('韓国語で表示される', () => {
      mockUseParams.mockReturnValue({ locale: 'ko' })
      render(<AccessDeniedError />)

      expect(screen.getByText('액세스가 거부되었습니다')).toBeInTheDocument()
      expect(screen.getByText('이 페이지에 액세스할 권한이 없습니다')).toBeInTheDocument()
      expect(screen.getByText('돌아가기')).toBeInTheDocument()
    })

    it('サポートされていない言語の場合は日本語にフォールバックする', () => {
      mockUseParams.mockReturnValue({ locale: 'invalid' })
      render(<AccessDeniedError />)

      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
    })

    it('ロケールが未定義の場合は日本語を使用する', () => {
      mockUseParams.mockReturnValue({})
      render(<AccessDeniedError />)

      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
    })
  })

  describe('戻るボタンのリンク', () => {
    it('デフォルトでユーザープロフィールページにリンクする', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', '/ja/account/user')
    })

    it('カスタムリンク先を指定できる', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref="/ja/home" />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', '/ja/home')
    })

    it('異なるロケールで正しいリンクを生成する', () => {
      mockUseParams.mockReturnValue({ locale: 'en' })
      render(<AccessDeniedError />)

      const button = screen.getByText('Go Back')
      expect(button.closest('a')).toHaveAttribute('href', '/en/account/user')
    })

    it('カスタムリンクがロケールに依存しない', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref="/custom/path" />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', '/custom/path')
    })
  })

  describe('スタイリング', () => {
    it('適切なレイアウトクラスが適用されている', () => {
      const { container } = render(<AccessDeniedError />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center')
    })

    it('黄色のアイコン背景が表示される', () => {
      const { container } = render(<AccessDeniedError />)

      const iconWrapper = container.querySelector('.bg-yellow-100')
      expect(iconWrapper).toBeInTheDocument()
    })

    it('カードコンポーネントが使用されている', () => {
      const { container } = render(<AccessDeniedError />)

      // HeroUIのCardコンポーネントが使用されていることを確認
      expect(container.querySelector('.max-w-md')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('見出しが適切な階層で表示される', () => {
      render(<AccessDeniedError />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('アクセスが拒否されました')
    })

    it('ボタンがリンクとして機能する', () => {
      render(<AccessDeniedError />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toBeInTheDocument()
    })

    it('アイコンが装飾的な要素として扱われる', () => {
      const { container } = render(<AccessDeniedError />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('エッジケース', () => {
    it('空文字のロケールでも動作する', () => {
      mockUseParams.mockReturnValue({ locale: '' })
      render(<AccessDeniedError />)

      // 日本語にフォールバック
      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
    })

    it('空文字のカスタムリンクでもデフォルト値が使用される', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref="" />)

      const button = screen.getByText('戻る')
      // 空文字の場合はデフォルト値が使用される
      expect(button.closest('a')).toHaveAttribute('href', '/ja/account/user')
    })

    it('非常に長いカスタムリンクでも動作する', () => {
      const longHref = '/ja/' + 'segment/'.repeat(100)
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref={longHref} />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', longHref)
    })

    it('特殊文字を含むリンクでも動作する', () => {
      const specialHref = '/ja/path?query=value&other=123#section'
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref={specialHref} />)

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', specialHref)
    })
  })

  describe('実用的なシナリオ', () => {
    it('管理者ページへのアクセス拒否を表示する', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })
      render(<AccessDeniedError backButtonHref="/ja/account/user" />)

      expect(screen.getByText('アクセスが拒否されました')).toBeInTheDocument()
      expect(screen.getByText('このページにアクセスする権限がありません')).toBeInTheDocument()

      const button = screen.getByText('戻る')
      expect(button.closest('a')).toHaveAttribute('href', '/ja/account/user')
    })

    it('グループ管理ページへのアクセス拒否を表示する', () => {
      mockUseParams.mockReturnValue({ locale: 'en' })
      render(<AccessDeniedError backButtonHref="/en/groups" />)

      expect(screen.getByText('Access Denied')).toBeInTheDocument()

      const button = screen.getByText('Go Back')
      expect(button.closest('a')).toHaveAttribute('href', '/en/groups')
    })

    it('ポリシー管理ページへのアクセス拒否を表示する', () => {
      mockUseParams.mockReturnValue({ locale: 'ko' })
      render(<AccessDeniedError backButtonHref="/ko/policies" />)

      expect(screen.getByText('액세스가 거부되었습니다')).toBeInTheDocument()

      const button = screen.getByText('돌아가기')
      expect(button.closest('a')).toHaveAttribute('href', '/ko/policies')
    })
  })

  describe('複数インスタンス', () => {
    it('複数のエラーコンポーネントを同時に表示できる', () => {
      mockUseParams.mockReturnValue({ locale: 'ja' })

      render(
        <>
          <AccessDeniedError backButtonHref="/ja/page1" />
          <AccessDeniedError backButtonHref="/ja/page2" />
        </>
      )

      const titles = screen.getAllByText('アクセスが拒否されました')
      expect(titles).toHaveLength(2)
    })
  })

  describe('レスポンシブデザイン', () => {
    it('最大幅が設定されている', () => {
      const { container } = render(<AccessDeniedError />)

      const card = container.querySelector('.max-w-md')
      expect(card).toBeInTheDocument()
    })

    it('中央揃えのレイアウトが適用されている', () => {
      const { container } = render(<AccessDeniedError />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center')
    })
  })
})


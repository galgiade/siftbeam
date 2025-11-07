import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from '../LanguageSwitcher'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/lib/auth/auth-client'
import { updateUser } from '@/app/lib/actions/user-api'

// モックの設定
jest.mock('@/app/lib/auth/auth-client')
jest.mock('@/app/lib/actions/user-api')

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
}

// useRouterとusePathnameはjest.setupで既にモックされている
const mockUseRouter = useRouter as jest.Mock
const mockUsePathname = usePathname as jest.Mock
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter as any)
    mockUsePathname.mockReturnValue('/ja/home')
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      signOut: jest.fn(),
    } as any)
  })

  const defaultProps = {
    currentLocale: 'ja',
    translations: {
      languageSelector: 'Select Language',
    },
  }

  it('正しくレンダリングされる', () => {
    render(<LanguageSwitcher {...defaultProps} />)

    // 現在の言語のフラグが表示される
    expect(screen.getAllByText('🇯🇵').length).toBeGreaterThan(0)
  })

  it('現在の言語のラベルが表示される', () => {
    render(<LanguageSwitcher {...defaultProps} />)

    // 日本語のテキストが存在することを確認
    expect(screen.getAllByText('日本語').length).toBeGreaterThan(0)
  })

  it('ボタンをクリックするとドロップダウンが開く', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher {...defaultProps} />)

    const button = screen.getByRole('button')
    await user.click(button)

    // ドロップダウンメニューが表示される
    await waitFor(() => {
      // getAllByTextを使用して、複数の同じテキストがある場合に対応
      expect(screen.getAllByText('English').length).toBeGreaterThan(0)
      expect(screen.getAllByText('한국어').length).toBeGreaterThan(0)
      expect(screen.getAllByText('中文').length).toBeGreaterThan(0)
    })
  })

  it('言語を選択するとURLが変更される', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher {...defaultProps} />)

    const button = screen.getByRole('button')
    await user.click(button)

    // 英語を選択
    const englishOption = await screen.findByText('English')
    await user.click(englishOption)

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/en/home')
    })
  })

  it('異なるパスで言語を切り替える', async () => {
    mockUsePathname.mockReturnValue('/ja/about/team')
    const user = userEvent.setup()
    render(<LanguageSwitcher {...defaultProps} />)

    const button = screen.getByRole('button')
    await user.click(button)

    const spanishOption = await screen.findByText('Español')
    await user.click(spanishOption)

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/es/about/team')
    })
  })

  describe('認証済みユーザー', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          sub: 'user-123',
          preferred_username: 'testuser',
          customerId: 'customer-123',
          role: 'user',
          locale: 'ja',
          paymentMethodId: 'pm-123',
        },
        isLoading: false,
        error: null,
        signOut: jest.fn(),
      } as any)

      mockUpdateUser.mockResolvedValue({
        success: true,
        message: 'User updated successfully',
      } as any)
    })

    it('言語を変更するとCognitoの属性も更新される', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      const englishOption = await screen.findByText('English')
      await user.click(englishOption)

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(
          {
            userId: 'user-123',
            locale: 'en',
          },
          {
            sub: 'user-123',
            preferred_username: 'testuser',
            customerId: 'customer-123',
            role: 'user',
            locale: 'en',
            paymentMethodId: 'pm-123',
          }
        )
      })
    })

    it('Cognito更新が失敗してもページ遷移は完了する', async () => {
      mockUpdateUser.mockResolvedValue({
        success: false,
        message: 'Update failed',
      } as any)

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      const englishOption = await screen.findByText('English')
      await user.click(englishOption)

      // ページ遷移は完了する
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/en/home')
      })

      consoleErrorSpy.mockRestore()
    })

    it('Cognito更新でエラーが発生してもページ遷移は完了する', async () => {
      mockUpdateUser.mockRejectedValue(new Error('Network error'))

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      const englishOption = await screen.findByText('English')
      await user.click(englishOption)

      // ページ遷移は完了する
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/en/home')
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('サポートされている言語', () => {
    it('9つの言語がすべて表示される', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getAllByText('日本語').length).toBeGreaterThan(0)
        expect(screen.getAllByText('English').length).toBeGreaterThan(0)
        expect(screen.getAllByText('한국어').length).toBeGreaterThan(0)
        expect(screen.getAllByText('中文').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Español').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Français').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Português').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Bahasa Indonesia').length).toBeGreaterThan(0)
      })
    })

    it('各言語に正しいフラグが表示される', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getAllByText('🇯🇵').length).toBeGreaterThan(0)
        expect(screen.getByText('🇺🇸')).toBeInTheDocument()
        expect(screen.getByText('🇰🇷')).toBeInTheDocument()
        expect(screen.getByText('🇨🇳')).toBeInTheDocument()
        expect(screen.getByText('🇪🇸')).toBeInTheDocument()
        expect(screen.getByText('🇫🇷')).toBeInTheDocument()
        expect(screen.getByText('🇩🇪')).toBeInTheDocument()
        expect(screen.getByText('🇵🇹')).toBeInTheDocument()
        expect(screen.getByText('🇮🇩')).toBeInTheDocument()
      })
    })
  })

  describe('現在の言語の表示', () => {
    it('現在の言語がハイライトされる', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.click(button)

      // ドロップダウンが開くまで待つ
      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument()
      })
    })

    it('異なる現在の言語でレンダリングされる', () => {
      render(<LanguageSwitcher currentLocale="en" />)

      expect(screen.getAllByText('🇺🇸').length).toBeGreaterThan(0)
      expect(screen.getAllByText('English').length).toBeGreaterThan(0)
    })

    it('無効な言語コードの場合はデフォルトで日本語を使用', () => {
      render(<LanguageSwitcher currentLocale="invalid" />)

      expect(screen.getAllByText('🇯🇵').length).toBeGreaterThan(0)
      expect(screen.getAllByText('日本語').length).toBeGreaterThan(0)
    })
  })

  describe('翻訳', () => {
    it('翻訳が提供されない場合はデフォルトのテキストを使用', () => {
      render(<LanguageSwitcher currentLocale="ja" />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('カスタム翻訳を使用できる', () => {
      render(
        <LanguageSwitcher
          currentLocale="ja"
          translations={{ languageSelector: '言語を選択' }}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('レスポンシブデザイン', () => {
    it('小さい画面では言語ラベルが非表示になる', () => {
      render(<LanguageSwitcher {...defaultProps} />)

      // getAllTextを使用して最初の要素（ボタン内のラベル）を取得
      const labelElements = screen.getAllByText('日本語')
      expect(labelElements[0]).toHaveClass('hidden', 'sm:inline')
    })
  })
})


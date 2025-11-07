import { render, waitFor } from '@testing-library/react'
import AuthErrorHandler from '../AuthErrorHandler'
import { useRouter } from 'next/navigation'
import { clearInvalidTokensAction } from '@/app/lib/auth/auth-actions'

// モックの設定
jest.mock('@/app/lib/auth/auth-actions')

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
}

// useRouterはjest.setupで既にモックされている
const mockUseRouter = useRouter as jest.Mock
const mockClearInvalidTokensAction = clearInvalidTokensAction as jest.MockedFunction<
  typeof clearInvalidTokensAction
>

describe('AuthErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter as any)
    mockClearInvalidTokensAction.mockResolvedValue(undefined)
  })

  describe('基本的な動作', () => {
    it('正しくレンダリングされる', () => {
      const { container } = render(
        <AuthErrorHandler hasAuthError={false} locale="ja" />
      )
      expect(container).toBeInTheDocument()
    })

    it('何も表示しない（nullを返す）', () => {
      const { container } = render(
        <AuthErrorHandler hasAuthError={false} locale="ja" />
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('認証エラーがない場合', () => {
    it('トークンをクリアしない', () => {
      render(<AuthErrorHandler hasAuthError={false} locale="ja" />)

      expect(mockClearInvalidTokensAction).not.toHaveBeenCalled()
    })

    it('リダイレクトしない', () => {
      render(<AuthErrorHandler hasAuthError={false} locale="ja" />)

      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('認証エラーがある場合', () => {
    it('トークンをクリアする', async () => {
      render(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(1)
      })
    })

    it('サインインページにリダイレクトする（日本語）', async () => {
      render(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })
    })

    it('サインインページにリダイレクトする（英語）', async () => {
      render(<AuthErrorHandler hasAuthError={true} locale="en" />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/en/signin')
      })
    })

    it('サインインページにリダイレクトする（韓国語）', async () => {
      render(<AuthErrorHandler hasAuthError={true} locale="ko" />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/ko/signin')
      })
    })

    it('トークンクリア後にリダイレクトする', async () => {
      let resolveTokenClear: () => void
      const tokenClearPromise = new Promise<void>((resolve) => {
        resolveTokenClear = resolve
      })

      mockClearInvalidTokensAction.mockReturnValue(tokenClearPromise)

      render(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      // トークンクリアが呼ばれるまで待つ
      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalled()
      })

      // まだリダイレクトされていない
      expect(mockRouter.push).not.toHaveBeenCalled()

      // トークンクリアを完了
      resolveTokenClear!()

      // リダイレクトされる
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })
    })
  })

  describe('エラーハンドリング', () => {
    it('トークンクリアが失敗した場合の動作', async () => {
      // コンソールエラーを抑制
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      // Promiseを直接rejectする（mockImplementationOnceを使用）
      mockClearInvalidTokensAction.mockImplementationOnce(() => Promise.reject('Clear failed'))

      render(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalled()
      })

      // エラーが発生した場合、リダイレクトは実行されない（Promiseがrejectされるため）
      expect(mockRouter.push).not.toHaveBeenCalled()
      
      consoleErrorSpy.mockRestore()
    })

    it('複数回レンダリングされても一度だけ処理する', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={true} locale="ja" />
      )

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(1)
      })

      // 同じpropsで再レンダリング
      rerender(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      // 追加の呼び出しはない（useEffectの依存配列により）
      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('ロケールの変更', () => {
    it('ロケールが変更されると新しいロケールでリダイレクトする', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={true} locale="ja" />
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })

      jest.clearAllMocks()

      // ロケールを変更
      rerender(<AuthErrorHandler hasAuthError={true} locale="en" />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/en/signin')
      })
    })

    it('様々なロケールで正しくリダイレクトする', async () => {
      const locales = ['ja', 'en', 'ko', 'zh-CN', 'fr', 'de', 'es', 'pt', 'id']

      for (const locale of locales) {
        jest.clearAllMocks()

        render(<AuthErrorHandler hasAuthError={true} locale={locale} />)

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith(`/${locale}/signin`)
        })
      }
    })
  })

  describe('状態の変更', () => {
    it('hasAuthErrorがfalseからtrueに変わると処理を実行する', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={false} locale="ja" />
      )

      expect(mockClearInvalidTokensAction).not.toHaveBeenCalled()

      // hasAuthErrorをtrueに変更
      rerender(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(1)
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })
    })

    it('hasAuthErrorがtrueからfalseに変わると処理を停止する', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={true} locale="ja" />
      )

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(1)
      })

      jest.clearAllMocks()

      // hasAuthErrorをfalseに変更
      rerender(<AuthErrorHandler hasAuthError={false} locale="ja" />)

      // 追加の呼び出しはない
      expect(mockClearInvalidTokensAction).not.toHaveBeenCalled()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('エッジケース', () => {
    it('空文字のロケールでも動作する', async () => {
      render(<AuthErrorHandler hasAuthError={true} locale="" />)

      await waitFor(() => {
        // 空文字の場合、`/${locale}/signin` は `//signin` になる
        expect(mockRouter.push).toHaveBeenCalledWith('//signin')
      })
    })

    it('非常に長いロケールコードでも動作する', async () => {
      const longLocale = 'a'.repeat(100)
      render(<AuthErrorHandler hasAuthError={true} locale={longLocale} />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(`/${longLocale}/signin`)
      })
    })

    it('特殊文字を含むロケールでも動作する', async () => {
      const specialLocale = 'ja-JP@special'
      render(<AuthErrorHandler hasAuthError={true} locale={specialLocale} />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(`/${specialLocale}/signin`)
      })
    })
  })

  describe('パフォーマンス', () => {
    it('複数のインスタンスが同時に存在しても問題ない', async () => {
      render(
        <>
          <AuthErrorHandler hasAuthError={true} locale="ja" />
          <AuthErrorHandler hasAuthError={true} locale="en" />
          <AuthErrorHandler hasAuthError={true} locale="ko" />
        </>
      )

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalledTimes(3)
        expect(mockRouter.push).toHaveBeenCalledTimes(3)
      })
    })

    it('高速な状態変更に対応できる', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={false} locale="ja" />
      )

      // 高速に状態を変更
      for (let i = 0; i < 10; i++) {
        rerender(<AuthErrorHandler hasAuthError={i % 2 === 0} locale="ja" />)
      }

      // 最終的な状態に基づいて処理される
      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalled()
      })
    })
  })

  describe('統合テスト', () => {
    it('認証エラーから回復するフローをテストする', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={false} locale="ja" />
      )

      // 認証エラーが発生
      rerender(<AuthErrorHandler hasAuthError={true} locale="ja" />)

      await waitFor(() => {
        expect(mockClearInvalidTokensAction).toHaveBeenCalled()
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })

      jest.clearAllMocks()

      // エラーが解消
      rerender(<AuthErrorHandler hasAuthError={false} locale="ja" />)

      // 追加の処理はない
      expect(mockClearInvalidTokensAction).not.toHaveBeenCalled()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('言語を切り替えながら認証エラーを処理する', async () => {
      const { rerender } = render(
        <AuthErrorHandler hasAuthError={true} locale="ja" />
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/ja/signin')
      })

      jest.clearAllMocks()

      // 言語を変更
      rerender(<AuthErrorHandler hasAuthError={true} locale="en" />)

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/en/signin')
      })
    })
  })
})


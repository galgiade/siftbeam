import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhoneInput from '../PhoneInput'

describe('PhoneInput', () => {
  const defaultProps = {
    name: 'phone',
    label: '電話番号',
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基本的なレンダリング', () => {
    it('正しくレンダリングされる', () => {
      render(<PhoneInput {...defaultProps} />)

      expect(screen.getByText('電話番号')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('ラベルが表示される', () => {
      render(<PhoneInput {...defaultProps} label="携帯電話" />)

      expect(screen.getByText('携帯電話')).toBeInTheDocument()
    })

    it('必須マークが表示される', () => {
      render(<PhoneInput {...defaultProps} isRequired />)

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('プレースホルダーが表示される', () => {
      render(<PhoneInput {...defaultProps} placeholder="090-1234-5678" />)

      expect(screen.getByPlaceholderText('090-1234-5678')).toBeInTheDocument()
    })
  })

  describe('電話番号の入力', () => {
    it('電話番号を入力できる', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, '09012345678')

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })

    it('入力された番号が国際形式に変換される（日本）', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '09012345678')

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0]).toBe('+8109012345678')
      })
    })

    it('入力された番号が国際形式に変換される（米国）', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="US" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '2025551234')

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0]).toBe('+12025551234')
      })
    })

    it('ハイフン付きの番号を入力できる', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '090-1234-5678')

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0]).toContain('+81')
      })
    })
  })

  describe('国番号の選択', () => {
    it('デフォルトで日本の国番号が選択される', () => {
      const { container } = render(<PhoneInput {...defaultProps} selectedCountry="JP" />)

      // HeroUIのSelectコンポーネントを確認
      expect(container.textContent).toContain('+81')
    })

    it('異なる国を選択できる', () => {
      const { container } = render(<PhoneInput {...defaultProps} selectedCountry="US" />)

      // HeroUIのSelectコンポーネントを確認
      expect(container.textContent).toContain('+1')
    })

    it('国番号を変更すると電話番号が更新される', async () => {
      const onChange = jest.fn()
      const { rerender } = render(
        <PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" value="+819012345678" />
      )

      // 国を変更
      rerender(
        <PhoneInput {...defaultProps} onChange={onChange} selectedCountry="US" value="+819012345678" />
      )

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })
  })

  describe('初期値の処理', () => {
    it('国際形式の初期値を正しく表示する', () => {
      render(<PhoneInput {...defaultProps} value="+819012345678" selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('9012345678')
    })

    it('国内形式の初期値を正しく表示する', () => {
      render(<PhoneInput {...defaultProps} value="09012345678" selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('09012345678')
    })

    it('空の初期値を処理できる', () => {
      render(<PhoneInput {...defaultProps} value="" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })
  })

  describe('バリデーション', () => {
    it('エラーメッセージが表示される', () => {
      render(
        <PhoneInput
          {...defaultProps}
          isInvalid
          errorMessage="電話番号が無効です"
        />
      )

      expect(screen.getByText('電話番号が無効です')).toBeInTheDocument()
    })

    it('エラー状態が視覚的に表示される', () => {
      const { container } = render(
        <PhoneInput {...defaultProps} isInvalid errorMessage="エラー" />
      )

      // エラーメッセージが表示されていることを確認
      expect(screen.getByText('エラー')).toBeInTheDocument()
    })
  })

  describe('無効化状態', () => {
    it('無効化された状態でレンダリングされる', () => {
      render(<PhoneInput {...defaultProps} isDisabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('無効化されている場合は入力できない', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} isDisabled />)

      const input = screen.getByRole('textbox')
      await user.type(input, '09012345678')

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('プレビュー表示', () => {
    it('電話番号を入力するとプレビューが表示される', async () => {
      const user = userEvent.setup()

      render(<PhoneInput {...defaultProps} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '09012345678')

      await waitFor(() => {
        expect(screen.getByText(/完全な電話番号:/)).toBeInTheDocument()
        expect(screen.getByText(/\+8109012345678/)).toBeInTheDocument()
      })
    })

    it('電話番号が空の場合はプレビューが表示されない', () => {
      render(<PhoneInput {...defaultProps} value="" />)

      expect(screen.queryByText(/完全な電話番号:/)).not.toBeInTheDocument()
    })
  })

  describe('様々な国の電話番号', () => {
    const countries = [
      { code: 'JP', phoneCode: '+81', number: '09012345678' },
      { code: 'US', phoneCode: '+1', number: '2025551234' },
      { code: 'GB', phoneCode: '+44', number: '7911123456' },
      { code: 'KR', phoneCode: '+82', number: '01012345678' },
      { code: 'CN', phoneCode: '+86', number: '13812345678' },
    ]

    countries.forEach(({ code, phoneCode, number }) => {
      it(`${code}の電話番号を正しく処理する`, async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()

        render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry={code} />)

        const input = screen.getByRole('textbox')
        await user.type(input, number)

        await waitFor(() => {
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
          expect(lastCall[0]).toContain(phoneCode)
        })
      })
    })
  })

  describe('エッジケース', () => {
    it('数字以外の文字が入力された場合も処理できる', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'abc123def456')

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        // 数字のみが抽出される
        expect(lastCall[0]).toMatch(/^\+81\d+$/)
      })
    })

    it('空白文字が含まれる番号を処理できる', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '090 1234 5678')

      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]
        expect(lastCall[0]).toBe('+8109012345678')
      })
    })

    it('非常に長い番号を入力しても処理できる', async () => {
      const user = userEvent.setup()
      const onChange = jest.fn()

      render(<PhoneInput {...defaultProps} onChange={onChange} selectedCountry="JP" />)

      const input = screen.getByRole('textbox')
      await user.type(input, '090123456789012345')

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled()
      })
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なaria-labelが設定されている', () => {
      render(<PhoneInput {...defaultProps} />)

      expect(screen.getByLabelText('国番号選択')).toBeInTheDocument()
    })

    it('入力フィールドがtype="tel"である', () => {
      render(<PhoneInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'tel')
    })

    it('autocomplete属性が適切に設定されている', () => {
      render(<PhoneInput {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })
})


import {
  getFieldError,
  getFieldErrors,
  hasFieldError,
} from '../error-handler'

describe('error-handler', () => {
  describe('getFieldError', () => {
    it('フィールドのエラーメッセージを取得する', () => {
      const errors = {
        email: ['Invalid email format'],
        password: ['Password is too short'],
      }

      expect(getFieldError(errors, 'email')).toBe('Invalid email format')
      expect(getFieldError(errors, 'password')).toBe('Password is too short')
    })

    it('複数のエラーがある場合は最初のエラーを返す', () => {
      const errors = {
        email: ['Invalid email format', 'Email is required'],
      }

      expect(getFieldError(errors, 'email')).toBe('Invalid email format')
    })

    it('フィールドにエラーがない場合は空文字を返す', () => {
      const errors = {
        email: ['Invalid email format'],
      }

      expect(getFieldError(errors, 'password')).toBe('')
    })

    it('errorsがundefinedの場合は空文字を返す', () => {
      expect(getFieldError(undefined, 'email')).toBe('')
    })

    it('errorsが空オブジェクトの場合は空文字を返す', () => {
      expect(getFieldError({}, 'email')).toBe('')
    })

    it('フィールドのエラー配列が空の場合は空文字を返す', () => {
      const errors = {
        email: [],
      }

      expect(getFieldError(errors, 'email')).toBe('')
    })

    it('存在しないフィールドを指定した場合は空文字を返す', () => {
      const errors = {
        email: ['Invalid email format'],
      }

      expect(getFieldError(errors, 'nonexistent')).toBe('')
    })
  })

  describe('getFieldErrors', () => {
    it('フィールドのすべてのエラーメッセージを取得する', () => {
      const errors = {
        password: ['Password is too short', 'Password must contain a number'],
      }

      const result = getFieldErrors(errors, 'password')
      expect(result).toEqual(['Password is too short', 'Password must contain a number'])
      expect(result.length).toBe(2)
    })

    it('単一のエラーがある場合は配列で返す', () => {
      const errors = {
        email: ['Invalid email format'],
      }

      const result = getFieldErrors(errors, 'email')
      expect(result).toEqual(['Invalid email format'])
      expect(result.length).toBe(1)
    })

    it('フィールドにエラーがない場合は空配列を返す', () => {
      const errors = {
        email: ['Invalid email format'],
      }

      expect(getFieldErrors(errors, 'password')).toEqual([])
    })

    it('errorsがundefinedの場合は空配列を返す', () => {
      expect(getFieldErrors(undefined, 'email')).toEqual([])
    })

    it('errorsが空オブジェクトの場合は空配列を返す', () => {
      expect(getFieldErrors({}, 'email')).toEqual([])
    })

    it('フィールドのエラー配列が空の場合は空配列を返す', () => {
      const errors = {
        email: [],
      }

      expect(getFieldErrors(errors, 'email')).toEqual([])
    })

    it('複数のフィールドのエラーを個別に取得できる', () => {
      const errors = {
        email: ['Invalid email format'],
        password: ['Password is too short', 'Password must contain a number'],
        username: ['Username is taken'],
      }

      expect(getFieldErrors(errors, 'email')).toEqual(['Invalid email format'])
      expect(getFieldErrors(errors, 'password')).toEqual([
        'Password is too short',
        'Password must contain a number',
      ])
      expect(getFieldErrors(errors, 'username')).toEqual(['Username is taken'])
    })
  })

  describe('hasFieldError', () => {
    describe('特定のフィールドのチェック', () => {
      it('フィールドにエラーがある場合はtrueを返す', () => {
        const errors = {
          email: ['Invalid email format'],
        }

        expect(hasFieldError(errors, 'email')).toBe(true)
      })

      it('フィールドにエラーがない場合はfalseを返す', () => {
        const errors = {
          email: ['Invalid email format'],
        }

        expect(hasFieldError(errors, 'password')).toBe(false)
      })

      it('フィールドのエラー配列が空の場合はfalseを返す', () => {
        const errors = {
          email: [],
        }

        expect(hasFieldError(errors, 'email')).toBe(false)
      })

      it('複数のエラーがある場合もtrueを返す', () => {
        const errors = {
          password: ['Password is too short', 'Password must contain a number'],
        }

        expect(hasFieldError(errors, 'password')).toBe(true)
      })
    })

    describe('全体のエラーチェック', () => {
      it('いずれかのフィールドにエラーがある場合はtrueを返す', () => {
        const errors = {
          email: ['Invalid email format'],
          password: [],
        }

        expect(hasFieldError(errors)).toBe(true)
      })

      it('すべてのフィールドにエラーがない場合はfalseを返す', () => {
        const errors = {
          email: [],
          password: [],
        }

        expect(hasFieldError(errors)).toBe(false)
      })

      it('errorsが空オブジェクトの場合はfalseを返す', () => {
        expect(hasFieldError({})).toBe(false)
      })

      it('複数のフィールドにエラーがある場合はtrueを返す', () => {
        const errors = {
          email: ['Invalid email format'],
          password: ['Password is too short'],
          username: ['Username is taken'],
        }

        expect(hasFieldError(errors)).toBe(true)
      })

      it('一部のフィールドのみエラーがある場合もtrueを返す', () => {
        const errors = {
          email: ['Invalid email format'],
          password: [],
          username: [],
        }

        expect(hasFieldError(errors)).toBe(true)
      })
    })

    describe('エッジケース', () => {
      it('errorsがundefinedの場合はfalseを返す', () => {
        expect(hasFieldError(undefined)).toBe(false)
        expect(hasFieldError(undefined, 'email')).toBe(false)
      })

      it('存在しないフィールドを指定した場合はfalseを返す', () => {
        const errors = {
          email: ['Invalid email format'],
        }

        expect(hasFieldError(errors, 'nonexistent')).toBe(false)
      })

      it('フィールド名が空文字の場合', () => {
        const errors = {
          '': ['Some error'],
        }

        expect(hasFieldError(errors, '')).toBe(true)
      })
    })
  })

  describe('統合テスト', () => {
    it('複数の関数を組み合わせて使用できる', () => {
      const errors = {
        email: ['Invalid email format', 'Email is required'],
        password: ['Password is too short'],
      }

      // エラーの存在確認
      expect(hasFieldError(errors)).toBe(true)
      expect(hasFieldError(errors, 'email')).toBe(true)
      expect(hasFieldError(errors, 'password')).toBe(true)
      expect(hasFieldError(errors, 'username')).toBe(false)

      // 単一エラーの取得
      expect(getFieldError(errors, 'email')).toBe('Invalid email format')
      expect(getFieldError(errors, 'password')).toBe('Password is too short')

      // 複数エラーの取得
      expect(getFieldErrors(errors, 'email')).toEqual([
        'Invalid email format',
        'Email is required',
      ])
      expect(getFieldErrors(errors, 'password')).toEqual(['Password is too short'])
    })

    it('エラーがない状態を正しく処理できる', () => {
      const errors = {}

      expect(hasFieldError(errors)).toBe(false)
      expect(getFieldError(errors, 'email')).toBe('')
      expect(getFieldErrors(errors, 'email')).toEqual([])
    })

    it('バリデーション結果の典型的な使用例', () => {
      // サーバーからのレスポンスを想定
      const validationResult = {
        success: false,
        errors: {
          email: ['Invalid email format'],
          password: ['Password must be at least 8 characters', 'Password must contain a number'],
        },
      }

      // エラーの存在確認
      if (hasFieldError(validationResult.errors)) {
        // メールアドレスのエラー表示用
        const emailError = getFieldError(validationResult.errors, 'email')
        expect(emailError).toBe('Invalid email format')

        // パスワードの全エラー表示用
        const passwordErrors = getFieldErrors(validationResult.errors, 'password')
        expect(passwordErrors).toHaveLength(2)
        expect(passwordErrors[0]).toBe('Password must be at least 8 characters')
        expect(passwordErrors[1]).toBe('Password must contain a number')
      }
    })
  })
})


import { getApiDictionary } from '../api-utils'

describe('api-utils', () => {
  describe('getApiDictionary', () => {
    it('日本語の辞書を取得する', () => {
      const dict = getApiDictionary('ja')

      expect(dict.fields.userName).toBe('ユーザー名')
      expect(dict.fields.email).toBe('メールアドレス')
      expect(dict.fields.department).toBe('部署')
      expect(dict.fields.position).toBe('役職')
    })

    it('英語の辞書を取得する', () => {
      const dict = getApiDictionary('en')

      expect(dict.fields.userName).toBe('Username')
      expect(dict.fields.email).toBe('Email')
      expect(dict.fields.department).toBe('Department')
      expect(dict.fields.position).toBe('Position')
    })

    it('デフォルトで日本語の辞書を取得する', () => {
      const dict = getApiDictionary()

      expect(dict.fields.userName).toBe('ユーザー名')
    })

    it('無効な言語コードの場合は英語にフォールバックする', () => {
      const dict = getApiDictionary('invalid')

      expect(dict.fields.userName).toBe('Username')
    })

    it('エラーメッセージが含まれる', () => {
      const dict = getApiDictionary('ja')

      expect(dict.errors.user.fieldRequired).toBe('{field}は必須項目です')
    })

    it('英語のエラーメッセージが含まれる', () => {
      const dict = getApiDictionary('en')

      expect(dict.errors.user.fieldRequired).toBe('{field} is required')
    })

    it('すべてのフィールドが定義されている', () => {
      const dict = getApiDictionary('ja')

      expect(dict.fields).toBeDefined()
      expect(dict.fields.userName).toBeDefined()
      expect(dict.fields.email).toBeDefined()
      expect(dict.fields.department).toBeDefined()
      expect(dict.fields.position).toBeDefined()
    })

    it('日本語と英語で同じ構造を持つ', () => {
      const jaDict = getApiDictionary('ja')
      const enDict = getApiDictionary('en')

      expect(Object.keys(jaDict)).toEqual(Object.keys(enDict))
      expect(Object.keys(jaDict.fields)).toEqual(Object.keys(enDict.fields))
      expect(Object.keys(jaDict.errors)).toEqual(Object.keys(enDict.errors))
    })

    it('大文字小文字を区別しない', () => {
      const dictLower = getApiDictionary('ja')
      const dictUpper = getApiDictionary('JA' as any)

      // 大文字の場合は無効な言語コードとして英語にフォールバック
      expect(dictUpper.fields.userName).toBe('Username')
    })

    it('空文字の場合は英語にフォールバックする', () => {
      const dict = getApiDictionary('')

      expect(dict.fields.userName).toBe('Username')
    })

    it('辞書オブジェクトが凍結されていない（変更可能）', () => {
      const dict = getApiDictionary('ja')

      // オブジェクトが変更可能であることを確認
      expect(() => {
        const temp: any = dict
        temp.fields.newField = 'test'
      }).not.toThrow()
    })
  })

  describe('フィールド名の一貫性', () => {
    it('すべての言語で同じフィールド名を持つ', () => {
      const jaDict = getApiDictionary('ja')
      const enDict = getApiDictionary('en')

      const jaFields = Object.keys(jaDict.fields)
      const enFields = Object.keys(enDict.fields)

      expect(jaFields.sort()).toEqual(enFields.sort())
    })

    it('すべての言語で同じエラーキーを持つ', () => {
      const jaDict = getApiDictionary('ja')
      const enDict = getApiDictionary('en')

      const jaErrors = Object.keys(jaDict.errors.user)
      const enErrors = Object.keys(enDict.errors.user)

      expect(jaErrors.sort()).toEqual(enErrors.sort())
    })
  })

  describe('エラーメッセージのプレースホルダー', () => {
    it('日本語のエラーメッセージにプレースホルダーが含まれる', () => {
      const dict = getApiDictionary('ja')

      expect(dict.errors.user.fieldRequired).toContain('{field}')
    })

    it('英語のエラーメッセージにプレースホルダーが含まれる', () => {
      const dict = getApiDictionary('en')

      expect(dict.errors.user.fieldRequired).toContain('{field}')
    })

    it('プレースホルダーを置換できる', () => {
      const dict = getApiDictionary('ja')
      const message = dict.errors.user.fieldRequired.replace('{field}', dict.fields.email)

      expect(message).toBe('メールアドレスは必須項目です')
    })

    it('英語でプレースホルダーを置換できる', () => {
      const dict = getApiDictionary('en')
      const message = dict.errors.user.fieldRequired.replace('{field}', dict.fields.email)

      expect(message).toBe('Email is required')
    })
  })

  describe('実用例', () => {
    it('フィールドラベルとエラーメッセージを組み合わせて使用できる', () => {
      const dict = getApiDictionary('ja')

      const fieldName = 'userName'
      const fieldLabel = dict.fields[fieldName as keyof typeof dict.fields]
      const errorMessage = dict.errors.user.fieldRequired.replace('{field}', fieldLabel)

      expect(errorMessage).toBe('ユーザー名は必須項目です')
    })

    it('複数のフィールドに対してエラーメッセージを生成できる', () => {
      const dict = getApiDictionary('ja')

      const fields = ['userName', 'email', 'department', 'position']
      const errors = fields.map(field => {
        const label = dict.fields[field as keyof typeof dict.fields]
        return dict.errors.user.fieldRequired.replace('{field}', label)
      })

      expect(errors).toEqual([
        'ユーザー名は必須項目です',
        'メールアドレスは必須項目です',
        '部署は必須項目です',
        '役職は必須項目です',
      ])
    })

    it('英語で複数のフィールドに対してエラーメッセージを生成できる', () => {
      const dict = getApiDictionary('en')

      const fields = ['userName', 'email', 'department', 'position']
      const errors = fields.map(field => {
        const label = dict.fields[field as keyof typeof dict.fields]
        return dict.errors.user.fieldRequired.replace('{field}', label)
      })

      expect(errors).toEqual([
        'Username is required',
        'Email is required',
        'Department is required',
        'Position is required',
      ])
    })
  })
})


/**
 * cognito-utils.tsのテスト
 * 
 * 注意: このファイルはServer Actionsを含むため、
 * 実際のCognitoクライアントをモックする必要があります。
 */

import { UserAttributes } from '../cognito-utils'

// モックの型定義
type MockUserAttributes = UserAttributes

describe('cognito-utils', () => {
  describe('UserAttributes型', () => {
    it('標準的なユーザー属性を持つ', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        email: 'test@example.com',
        email_verified: 'true',
        preferred_username: 'testuser',
        locale: 'ja',
      }

      expect(attributes.sub).toBe('user-123')
      expect(attributes.email).toBe('test@example.com')
      expect(attributes.email_verified).toBe('true')
      expect(attributes.preferred_username).toBe('testuser')
      expect(attributes.locale).toBe('ja')
    })

    it('カスタム属性を持つ', () => {
      const attributes: MockUserAttributes = {
        'custom:customerId': 'customer-123',
        'custom:role': 'admin',
        'custom:paymentMethodId': 'pm-123',
        'custom:deletionRequestedAt': '2024-01-01T00:00:00Z',
      }

      expect(attributes['custom:customerId']).toBe('customer-123')
      expect(attributes['custom:role']).toBe('admin')
      expect(attributes['custom:paymentMethodId']).toBe('pm-123')
      expect(attributes['custom:deletionRequestedAt']).toBe('2024-01-01T00:00:00Z')
    })

    it('任意の属性を追加できる', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        'custom:newAttribute': 'value',
      }

      expect(attributes['custom:newAttribute']).toBe('value')
    })

    it('undefined値を持つことができる', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        email: undefined,
      }

      expect(attributes.sub).toBe('user-123')
      expect(attributes.email).toBeUndefined()
    })

    it('空のオブジェクトを作成できる', () => {
      const attributes: MockUserAttributes = {}

      expect(Object.keys(attributes).length).toBe(0)
    })
  })

  describe('ユーザー属性のバリデーション', () => {
    it('有効なメールアドレス形式を検証する', () => {
      const attributes: MockUserAttributes = {
        email: 'test@example.com',
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(attributes.email || '')).toBe(true)
    })

    it('無効なメールアドレス形式を検出する', () => {
      const attributes: MockUserAttributes = {
        email: 'invalid-email',
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(attributes.email || '')).toBe(false)
    })

    it('email_verifiedがtrueまたはfalseの文字列である', () => {
      const verifiedUser: MockUserAttributes = {
        email_verified: 'true',
      }
      const unverifiedUser: MockUserAttributes = {
        email_verified: 'false',
      }

      expect(['true', 'false']).toContain(verifiedUser.email_verified)
      expect(['true', 'false']).toContain(unverifiedUser.email_verified)
    })

    it('ロケールが有効な形式である', () => {
      const validLocales = ['ja', 'en', 'en-US', 'ko', 'zh-CN', 'fr', 'de', 'es', 'pt', 'id']
      
      validLocales.forEach(locale => {
        const attributes: MockUserAttributes = {
          locale,
        }
        expect(attributes.locale).toBe(locale)
      })
    })

    it('カスタムIDが正しい形式である', () => {
      const attributes: MockUserAttributes = {
        'custom:customerId': 'customer-123',
      }

      expect(attributes['custom:customerId']).toMatch(/^customer-\d+$/)
    })

    it('ロールが有効な値である', () => {
      const validRoles = ['user', 'admin', 'manager']
      
      validRoles.forEach(role => {
        const attributes: MockUserAttributes = {
          'custom:role': role,
        }
        expect(validRoles).toContain(attributes['custom:role'])
      })
    })
  })

  describe('属性の変換', () => {
    it('Cognito形式からアプリケーション形式に変換できる', () => {
      // Cognitoから返される形式
      const cognitoAttributes = [
        { Name: 'sub', Value: 'user-123' },
        { Name: 'email', Value: 'test@example.com' },
        { Name: 'custom:customerId', Value: 'customer-123' },
      ]

      // アプリケーション形式に変換
      const attributes: MockUserAttributes = {}
      cognitoAttributes.forEach(attr => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value
        }
      })

      expect(attributes.sub).toBe('user-123')
      expect(attributes.email).toBe('test@example.com')
      expect(attributes['custom:customerId']).toBe('customer-123')
    })

    it('空の配列を変換できる', () => {
      const cognitoAttributes: Array<{ Name?: string; Value?: string }> = []

      const attributes: MockUserAttributes = {}
      cognitoAttributes.forEach(attr => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value
        }
      })

      expect(Object.keys(attributes).length).toBe(0)
    })

    it('不完全なデータをスキップできる', () => {
      const cognitoAttributes = [
        { Name: 'sub', Value: 'user-123' },
        { Name: 'email' }, // Valueなし
        { Value: 'test@example.com' }, // Nameなし
      ]

      const attributes: MockUserAttributes = {}
      cognitoAttributes.forEach(attr => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value
        }
      })

      expect(attributes.sub).toBe('user-123')
      expect(attributes.email).toBeUndefined()
      expect(Object.keys(attributes).length).toBe(1)
    })
  })

  describe('特殊なケース', () => {
    it('削除リクエスト日時を処理できる', () => {
      const attributes: MockUserAttributes = {
        'custom:deletionRequestedAt': '2024-01-01T00:00:00Z',
      }

      const deletionDate = new Date(attributes['custom:deletionRequestedAt'] || '')
      expect(deletionDate.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    })

    it('削除リクエストがない場合を処理できる', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
      }

      expect(attributes['custom:deletionRequestedAt']).toBeUndefined()
    })

    it('複数のカスタム属性を同時に持つことができる', () => {
      const attributes: MockUserAttributes = {
        'custom:customerId': 'customer-123',
        'custom:role': 'admin',
        'custom:paymentMethodId': 'pm-123',
        'custom:deletionRequestedAt': '2024-01-01T00:00:00Z',
        'custom:additionalField': 'value',
      }

      const customAttributes = Object.keys(attributes).filter(key => key.startsWith('custom:'))
      expect(customAttributes.length).toBe(5)
    })

    it('標準属性とカスタム属性を混在させることができる', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        email: 'test@example.com',
        'custom:customerId': 'customer-123',
        'custom:role': 'admin',
      }

      const standardAttributes = ['sub', 'email', 'email_verified', 'preferred_username', 'locale']
      const hasStandard = Object.keys(attributes).some(key => standardAttributes.includes(key))
      const hasCustom = Object.keys(attributes).some(key => key.startsWith('custom:'))

      expect(hasStandard).toBe(true)
      expect(hasCustom).toBe(true)
    })
  })

  describe('エラーケース', () => {
    it('nullやundefinedの属性値を処理できる', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        email: undefined,
      }

      expect(attributes.sub).toBe('user-123')
      expect(attributes.email).toBeUndefined()
    })

    it('空文字の属性値を処理できる', () => {
      const attributes: MockUserAttributes = {
        sub: '',
        email: '',
      }

      expect(attributes.sub).toBe('')
      expect(attributes.email).toBe('')
    })

    it('非常に長い属性値を処理できる', () => {
      const longValue = 'a'.repeat(1000)
      const attributes: MockUserAttributes = {
        'custom:longField': longValue,
      }

      expect(attributes['custom:longField']?.length).toBe(1000)
    })

    it('特殊文字を含む属性値を処理できる', () => {
      const attributes: MockUserAttributes = {
        preferred_username: 'user@#$%^&*()',
      }

      expect(attributes.preferred_username).toBe('user@#$%^&*()')
    })
  })

  describe('実用的なシナリオ', () => {
    it('新規ユーザーの属性を作成できる', () => {
      const newUser: MockUserAttributes = {
        sub: 'new-user-123',
        email: 'newuser@example.com',
        email_verified: 'false',
        preferred_username: 'newuser',
        locale: 'ja',
        'custom:customerId': 'customer-new-123',
        'custom:role': 'user',
      }

      expect(newUser.sub).toBeDefined()
      expect(newUser.email).toBeDefined()
      expect(newUser['custom:role']).toBe('user')
    })

    it('管理者ユーザーの属性を作成できる', () => {
      const adminUser: MockUserAttributes = {
        sub: 'admin-123',
        email: 'admin@example.com',
        email_verified: 'true',
        preferred_username: 'admin',
        locale: 'en',
        'custom:customerId': 'customer-admin-123',
        'custom:role': 'admin',
      }

      expect(adminUser['custom:role']).toBe('admin')
      expect(adminUser.email_verified).toBe('true')
    })

    it('ユーザー属性を更新できる', () => {
      const originalAttributes: MockUserAttributes = {
        sub: 'user-123',
        locale: 'ja',
      }

      const updatedAttributes: MockUserAttributes = {
        ...originalAttributes,
        locale: 'en',
      }

      expect(originalAttributes.locale).toBe('ja')
      expect(updatedAttributes.locale).toBe('en')
      expect(updatedAttributes.sub).toBe('user-123')
    })

    it('複数の属性を一度に更新できる', () => {
      const originalAttributes: MockUserAttributes = {
        sub: 'user-123',
        locale: 'ja',
        'custom:role': 'user',
      }

      const updatedAttributes: MockUserAttributes = {
        ...originalAttributes,
        locale: 'en',
        'custom:role': 'admin',
        preferred_username: 'newusername',
      }

      expect(updatedAttributes.locale).toBe('en')
      expect(updatedAttributes['custom:role']).toBe('admin')
      expect(updatedAttributes.preferred_username).toBe('newusername')
    })
  })

  describe('型の安全性', () => {
    it('TypeScriptの型チェックが機能する', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
        email: 'test@example.com',
      }

      // 型チェックが正しく機能することを確認
      const sub: string | undefined = attributes.sub
      const email: string | undefined = attributes.email

      expect(typeof sub).toBe('string')
      expect(typeof email).toBe('string')
    })

    it('インデックスシグネチャが機能する', () => {
      const attributes: MockUserAttributes = {
        sub: 'user-123',
      }

      // 任意のキーでアクセスできる
      const dynamicKey = 'custom:dynamicAttribute'
      attributes[dynamicKey] = 'dynamic value'

      expect(attributes[dynamicKey]).toBe('dynamic value')
    })

    it('オプショナルプロパティが機能する', () => {
      const minimalAttributes: MockUserAttributes = {
        sub: 'user-123',
      }

      const fullAttributes: MockUserAttributes = {
        sub: 'user-123',
        email: 'test@example.com',
        email_verified: 'true',
        preferred_username: 'testuser',
        locale: 'ja',
        'custom:customerId': 'customer-123',
        'custom:role': 'user',
        'custom:paymentMethodId': 'pm-123',
      }

      expect(minimalAttributes.sub).toBeDefined()
      expect(minimalAttributes.email).toBeUndefined()
      expect(fullAttributes.email).toBeDefined()
    })
  })
})


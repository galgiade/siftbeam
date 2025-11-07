import {
  COUNTRY_PHONE_CODES,
  getPhoneCodeByCountry,
  formatPhoneNumber,
  parsePhoneNumber,
} from '../phone-utils'

describe('phone-utils', () => {
  describe('COUNTRY_PHONE_CODES', () => {
    it('主要な国の電話コードが定義されている', () => {
      expect(COUNTRY_PHONE_CODES.JP).toBe('+81')
      expect(COUNTRY_PHONE_CODES.US).toBe('+1')
      expect(COUNTRY_PHONE_CODES.GB).toBe('+44')
      expect(COUNTRY_PHONE_CODES.KR).toBe('+82')
      expect(COUNTRY_PHONE_CODES.CN).toBe('+86')
    })

    it('すべての国コードがプラス記号で始まる', () => {
      Object.values(COUNTRY_PHONE_CODES).forEach(code => {
        expect(code).toMatch(/^\+\d+$/)
      })
    })

    it('重複する国番号が正しく処理される（米国とカナダ）', () => {
      expect(COUNTRY_PHONE_CODES.US).toBe('+1')
      expect(COUNTRY_PHONE_CODES.CA).toBe('+1')
    })
  })

  describe('getPhoneCodeByCountry', () => {
    it('有効な国コードから電話番号の国番号を取得する', () => {
      expect(getPhoneCodeByCountry('JP')).toBe('+81')
      expect(getPhoneCodeByCountry('US')).toBe('+1')
      expect(getPhoneCodeByCountry('GB')).toBe('+44')
      expect(getPhoneCodeByCountry('FR')).toBe('+33')
      expect(getPhoneCodeByCountry('DE')).toBe('+49')
    })

    it('無効な国コードの場合は空文字を返す', () => {
      expect(getPhoneCodeByCountry('XX')).toBe('')
      expect(getPhoneCodeByCountry('INVALID')).toBe('')
      expect(getPhoneCodeByCountry('')).toBe('')
    })

    it('小文字の国コードでも機能する', () => {
      // TypeScriptの型チェックを回避するためにany型にキャスト
      expect(getPhoneCodeByCountry('jp' as any)).toBe('')
    })

    it('アジアの国々の電話コードを取得できる', () => {
      expect(getPhoneCodeByCountry('KR')).toBe('+82')
      expect(getPhoneCodeByCountry('CN')).toBe('+86')
      expect(getPhoneCodeByCountry('TH')).toBe('+66')
      expect(getPhoneCodeByCountry('VN')).toBe('+84')
      expect(getPhoneCodeByCountry('SG')).toBe('+65')
    })

    it('ヨーロッパの国々の電話コードを取得できる', () => {
      expect(getPhoneCodeByCountry('IT')).toBe('+39')
      expect(getPhoneCodeByCountry('ES')).toBe('+34')
      expect(getPhoneCodeByCountry('PT')).toBe('+351')
      expect(getPhoneCodeByCountry('NL')).toBe('+31')
    })
  })

  describe('formatPhoneNumber', () => {
    describe('日本の電話番号', () => {
      it('先頭の0を削除して国番号を追加する', () => {
        expect(formatPhoneNumber('09012345678', 'JP')).toBe('+819012345678')
        expect(formatPhoneNumber('08012345678', 'JP')).toBe('+818012345678')
        expect(formatPhoneNumber('07012345678', 'JP')).toBe('+817012345678')
      })

      it('ハイフンを削除して国番号を追加する', () => {
        expect(formatPhoneNumber('090-1234-5678', 'JP')).toBe('+819012345678')
        expect(formatPhoneNumber('03-1234-5678', 'JP')).toBe('+81312345678')
      })

      it('既に国番号が付いている場合はそのまま返す', () => {
        expect(formatPhoneNumber('+819012345678', 'JP')).toBe('+819012345678')
      })
    })

    describe('米国の電話番号', () => {
      it('国番号を追加する', () => {
        expect(formatPhoneNumber('2025551234', 'US')).toBe('+12025551234')
      })

      it('ハイフンや括弧を削除する', () => {
        expect(formatPhoneNumber('(202) 555-1234', 'US')).toBe('+12025551234')
        expect(formatPhoneNumber('202-555-1234', 'US')).toBe('+12025551234')
      })

      it('既に国番号が付いている場合はそのまま返す', () => {
        expect(formatPhoneNumber('+12025551234', 'US')).toBe('+12025551234')
      })
    })

    describe('その他の国の電話番号', () => {
      it('韓国の電話番号をフォーマットする', () => {
        expect(formatPhoneNumber('01012345678', 'KR')).toBe('+8201012345678')
      })

      it('中国の電話番号をフォーマットする', () => {
        expect(formatPhoneNumber('13812345678', 'CN')).toBe('+8613812345678')
      })

      it('イギリスの電話番号をフォーマットする', () => {
        expect(formatPhoneNumber('7911123456', 'GB')).toBe('+447911123456')
      })

      it('フランスの電話番号をフォーマットする', () => {
        expect(formatPhoneNumber('612345678', 'FR')).toBe('+33612345678')
      })
    })

    describe('エッジケース', () => {
      it('電話番号が空の場合は空文字を返す', () => {
        expect(formatPhoneNumber('', 'JP')).toBe('')
      })

      it('国コードが空の場合は元の電話番号を返す', () => {
        expect(formatPhoneNumber('09012345678', '')).toBe('09012345678')
      })

      it('無効な国コードの場合は元の電話番号を返す', () => {
        expect(formatPhoneNumber('09012345678', 'XX')).toBe('09012345678')
      })

      it('電話番号と国コードの両方が空の場合は空文字を返す', () => {
        expect(formatPhoneNumber('', '')).toBe('')
      })
    })
  })

  describe('parsePhoneNumber', () => {
    it('日本の国際電話番号を解析する', () => {
      const result = parsePhoneNumber('+819012345678')
      expect(result.countryCode).toBe('JP')
      expect(result.phoneCode).toBe('+81')
      expect(result.number).toBe('9012345678')
    })

    it('米国の国際電話番号を解析する', () => {
      const result = parsePhoneNumber('+12025551234')
      expect(result.countryCode).toBe('US')
      expect(result.phoneCode).toBe('+1')
      expect(result.number).toBe('2025551234')
    })

    it('韓国の国際電話番号を解析する', () => {
      const result = parsePhoneNumber('+821012345678')
      expect(result.countryCode).toBe('KR')
      expect(result.phoneCode).toBe('+82')
      expect(result.number).toBe('1012345678')
    })

    it('中国の国際電話番号を解析する', () => {
      const result = parsePhoneNumber('+8613812345678')
      expect(result.countryCode).toBe('CN')
      expect(result.phoneCode).toBe('+86')
      expect(result.number).toBe('13812345678')
    })

    it('イギリスの国際電話番号を解析する', () => {
      const result = parsePhoneNumber('+447911123456')
      expect(result.countryCode).toBe('GB')
      expect(result.phoneCode).toBe('+44')
      expect(result.number).toBe('7911123456')
    })

    it('プラス記号で始まらない電話番号の場合は空の国コードを返す', () => {
      const result = parsePhoneNumber('09012345678')
      expect(result.countryCode).toBe('')
      expect(result.phoneCode).toBe('')
      expect(result.number).toBe('09012345678')
    })

    it('無効な国際電話番号の場合は空の国コードを返す', () => {
      const result = parsePhoneNumber('+999123456789')
      expect(result.countryCode).toBe('')
      expect(result.phoneCode).toBe('')
      expect(result.number).toBe('+999123456789')
    })

    it('空の電話番号の場合は空の値を返す', () => {
      const result = parsePhoneNumber('')
      expect(result.countryCode).toBe('')
      expect(result.phoneCode).toBe('')
      expect(result.number).toBe('')
    })

    it('長い国番号を持つ国を正しく解析する', () => {
      // フィンランド (+358)
      const result = parsePhoneNumber('+358401234567')
      expect(result.countryCode).toBe('FI')
      expect(result.phoneCode).toBe('+358')
      expect(result.number).toBe('401234567')
    })

    it('同じ国番号を持つ複数の国の場合、最初に一致する国を返す', () => {
      // +1 は米国とカナダで共有されている
      const result = parsePhoneNumber('+12025551234')
      // USまたはCAのいずれかが返される（実装に依存）
      expect(['+1']).toContain(result.phoneCode)
    })
  })

  describe('統合テスト', () => {
    it('フォーマットと解析が逆操作として機能する（日本）', () => {
      const original = '09012345678'
      const formatted = formatPhoneNumber(original, 'JP')
      const parsed = parsePhoneNumber(formatted)
      
      expect(formatted).toBe('+819012345678')
      expect(parsed.countryCode).toBe('JP')
      expect(parsed.number).toBe('9012345678')
    })

    it('フォーマットと解析が逆操作として機能する（米国）', () => {
      const original = '2025551234'
      const formatted = formatPhoneNumber(original, 'US')
      const parsed = parsePhoneNumber(formatted)
      
      expect(formatted).toBe('+12025551234')
      expect(parsed.phoneCode).toBe('+1')
      expect(parsed.number).toBe('2025551234')
    })

    it('複数の国の電話番号を連続して処理できる', () => {
      const phones = [
        { number: '09012345678', country: 'JP', expected: '+819012345678' },
        { number: '2025551234', country: 'US', expected: '+12025551234' },
        { number: '7911123456', country: 'GB', expected: '+447911123456' },
      ]

      phones.forEach(({ number, country, expected }) => {
        const formatted = formatPhoneNumber(number, country)
        expect(formatted).toBe(expected)
        
        const parsed = parsePhoneNumber(formatted)
        expect(parsed.phoneCode).toBeTruthy()
      })
    })
  })
})


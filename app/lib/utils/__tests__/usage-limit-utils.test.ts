import {
  UNIT_TO_BYTES,
  PRICING_RATES,
  convertLimitToBytes,
  formatExceedingLimits,
} from '../usage-limit-utils'
import { UsageLimit } from '@/app/lib/actions/usage-limits-api'

describe('usage-limit-utils', () => {
  describe('UNIT_TO_BYTES', () => {
    it('正しい単位変換定数が定義されている', () => {
      expect(UNIT_TO_BYTES.KB).toBe(1024)
      expect(UNIT_TO_BYTES.MB).toBe(1024 * 1024)
      expect(UNIT_TO_BYTES.GB).toBe(1024 * 1024 * 1024)
      expect(UNIT_TO_BYTES.TB).toBe(1024 * 1024 * 1024 * 1024)
    })

    it('KB単位が正しい', () => {
      expect(UNIT_TO_BYTES.KB).toBe(1024)
    })

    it('MB単位が正しい', () => {
      expect(UNIT_TO_BYTES.MB).toBe(1048576)
    })

    it('GB単位が正しい', () => {
      expect(UNIT_TO_BYTES.GB).toBe(1073741824)
    })

    it('TB単位が正しい', () => {
      expect(UNIT_TO_BYTES.TB).toBe(1099511627776)
    })
  })

  describe('PRICING_RATES', () => {
    it('処理料金レートが定義されている', () => {
      expect(PRICING_RATES.processing).toBe(0.00001)
    })

    it('処理料金レートが正の数である', () => {
      expect(PRICING_RATES.processing).toBeGreaterThan(0)
    })
  })

  describe('convertLimitToBytes', () => {
    describe('データ量制限の変換', () => {
      it('KB単位の制限をバイトに変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 100,
          usageUnit: 'KB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(100 * 1024)
      })

      it('MB単位の制限をバイトに変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 50,
          usageUnit: 'MB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(50 * 1024 * 1024)
      })

      it('GB単位の制限をバイトに変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 10,
          usageUnit: 'GB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(10 * 1024 * 1024 * 1024)
      })

      it('TB単位の制限をバイトに変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 1,
          usageUnit: 'TB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(1 * 1024 * 1024 * 1024 * 1024)
      })

      it('小数点を含む制限値を変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 1.5,
          usageUnit: 'GB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(1.5 * 1024 * 1024 * 1024)
      })

      it('0の制限値を変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 0,
          usageUnit: 'MB',
          createdAt: '2024-01-01',
        }

        // 0はfalsyなため、nullを返す
        expect(convertLimitToBytes(limit)).toBeNull()
      })
    })

    describe('金額制限の変換', () => {
      it('金額制限をバイトに変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          amountLimitValue: 100,
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(100 / 0.00001)
      })

      it('小額の金額制限を変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          amountLimitValue: 1,
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(1 / 0.00001)
      })

      it('大額の金額制限を変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          amountLimitValue: 10000,
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBe(10000 / 0.00001)
      })

      it('0の金額制限を変換する', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          amountLimitValue: 0,
          createdAt: '2024-01-01',
        }

        // 0はfalsyなため、nullを返す
        expect(convertLimitToBytes(limit)).toBeNull()
      })
    })

    describe('エッジケース', () => {
      it('データ量と金額の両方が未定義の場合はnullを返す', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBeNull()
      })

      it('usageLimitValueがあるがusageUnitがない場合はnullを返す', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 100,
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBeNull()
      })

      it('usageUnitがあるがusageLimitValueがない場合はnullを返す', () => {
        const limit: UsageLimit = {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageUnit: 'MB',
          createdAt: '2024-01-01',
        }

        expect(convertLimitToBytes(limit)).toBeNull()
      })
    })
  })

  describe('formatExceedingLimits', () => {
    describe('データ量制限のフォーマット', () => {
      it('KB単位の制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 100,
            usageUnit: 'KB',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('100 KB')
      })

      it('MB単位の制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 50,
            usageUnit: 'MB',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('50 MB')
      })

      it('GB単位の制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 10,
            usageUnit: 'GB',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('10 GB')
      })

      it('TB単位の制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 1,
            usageUnit: 'TB',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('1 TB')
      })
    })

    describe('金額制限のフォーマット', () => {
      it('金額制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            amountLimitValue: 100,
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('$100')
      })

      it('小額の金額制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            amountLimitValue: 0.5,
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('$0.5')
      })

      it('大額の金額制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            amountLimitValue: 10000,
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('$10000')
      })
    })

    describe('複数の制限のフォーマット', () => {
      it('複数のデータ量制限をカンマ区切りでフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 100,
            usageUnit: 'MB',
            createdAt: '2024-01-01',
          },
          {
            limitId: 'limit-2',
            customerId: 'customer-1',
            usageLimitValue: 10,
            usageUnit: 'GB',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('100 MB, 10 GB')
      })

      it('データ量と金額の混在した制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 100,
            usageUnit: 'MB',
            createdAt: '2024-01-01',
          },
          {
            limitId: 'limit-2',
            customerId: 'customer-1',
            amountLimitValue: 50,
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('100 MB, $50')
      })

      it('3つ以上の制限をフォーマットする', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            usageLimitValue: 100,
            usageUnit: 'KB',
            createdAt: '2024-01-01',
          },
          {
            limitId: 'limit-2',
            customerId: 'customer-1',
            usageLimitValue: 50,
            usageUnit: 'MB',
            createdAt: '2024-01-01',
          },
          {
            limitId: 'limit-3',
            customerId: 'customer-1',
            amountLimitValue: 100,
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('100 KB, 50 MB, $100')
      })
    })

    describe('エッジケース', () => {
      it('空の配列の場合は空文字を返す', () => {
        expect(formatExceedingLimits([])).toBe('')
      })

      it('制限値が設定されていない場合は「制限値」と表示する', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('制限値')
      })

      it('複数の未設定制限を処理する', () => {
        const limits: UsageLimit[] = [
          {
            limitId: 'limit-1',
            customerId: 'customer-1',
            createdAt: '2024-01-01',
          },
          {
            limitId: 'limit-2',
            customerId: 'customer-1',
            createdAt: '2024-01-01',
          },
        ]

        expect(formatExceedingLimits(limits)).toBe('制限値, 制限値')
      })
    })
  })

  describe('統合テスト', () => {
    it('制限をバイトに変換してからフォーマットできる', () => {
      const limit: UsageLimit = {
        limitId: 'limit-1',
        customerId: 'customer-1',
        usageLimitValue: 100,
        usageUnit: 'MB',
        createdAt: '2024-01-01',
      }

      const bytes = convertLimitToBytes(limit)
      expect(bytes).toBe(100 * 1024 * 1024)

      const formatted = formatExceedingLimits([limit])
      expect(formatted).toBe('100 MB')
    })

    it('複数の制限を処理できる', () => {
      const limits: UsageLimit[] = [
        {
          limitId: 'limit-1',
          customerId: 'customer-1',
          usageLimitValue: 100,
          usageUnit: 'MB',
          createdAt: '2024-01-01',
        },
        {
          limitId: 'limit-2',
          customerId: 'customer-1',
          amountLimitValue: 50,
          createdAt: '2024-01-01',
        },
      ]

      const bytes1 = convertLimitToBytes(limits[0])
      const bytes2 = convertLimitToBytes(limits[1])

      expect(bytes1).toBe(100 * 1024 * 1024)
      expect(bytes2).toBe(50 / 0.00001)

      const formatted = formatExceedingLimits(limits)
      expect(formatted).toBe('100 MB, $50')
    })
  })
})


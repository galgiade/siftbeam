const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.jsアプリのパスを指定
  dir: './',
})

// Jestのカスタム設定
const customJestConfig = {
  // セットアップファイルを指定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // テスト環境を指定
  testEnvironment: 'jest-environment-jsdom',
  
  // モジュールパスのエイリアス設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/app/lib/$1',
    '^@/components/(.*)$': '<rootDir>/app/_components/$1',
  },
  
  // テストファイルのパターン
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // カバレッジ収集の設定
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/_*.{js,jsx,ts,tsx}',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
    '!app/**/providers.tsx',
    '!app/**/opengraph-image.tsx',
    '!app/dictionaries/**',
    '!**/node_modules/**',
  ],
  
  // カバレッジのしきい値
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // テストのタイムアウト
  testTimeout: 10000,
  
  // モジュールファイル拡張子
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // 変換の設定
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['next/dist/build/swc/jest-transformer', {}],
  },
  
  // 無視するパス
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  
  // 変換を無視するパス（uuidなどのESMモジュールは変換する）
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

// Next.js用のJest設定を作成してエクスポート
module.exports = createJestConfig(customJestConfig)


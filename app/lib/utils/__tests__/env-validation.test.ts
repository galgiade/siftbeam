import { 
  validateRequiredEnvVars, 
  checkOptionalEnvVars, 
  getRequiredEnv, 
  getOptionalEnv 
} from '../env-validation';

describe('env-validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // 環境変数をリセット
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getRequiredEnv', () => {
    it('設定されている環境変数を取得する', () => {
      process.env.TEST_VAR = 'test-value';
      const result = getRequiredEnv('TEST_VAR');
      expect(result).toBe('test-value');
    });

    it('未設定の環境変数でエラーをスローする', () => {
      delete process.env.TEST_VAR;
      expect(() => getRequiredEnv('TEST_VAR')).toThrow(
        'Required environment variable TEST_VAR is not set'
      );
    });

    it('デフォルト値を使用する', () => {
      delete process.env.TEST_VAR;
      const result = getRequiredEnv('TEST_VAR', 'default-value');
      expect(result).toBe('default-value');
    });

    it('空文字の環境変数でエラーをスローする', () => {
      process.env.TEST_VAR = '';
      expect(() => getRequiredEnv('TEST_VAR')).toThrow(
        'Required environment variable TEST_VAR is not set'
      );
    });

    it('空文字でもデフォルト値があれば使用する', () => {
      process.env.TEST_VAR = '';
      const result = getRequiredEnv('TEST_VAR', 'default-value');
      expect(result).toBe('default-value');
    });
  });

  describe('getOptionalEnv', () => {
    it('設定されている環境変数を取得する', () => {
      process.env.OPTIONAL_VAR = 'optional-value';
      const result = getOptionalEnv('OPTIONAL_VAR');
      expect(result).toBe('optional-value');
    });

    it('未設定の環境変数でデフォルト値を返す', () => {
      delete process.env.OPTIONAL_VAR;
      const result = getOptionalEnv('OPTIONAL_VAR', 'default-value');
      expect(result).toBe('default-value');
    });

    it('デフォルト値が指定されていない場合は空文字を返す', () => {
      delete process.env.OPTIONAL_VAR;
      const result = getOptionalEnv('OPTIONAL_VAR');
      expect(result).toBe('');
    });

    it('空文字の環境変数でデフォルト値を返す', () => {
      process.env.OPTIONAL_VAR = '';
      const result = getOptionalEnv('OPTIONAL_VAR', 'default-value');
      expect(result).toBe('default-value');
    });
  });

  describe('validateRequiredEnvVars', () => {
    it('すべての必須環境変数が設定されている場合は成功する', () => {
      // 必須環境変数を設定
      process.env.REGION = 'us-east-1';
      process.env.ACCESS_KEY_ID = 'test-key';
      process.env.SECRET_ACCESS_KEY = 'test-secret';
      process.env.COGNITO_CLIENT_ID = 'test-client-id';
      process.env.COGNITO_USER_POOL_ID = 'test-pool-id';
      process.env.USER_TABLE_NAME = 'test-users';
      process.env.GROUP_TABLE_NAME = 'test-groups';
      process.env.USER_GROUP_TABLE_NAME = 'test-user-groups';
      process.env.POLICY_GROUP_TABLE_NAME = 'test-policy-groups';
      process.env.POLICY_TABLE_NAME = 'test-policies';
      process.env.API_KEY_TABLE_NAME = 'test-api-keys';
      process.env.VERIFICATION_CODES_TABLE_NAME = 'test-verification-codes';
      process.env.SES_FROM_EMAIL = 'test@example.com';
      process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
      process.env.STRIPE_PRICE_PROCESSING_ID = 'test-price-id';
      process.env.STRIPE_PRICE_STORAGE_ID = 'test-storage-id';
      process.env.USAGE_PLAN_ID = 'test-usage-plan';

      expect(() => validateRequiredEnvVars()).not.toThrow();
    });

    it('必須環境変数が未設定の場合はエラーをスローする', () => {
      // すべての環境変数をクリア
      delete process.env.REGION;
      delete process.env.ACCESS_KEY_ID;
      delete process.env.SECRET_ACCESS_KEY;

      expect(() => validateRequiredEnvVars()).toThrow('必須環境変数が設定されていません');
    });
  });

  describe('checkOptionalEnvVars', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('オプション環境変数が未設定の場合は警告を表示する', () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      checkOptionalEnvVars();

      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️  オプション環境変数が未設定です:');
    });

    it('本番環境では警告を表示しない', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

      checkOptionalEnvVars();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('すべてのオプション環境変数が設定されている場合は警告を表示しない', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_xxx';

      checkOptionalEnvVars();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('エッジケース', () => {
    it('環境変数にスペースが含まれている場合も取得する', () => {
      process.env.TEST_VAR = '  test-value  ';
      const result = getRequiredEnv('TEST_VAR');
      expect(result).toBe('  test-value  ');
    });

    it('環境変数に特殊文字が含まれている場合も取得する', () => {
      process.env.TEST_VAR = 'test!@#$%^&*()';
      const result = getRequiredEnv('TEST_VAR');
      expect(result).toBe('test!@#$%^&*()');
    });

    it('非常に長い環境変数も取得する', () => {
      const longValue = 'a'.repeat(10000);
      process.env.TEST_VAR = longValue;
      const result = getRequiredEnv('TEST_VAR');
      expect(result).toBe(longValue);
    });
  });
});


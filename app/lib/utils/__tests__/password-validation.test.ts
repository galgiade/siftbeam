import { validatePassword, validatePasswordMatch, validatePasswordComplete } from '../password-validation';

describe('password-validation', () => {
  describe('validatePassword', () => {
    it('8文字以上、大文字、小文字、数字を含む有効なパスワードを受け入れる', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('8文字未満のパスワードを拒否する', () => {
      const result = validatePassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('小文字がないパスワードを拒否する', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('大文字がないパスワードを拒否する', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('数字がないパスワードを拒否する', () => {
      const result = validatePassword('PasswordABC');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('特殊文字を含むパスワードも受け入れる', () => {
      const result = validatePassword('Password123!@#');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('最小要件を満たすパスワードを受け入れる', () => {
      const result = validatePassword('Passw0rd');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('非常に長いパスワードも受け入れる', () => {
      const result = validatePassword('Password123' + 'a'.repeat(100));
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validatePasswordMatch', () => {
    it('一致するパスワードを受け入れる', () => {
      const result = validatePasswordMatch('Password123', 'Password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('一致しないパスワードを拒否する', () => {
      const result = validatePasswordMatch('Password123', 'Password456');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードが一致しません');
    });

    it('空文字の一致を受け入れる', () => {
      const result = validatePasswordMatch('', '');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('大文字小文字の違いを検出する', () => {
      const result = validatePasswordMatch('Password123', 'password123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードが一致しません');
    });
  });

  describe('validatePasswordComplete', () => {
    it('有効で一致するパスワードを受け入れる', () => {
      const result = validatePasswordComplete('Password123', 'Password123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('一致しないパスワードを拒否する（強度チェック前）', () => {
      const result = validatePasswordComplete('Password123', 'Password456');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードが一致しません');
    });

    it('一致するが弱いパスワードを拒否する', () => {
      const result = validatePasswordComplete('pass', 'pass');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('一致するが大文字がないパスワードを拒否する', () => {
      const result = validatePasswordComplete('password123', 'password123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('一致するが小文字がないパスワードを拒否する', () => {
      const result = validatePasswordComplete('PASSWORD123', 'PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });

    it('一致するが数字がないパスワードを拒否する', () => {
      const result = validatePasswordComplete('PasswordABC', 'PasswordABC');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('パスワードは8文字以上で、大文字、小文字、数字を含む必要があります');
    });
  });

  describe('エッジケース', () => {
    it('空文字のパスワードを拒否する', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
    });

    it('スペースのみのパスワードを拒否する', () => {
      const result = validatePassword('        ');
      expect(result.valid).toBe(false);
    });

    it('Unicode文字を含むパスワードを処理する', () => {
      const result = validatePassword('Pässw0rd');
      expect(result.valid).toBe(true);
    });

    it('絵文字を含むパスワードを処理する', () => {
      const result = validatePassword('Password123😀');
      expect(result.valid).toBe(true);
    });
  });
});


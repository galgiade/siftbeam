export default {
  label: {
    back: "Kembali",
    submit: "Kirim",
    loading: "Memuat...",
    signInTitle: "Masuk",
    signInSubtitle: "Silakan masuk ke akun Anda",
    emailLabel: "Alamat Email",
    emailPlaceholder: "contoh@email.com",
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "Masukkan kata sandi",
    passwordDescription: "Minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol",
    signIn: "Masuk",
    signingIn: "Sedang masuk...",
    signUp: "Daftar",
    forgotPassword: "Lupa kata sandi?",
    noAccount: "Belum punya akun?",

    // 2FA
    verificationCodeLabel: "Kode Verifikasi",
    verificationCodePlaceholder: "Masukkan kode 6 digit",
    verificationCodeDescription: "Masukkan kode yang dikirim ke email terdaftar Anda",
    verifyCode: "Verifikasi Kode",
    verifyingCode: "Memverifikasi...",
    resendCode: "Kirim Ulang Kode",
    resendingCode: "Mengirim ulang...",
    codeExpired: "Kode verifikasi kedaluwarsa",
    enterVerificationCode: "Masukkan kode verifikasi",
    expirationTime: "Waktu Kedaluwarsa",
    attemptCount: "Percobaan",
    verificationSuccess: "✅ Autentikasi berhasil. Mengalihkan..."
  },
  alert: {
    emailRequired: "Masukkan alamat email",
    passwordRequired: "Masukkan kata sandi",
    emailFormatInvalid: "Masukkan format email yang valid",
    passwordFormatInvalid: "Kata sandi minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol",
    emailAndPasswordRequired: "Masukkan email dan kata sandi",
    signInFailed: "Gagal masuk",
    accountNotConfirmed: "Akun belum dikonfirmasi. Selesaikan verifikasi email",
    authCodeRequired: "Kode autentikasi diperlukan",
    newPasswordRequired: "Diperlukan pengaturan kata sandi baru",
    passwordResetRequired: "Diperlukan reset kata sandi",
    nextStepRequired: "Langkah berikut diperlukan: {step}",
    
    // 2FA errors
    verificationCodeRequired: "Masukkan kode verifikasi",
    verificationCodeInvalid: "Kode verifikasi salah",
    verificationCodeExpired: "Kode verifikasi kedaluwarsa. Kirim ulang",
    resendCodeFailed: "Gagal mengirim ulang kode",
    maxAttemptsReached: "Jumlah maksimum percobaan tercapai. Silakan minta kode baru.",
    emailSendFailed: "Gagal mengirim email",
    verificationCodeNotFound: "Kode verifikasi tidak ditemukan atau kedaluwarsa",
    remainingAttempts: "Percobaan tersisa",
    authErrors: {
      notAuthorized: "Email atau kata sandi salah",
      userNotConfirmed: "Akun belum dikonfirmasi. Selesaikan verifikasi email",
      userNotFound: "Pengguna tidak ditemukan",
      passwordResetRequired: "Diperlukan reset kata sandi",
      invalidParameter: "Parameter tidak valid",
      tooManyRequests: "Terlalu banyak permintaan. Coba lagi nanti"
    }
  }
} as const;



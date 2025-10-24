export default {
  label: {
    back: "Kembali",
    submit: "Kirim",
    loading: "Memuat...",
    forgotPasswordTitle: "Atur Ulang Kata Sandi",
    emailLabel: "Alamat Email",
    emailPlaceholder: "Masukkan email Anda",
    codeLabel: "Kode Verifikasi",
    codePlaceholder: "Masukkan kode",
    newPasswordLabel: "Kata Sandi Baru",
    newPasswordPlaceholder: "Masukkan kata sandi baru",
    sendCode: "Kirim Kode",
    updatePassword: "Perbarui Kata Sandi",
    backToEmail: "Kembali",
    resendCode: "Kirim Kode Baru",
    emailDescription: "Masukkan alamat email Anda. Kami akan mengirimkan kode verifikasi.",
    codeDescription: "Masukkan kode yang dikirim ke email Anda dan kata sandi baru.",
    redirectingMessage: "Mengalihkan ke halaman masuk...",
    codeExpiryTitle: "Masa Berlaku Kode",
    remainingTime: "Waktu tersisa: {time}",
    expiredMessage: "Kedaluwarsa. Silakan minta kode baru.",
    timeLimitMessage: "Silakan masukkan dalam 24 jam",
    expiredResendMessage: "Kode verifikasi telah kedaluwarsa. Silakan minta kode baru."
  },
  alert: {
    emailRequired: "Masukkan alamat email",
    codeRequired: "Masukkan kode verifikasi",
    newPasswordRequired: "Masukkan kata sandi baru",
    codeSent: "Kode verifikasi telah dikirim ke email Anda",
    passwordResetSuccess: "Kata sandi berhasil diatur ulang",
    passwordUpdated: "Kata sandi berhasil diperbarui!",
    codeExpired: "Kedaluwarsa",
    authErrors: {
      notAuthorized: "Email atau kata sandi salah",
      userNotConfirmed: "Akun belum dikonfirmasi. Selesaikan verifikasi email",
      userNotFound: "Pengguna tidak ditemukan",
      passwordResetRequired: "Diperlukan reset kata sandi",
      invalidParameter: "Parameter tidak valid",
      tooManyRequests: "Terlalu banyak permintaan. Coba lagi nanti",
      signInFailed: "Gagal masuk"
    },
    passwordResetErrors: {
      codeMismatch: "Kode verifikasi salah. Coba lagi.",
      expiredCode: "Kode verifikasi telah kedaluwarsa. Minta kode baru.",
      invalidPassword: "Kata sandi tidak valid. Periksa persyaratan.",
      limitExceeded: "Batas permintaan tercapai. Coba lagi nanti.",
      genericError: "Terjadi kesalahan. Coba lagi."
    }
  }
} as const;



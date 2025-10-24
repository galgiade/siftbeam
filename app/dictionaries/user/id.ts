// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const id = {
  alert: {
    updateSuccess: "Informasi pengguna berhasil diperbarui.",
    updateFail: "Gagal memperbarui informasi pengguna.",
    emailSent: "Kode konfirmasi telah dikirim ke alamat email baru Anda.",
    emailUpdateSuccess: "Alamat email berhasil diperbarui.",
    emailUpdateFail: "Gagal memperbarui alamat email.",
    dbUpdateFail: "Gagal memperbarui database.",
    dbUpdateError: "Pembaruan database gagal",
    confirmFail: "Kode konfirmasi salah atau pembaruan database gagal.",
    invalidConfirmationCode: "Kode konfirmasi salah. Silakan masukkan kode 6 digit yang benar.",
    expiredConfirmationCode: "Kode konfirmasi telah kedaluwarsa. Silakan minta kode baru.",
    userAlreadyExists: "Alamat email ini sudah terdaftar. Silakan gunakan alamat email yang berbeda.",
    usernameExists: "Nama pengguna ini sudah digunakan. Silakan gunakan nama pengguna yang berbeda.",
    noEmailChange: "Tidak ada perubahan pada alamat email.",
    invalidEmailFormat: "Format email tidak valid. Silakan masukkan alamat email yang valid.",
    emailChangeCancelled: "Perubahan alamat email telah dibatalkan.",
    emailChangeCancelFailed: "Gagal membatalkan perubahan alamat email.",
    emailChangeReset: "Perubahan alamat email yang belum dikonfirmasi telah direset.",
    noChange: "Tidak ada perubahan pada nama pengguna.",
    resendLimitExceeded: "Batas pengiriman ulang telah terlampaui. Silakan coba lagi nanti.",
    resendFailed: "Gagal mengirim ulang kode konfirmasi. Silakan coba lagi.",
    invalidConfirmationCodeFormat: "Silakan masukkan kode konfirmasi 6 digit.",
    confirmationAttemptLimitExceeded: "Batas percobaan konfirmasi telah terlampaui. Silakan coba lagi nanti.",
    authenticationFailed: "Autentikasi gagal. Silakan masuk kembali dan coba lagi.",
    invalidUsernameFormat: "Format nama pengguna tidak valid. Silakan masukkan nama pengguna yang valid.",
    usernameChangeLimitExceeded: "Batas perubahan nama pengguna telah terlampaui. Silakan coba lagi nanti.",
    atLeastOneFieldRequired: "Setidaknya satu field harus diperbarui",
    verificationCodeNotFound: "Kode verifikasi tidak ditemukan atau kedaluwarsa",
    remainingAttempts: "Percobaan tersisa",
    verificationCodeStoreFailed: "Gagal menyimpan kode verifikasi. Silakan periksa izin IAM."
  },
  label: {
    title: "Informasi Pengguna",
    userName: "Nama Pengguna",
    department: "Departemen",
    position: "Posisi",
    email: "Alamat Email"
  },
  modal: {
    modalTitle: "Konfirmasi Email",
    description: "Silakan masukkan kode konfirmasi yang dikirim ke alamat email baru Anda ({email}).",
    codeLabel: "Kode Konfirmasi",
    cancel: "Batal",
    confirm: "Konfirmasi",
    resend: "Kirim Ulang",
    verifying: "Memverifikasi..."
  }
}

export default id;



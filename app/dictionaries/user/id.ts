import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const id: UserProfileLocale = {
  alert: {
    updateSuccess: "Informasi pengguna berhasil diperbarui.",
    updateFail: "Gagal memperbarui informasi pengguna.",
    updateError: "Terjadi kesalahan saat pembaruan.",
    fieldUpdateSuccess: "{field} berhasil diperbarui.",
    fieldUpdateFail: "Gagal memperbarui {field}.",
    emailSent: "Kode konfirmasi telah dikirim ke alamat email baru Anda.",
    emailUpdateSuccess: "Alamat email berhasil diperbarui.",
    emailUpdateFail: "Gagal memperbarui alamat email.",
    dbUpdateFail: "Gagal memperbarui database.",
    dbUpdateError: "Pembaruan database gagal",
    confirmFail: "Kode konfirmasi salah atau pembaruan database gagal.",
    invalidConfirmationCode: "Kode konfirmasi salah. Silakan masukkan kode 6 digit yang benar.",
    expiredConfirmationCode: "Kode konfirmasi telah kedaluwarsa. Silakan minta kode baru.",
    noEmailChange: "Tidak ada perubahan pada alamat email.",
    invalidEmailFormat: "Format email tidak valid. Silakan masukkan alamat email yang valid.",
    noChange: "Tidak ada perubahan pada nama pengguna.",
    invalidConfirmationCodeFormat: "Silakan masukkan kode konfirmasi 6 digit.",
    verificationCodeNotFound: "Kode verifikasi tidak ditemukan atau kedaluwarsa",
    remainingAttempts: "Percobaan tersisa",
    verificationCodeStoreFailed: "Gagal menyimpan kode verifikasi. Silakan periksa izin IAM.",
    codeStoreFailed: "Gagal menyimpan kode.",
    adminOnlyEdit: "Hanya administrator yang dapat mengedit bidang ini.",
    validEmailRequired: "Masukkan alamat email yang valid."
  },
  label: {
    title: "Informasi Pengguna",
    userName: "Nama Pengguna",
    department: "Departemen",
    position: "Posisi",
    email: "Alamat Email",
    locale: "Bahasa",
    role: "Peran",
    edit: "Edit",
    save: "Simpan",
    cancel: "Batal",
    adminOnly: "(Hanya admin)",
    readOnly: "(Tidak dapat diubah)",
    editableFields: "Dapat diedit: Nama pengguna, Bahasa",
    adminOnlyFields: "Hanya admin: Email, Departemen, Posisi",
    allFieldsEditable: "Semua bidang dapat diedit",
    newEmailSent: "Kode verifikasi dikirim ke \"{email}\".",
    roleAdmin: "Administrator",
    roleUser: "Pengguna",
    lastAdminRestriction: "Perubahan peran dibatasi jika Anda adalah administrator terakhir",
    lastAdminNote: "※ Jika hanya ada satu administrator dalam organisasi, peran tidak dapat diubah menjadi pengguna biasa.",
    generalUserPermission: "Izin Pengguna Umum",
    adminPermission: "Izin Administrator",
    verifyAndUpdate: "Verifikasi dan Perbarui",
    verificationCodePlaceholder: "Kode verifikasi (6 digit)",
    retryAfter: "Coba lagi tersedia setelah"
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



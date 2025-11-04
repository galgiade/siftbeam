import type { CompanyProfileLocale } from './company.d.ts';

const id: CompanyProfileLocale = {
  alert: {
    updateSuccess: "Informasi perusahaan telah diperbarui.",
    updateFail: "Gagal memperbarui.",
    networkError: "Kesalahan jaringan: {message}",
    required: '"{label}" wajib diisi.',
    fetchCustomerFailed: "Gagal mengambil informasi pelanggan",
    customerNotFound: "Informasi pelanggan tidak ditemukan",
    customerDeleted: "Akun pelanggan ini telah dihapus",
    adminOnlyEditMessage: "Hanya admin yang dapat mengedit informasi perusahaan. Silakan hubungi admin jika Anda perlu melakukan perubahan.",
    invalidEmail: "Harap masukkan alamat email yang valid",
    invalidPhone: "Harap masukkan nomor telepon yang valid",
    invalidPostalCode: "Harap masukkan kode pos yang valid",
    nameTooLong: "Nama perusahaan harus 100 karakter atau kurang",
    addressTooLong: "Alamat harus 200 karakter atau kurang",
    validationError: "Ada masalah dengan input. Silakan periksa.",
    fieldUpdateSuccess: "{fieldName} telah berhasil diperbarui.",
    fieldUpdateFail: "Gagal memperbarui {fieldName}.",
    updateError: "Terjadi kesalahan selama proses pembaruan.",
    fieldRequired: "{fieldLabel} wajib diisi.",
    invalidEmailFormat: "Harap masukkan alamat email yang valid.",
    invalidPhoneFormat: "Harap masukkan nomor telepon yang valid.",
    invalidPostalCodeFormat: "Harap masukkan kode pos yang valid.",
    invalidCountryFormat: "Harap pilih negara yang valid.",
    countryRequired: "Negara wajib diisi.",
    errorTitle: "Kesalahan",
    fetchError: "Terjadi kesalahan saat mengambil informasi perusahaan."
  },
  label: {
    title: "Informasi Perusahaan",
    country: "Negara",
    countryPlaceholder: "Cari dan pilih negara",
    postal_code: "Kode Pos",
    state: "Provinsi/Negeri",
    city: "Kota",
    line2: "Gedung",
    line1: "Alamat",
    name: "Nama Perusahaan",
    phone: "Telepon",
    email: "Email Penagihan",
    notSet: "Belum diatur",
    generalUserPermission: "Izin Pengguna Umum",
    adminPermission: "Izin Administrator",
    adminPermissionDescription: "Anda dapat mengedit semua bidang informasi perusahaan",
    selectPlaceholder: "Pilih {label}"
  },
  placeholder: {
    postal_code: "contoh: 12345",
    state: "contoh: Jawa Barat",
    city: "contoh: Jakarta",
    line2: "contoh: Lantai 10 (opsional)",
    line1: "contoh: Jl. Sudirman No. 123",
    name: "contoh: PT Contoh Indonesia",
    phone: "contoh: +62-21-123-4567",
    email: "contoh: kontak@contoh.co.id",
    phoneExample: "contoh: 90-3706-7654"
  },
  button: {
    cancel: "Batal"
  }
};

export default id;
export default {
  alert: {
    updateSuccess: "Informasi perusahaan telah diperbarui.",
    updateFail: "Gagal memperbarui.",
    networkError: "Kesalahan jaringan: {message}",
    required: '"{label}" wajib diisi.',
    fetchCustomerFailed: "Gagal mengambil informasi pelanggan",
    customerNotFound: "Informasi pelanggan tidak ditemukan",
    customerDeleted: "Akun pelanggan ini telah dihapus",
    adminOnlyEditMessage: "Hanya admin yang dapat mengedit informasi perusahaan. Anda tidak memiliki izin untuk mengedit.",
    invalidEmail: "Harap masukkan alamat email yang valid",
    invalidPhone: "Harap masukkan nomor telepon yang valid",
    invalidPostalCode: "Harap masukkan kode pos yang valid",
    nameTooLong: "Nama perusahaan harus 100 karakter atau kurang",
    addressTooLong: "Alamat harus 200 karakter atau kurang",
    validationError: "Ada masalah dengan input. Silakan periksa."
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
    email: "Email Penagihan"
  },
  placeholder: {
    postal_code: "contoh: 12345",
    state: "contoh: Jawa Barat",
    city: "contoh: Jakarta",
    line2: "contoh: Lantai 10 (opsional)",
    line1: "contoh: Jl. Sudirman No. 123",
    name: "contoh: PT Contoh Indonesia",
    phone: "contoh: +62-21-123-4567",
    email: "contoh: kontak@contoh.co.id"
  },
  button: {
    cancel: "Batal"
  }
} as const;



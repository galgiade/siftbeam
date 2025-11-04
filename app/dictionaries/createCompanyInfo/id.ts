import type { CreateCompanyInfoLocale } from './createCompanyInfo.d.ts';

const id: CreateCompanyInfoLocale = {
  label: {
    back: "Kembali",
    submit: "Kirim",
    next: "Berikutnya",
    submitting: "Mengirim...",
    loading: "Memuat...",
    companyInfoTitle: "Informasi Perusahaan",
    countryLabel: "Negara",
    countryPlaceholder: "Cari dan pilih negara",
    postalCodeLabel: "Kode Pos",
    postalCodePlaceholder: "contoh: 12345",
    stateLabel: "Provinsi/Negeri",
    statePlaceholder: "contoh: DKI Jakarta",
    cityLabel: "Kota",
    cityPlaceholder: "contoh: Jakarta Selatan",
    line1Label: "Alamat Baris 1",
    line1Placeholder: "contoh: Jl. Sudirman No. 123",
    line2Label: "Alamat Baris 2 (Gedung, Ruangan)",
    line2Placeholder: "contoh: Gedung ABC, Lantai 5",
    nameLabel: "Nama Perusahaan",
    namePlaceholder: "contoh: PT Contoh Perusahaan",
    emailLabel: "Email Penagihan",
    emailPlaceholder: "contoh: billing@perusahaan.co.id",
    phoneLabel: "Telepon",
    phonePlaceholder: "contoh: +62-21-1234-5678",
    accountCreation: "Pembuatan Akun",
    companyInfo: "Informasi Perusahaan",
    adminSetup: "Pengaturan Admin",
    paymentSetup: "Pengaturan Pembayaran"
  },
  alert: {
    countryRequired: "Negara wajib diisi",
    postalCodeRequired: "Kode pos wajib diisi",
    stateRequired: "Provinsi/Negeri wajib diisi",
    cityRequired: "Kota wajib diisi",
    line1Required: "Alamat Baris 1 wajib diisi",
    nameRequired: "Nama perusahaan wajib diisi",
    emailRequired: "Email wajib diisi",
    phoneRequired: "Telepon wajib diisi",
    userAttributeUpdateFailed: "Gagal memperbarui atribut pengguna",
    stripeCustomerCreationFailed: "Gagal membuat pelanggan Stripe",
    communicationError: "Terjadi kesalahan komunikasi"
  }
};

export default id;
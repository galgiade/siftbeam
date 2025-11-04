import type { CreatePaymentLocale } from './createPayment.d.ts';

const id: CreatePaymentLocale = {
  label: {
    back: "Kembali",
    submit: "Kirim",
    loading: "Memuat...",
    paymentSetupTitle: "Pengaturan Metode Pembayaran",
    cardInfoLabel: "Informasi Kartu",
    expiryLabel: "MM/YY",
    cvcLabel: "Kode Keamanan",
    apply: "Terapkan",
    processing: "Memproses...",
    goToMyPage: "Ke Halaman Saya",
    accountCreation: "Pembuatan Akun",
    companyInfo: "Informasi Perusahaan",
    adminSetup: "Pengaturan Admin",
    paymentSetup: "Pengaturan Pembayaran",
    paymentMethodSaved: "✓ Metode pembayaran berhasil disimpan",
    defaultPaymentMethodSet: "Kartu ini telah diatur sebagai metode pembayaran default.",
    subscriptionCreated: "✓ Langganan berhasil dibuat",
    automaticBillingEnabled: "Penagihan otomatis berbasis penggunaan sekarang diaktifkan.",
    saveInfoDescription: "Simpan informasi Anda dengan aman untuk pembelian satu klik di masa depan",
    linkCompatibleStores: "Bayar dengan cepat di toko yang kompatibel dengan Link, termasuk Soundbox default.",
    cardInfoEncrypted: "Informasi kartu dienkripsi dan disimpan dengan aman.",
    billingBasedOnUsage: "Penagihan aktual akan dilakukan nanti berdasarkan penggunaan.",
    dataRetentionNotice: "Data yang diproses akan disimpan gratis selama 1 tahun dan kemudian dihapus secara otomatis",
    authenticationFlowDescription: "Untuk alasan keamanan, autentikasi kartu mungkin diperlukan.",
    authenticationFlowSteps: "Jika autentikasi diperlukan, layar autentikasi bank Anda akan ditampilkan. Silakan selesaikan autentikasi.",
    agreeNoticePrefix: "Dengan menyelesaikan pendaftaran, Anda menyetujui ",
    and: " dan ",
    agreeNoticeSuffix: ".",
    terms: "Ketentuan Layanan",
    privacy: "Kebijakan Privasi"
  },
  alert: {
    expiryRequired: "Silakan masukkan tanggal kedaluwarsa dengan benar",
    cvcRequired: "Silakan masukkan kode keamanan dengan benar",
    cardInfoRequired: "Informasi kartu tidak dimasukkan",
    setupIntentFailed: "Gagal membuat Setup Intent",
    paymentMethodFailed: "Gagal membuat metode pembayaran",
    unknownError: "Terjadi kesalahan yang tidak diketahui",
    customerInfoNotFound: "Tidak dapat mengambil informasi pelanggan.",
    defaultPaymentMethodFailed: "Gagal mengatur sebagai default, tetapi pendaftaran kartu selesai",
    authenticationRequired: "Autentikasi kartu diperlukan. Silakan selesaikan autentikasi.",
    authenticationFailed: "Autentikasi kartu gagal. Silakan coba lagi.",
    authenticationCancelled: "Autentikasi kartu dibatalkan.",
    authenticationIncomplete: "Autentikasi kartu belum selesai. Silakan selesaikan autentikasi."
  }
};

export default id;
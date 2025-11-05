import type { UsageLimitLocale } from './usage-limit.d.ts';

const id: UsageLimitLocale = {
  label: {
    // Umum
    save: "Simpan",
    cancel: "Batal",
    edit: "Edit",
    delete: "Hapus",
    back: "Kembali",
    add: "Tambah",
    create: "Buat",
    creating: "Menyimpan...",
    update: "Perbarui",
    
    // Halaman pembuatan
    createUsageLimitTitle: "Buat batas penggunaan",
    createUsageLimitDescription: "Konfigurasikan batas volume pemrosesan data atau biaya, dan pilih tindakan yang akan diambil saat terlampaui.",
    usageLimitSettings: "Pengaturan batas penggunaan",
    exceedActionTitle: "Tindakan saat terlampaui",
    selectAction: "Pilih tindakan",
    notifyOnlyOption: "Hanya notifikasi",
    restrictOption: "Tangguhkan layanan",
    notifyOnlyDescription: "Email notifikasi akan dikirim saat batas terlampaui. Layanan akan tetap tersedia.",
    restrictDescription: "Layanan akan ditangguhkan saat batas terlampaui. Email notifikasi juga akan dikirim.",
    limitTypeTitle: "Jenis batas",
    dataLimitOption: "Batas data",
    amountLimitOption: "Batas jumlah",
    dataLimitDescription: "Tetapkan batas berdasarkan volume pemrosesan data (MB/GB/TB).",
    amountLimitDescription: "Tetapkan batas berdasarkan biaya pemrosesan (USD).",
    dataLimitTitle: "Nilai batas data",
    enterLimitValue: "Masukkan nilai batas (mis: 100)",
    unit: "Unit",
    monthlyDataLimitDescription: "Tindakan akan dijalankan saat volume pemrosesan data bulanan melebihi nilai ini.",
    amountLimitTitle: "Nilai batas jumlah",
    enterAmountValue: "Masukkan nilai batas (mis: 50)",
    monthlyAmountLimitDescription: "Tindakan akan dijalankan saat biaya pemrosesan bulanan melebihi jumlah ini.",
    notificationSettingsTitle: "Pengaturan notifikasi",
    enterEmailPlaceholder: "Masukkan alamat email (mis: contoh@perusahaan.com)",
    notificationEmailList: "Alamat email notifikasi",
    notificationEmailCount: "Alamat email notifikasi ({count})",
    notifyOnlyEmailDescription: "Saat batas terlampaui, notifikasi akan dikirim ke alamat email yang dikonfigurasi di sini.",
    restrictEmailDescription: "Saat batas terlampaui, layanan akan ditangguhkan dan notifikasi akan dikirim ke alamat email yang dikonfigurasi di sini.",
    cancelButton: "Batal",
    createNotifyLimit: "Buat batas notifikasi",
    createRestrictLimit: "Buat batas pembatasan",
    processingFeeOnly: "hanya biaya pemrosesan",
    conversionApproximate: "≈",

    // Layar utama
    limitUsageTitle: "Batas penggunaan",
    usageLimitManagement: "Manajemen batas penggunaan",
    usageLimitDescription: "Tetapkan batas penggunaan data dan jumlah, dan kelola tindakan saat terlampaui.",
    createLimit: "Buat batas",
    notificationTarget: "Penerima notifikasi",
    detail: "Detail",
    createdAt: "Dibuat pada",
    updatedAt: "Diperbarui pada",
    limitValue: "Nilai batas",
    notificationRecipients: "Penerima notifikasi",

    // Jenis notifikasi
    notify: "Notifikasi",
    restrict: "Tangguhkan",
    exceedAction: "Tindakan saat terlampaui",
    notifyOnly: "Hanya notifikasi",
    notifyLimit: "Batas notifikasi",
    restrictLimit: "Batas penangguhan",
    notifyLimitDescription: "Saat batas ditetapkan, notifikasi akan dikirim saat terlampaui.",
    restrictLimitDescription: "Saat batas ditetapkan, layanan akan ditangguhkan saat terlampaui.",
    noNotifyLimits: "Tidak ada batas notifikasi yang dikonfigurasi",
    noRestrictLimits: "Tidak ada batas penangguhan yang dikonfigurasi",

    // Jumlah dan penggunaan
    amount: "Jumlah",
    usage: "Penggunaan",
    editTarget: "Target edit",
    limitType: "Jenis batas",
    selectLimitType: "Pilih jenis batas",
    dataLimitValue: "Nilai batas data",
    amountLimitValue: "Nilai batas jumlah (USD)",
    dataLimitPlaceholder: "mis: 100",
    amountLimitPlaceholder: "mis: 50",
    orSeparator: "atau",
    noLimit: "Tanpa batas",

    // Manajemen penerima
    recipients: "Penerima",
    emailAddress: "Alamat email",
    emailPlaceholder: "Masukkan alamat email",
    noRecipientsRegistered: "Tidak ada penerima terdaftar",
    addEmailAddress: "Alamat email notifikasi",
    minOneEmailRequired: "Setidaknya satu alamat email notifikasi diperlukan.",

    // Buat / Edit
    usageNotification: "Notifikasi penggunaan",
    selectNotifyOrRestrict: "Pilih notifikasi atau pembatasan",
    selectNotificationMethod: "Pilih metode notifikasi",
    amountBasedNotification: "Notifikasi berbasis jumlah",
    usageBasedNotification: "Notifikasi berbasis penggunaan",
    enterAmount: "Masukkan jumlah",
    enterUsage: "Masukkan penggunaan",
    addNewRecipient: "Tambah penerima baru",
    usageConversion: "Konversi penggunaan",
    amountConversion: "Konversi jumlah",
    createNewLimit: "Buat batas penggunaan baru",
    editLimit: "Edit batas penggunaan",
    dataLimit: "Batas data",
    amountLimit: "Batas jumlah",

    // Unit
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // Layar kesalahan
    errorOccurred: "Terjadi kesalahan",
    errorDetails: "Detail kesalahan",
    reloadPage: "Muat ulang halaman",
    backToAccount: "Kembali ke akun",
    contactSupport: "Jika masalah berlanjut, hubungi dukungan."
  },
  alert: {
    // Validasi
    amountRequired: "Masukkan jumlah penggunaan",
    usageRequired: "Masukkan volume penggunaan",
    emailRequired: "Masukkan alamat email",
    invalidEmail: "Masukkan alamat email yang valid.",
    enterPositiveAmount: "Masukkan angka lebih besar atau sama dengan 0",
    enterValidUsage: "Masukkan angka lebih besar dari 0 dan kurang dari 1024",
    enterPositiveDataLimit: "Nilai batas data harus lebih besar dari 0.",
    enterPositiveAmountLimit: "Nilai batas jumlah harus lebih besar dari 0.",
    emailAlreadyAdded: "Alamat email ini sudah ditambahkan.",
    minOneEmail: "Setidaknya satu alamat email notifikasi diperlukan.",
    selectExceedAction: "Silakan pilih tindakan saat terlampaui.",
    selectLimitType: "Silakan pilih jenis batas.",
    dataLimitValueRequired: "Nilai batas data harus lebih besar dari 0.",
    dataLimitValueMax: "Nilai batas data harus 1.000.000 atau kurang.",
    amountLimitValueRequired: "Nilai batas jumlah harus lebih besar dari 0.",
    amountLimitValueMax: "Nilai batas jumlah harus 100.000 atau kurang.",
    minOneEmailRequired: "Silakan masukkan setidaknya satu alamat email notifikasi.",
    notifyLimitCreated: "Batas notifikasi berhasil dibuat.",
    restrictLimitCreated: "Batas pembatasan berhasil dibuat.",
    errorPrefix: "Kesalahan:",
    unexpectedError: "Terjadi kesalahan tak terduga:",

    // Hasil operasi
    createFailed: "Gagal membuat batas penggunaan.",
    updateFailed: "Gagal memperbarui batas penggunaan.",
    sendingError: "Terjadi kesalahan saat mengirim.",
    savingInProgress: "Menyimpan...",
    createSuccess: "Batas penggunaan berhasil dibuat.",
    updateSuccess: "Batas penggunaan berhasil diperbarui.",
    deleteSuccess: "Batas penggunaan berhasil dihapus.",
    deleteConfirm: "Hapus batas penggunaan ini?",

    // Izin
    adminOnlyCreateMessage: "Hanya administrator yang dapat membuat batas penggunaan. Hubungi administrator.",
    adminOnlyEditMessage: "Hanya administrator yang dapat mengedit batas penggunaan. Anda tidak memiliki izin.",
    adminOnlyDeleteMessage: "Hanya administrator yang dapat menghapus batas penggunaan. Anda tidak memiliki izin.",

    // Kesalahan
    loginRequired: "Login diperlukan.",
    unknownError: "Terjadi kesalahan yang tidak diketahui.",
    accessDenied: "Anda tidak memiliki izin untuk mengakses halaman ini. Hanya dapat diakses oleh administrator.",
    fetchFailed: "Gagal mengambil data batas penggunaan."
  }
};

export default id;

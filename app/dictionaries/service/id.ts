import type { ServiceLocale } from './ServiceLocale.d.ts';

const id: ServiceLocale = {
  page: {
    title: "Layanan",
    description:
      "Pilih kebijakan, unggah file, lalu jalankan pemrosesan. Data yang telah diproses disimpan gratis selama satu tahun.",
    loading: "Memuat..."
  },
  error: {
    title: "Terjadi kesalahan",
    loginRequired: "Anda harus masuk.",
    processingHistoryFetchFailed: "Gagal mengambil riwayat pemrosesan.",
    policiesFetchFailed: "Gagal mengambil daftar kebijakan.",
    usageLimitsFetchFailed: "Gagal mengambil batas penggunaan.",
    pageLoadFailed: "Gagal memuat halaman layanan.",
    suggestion1: "Silakan muat ulang halaman.",
    suggestion2: "Jika masalah berlanjut, hubungi tim dukungan."
  },
  limits: {
    notifyLimit: {
      title: "Batas notifikasi",
      limitValue: "Nilai batas:",
      exceedAction: "Tindakan saat melebihi:",
      currentUsage: "Penggunaan saat ini:",
      notSet: "Belum ada batas notifikasi yang ditetapkan",
      currentUsageLabel: "Penggunaan saat ini:",
      settingsCount: "Jumlah batas notifikasi: {count}",
      dataLimit: "Batas data: {value} {unit} ({bytes})",
      amountLimit: "Batas jumlah: ${amount}",
      noLimitValue: "Tidak ada nilai batas",
      amountConversionNote:
        "Catatan: Batas jumlah ditampilkan dalam konversi ke penggunaan data (biaya pemrosesan: $0.00001/Byte, termasuk penyimpanan 1 tahun)."
    },
    restrictLimit: {
      title: "Batas suspensi",
      limitValue: "Nilai batas:",
      exceedAction: "Tindakan saat melebihi:",
      currentUsage: "Penggunaan saat ini:",
      notSet: "Belum ada batas suspensi yang ditetapkan",
      currentUsageLabel: "Penggunaan saat ini:",
      settingsCount: "Jumlah batas suspensi: {count}",
      dataLimit: "Batas data: {value} {unit} ({bytes})",
      amountLimit: "Batas jumlah: ${amount}",
      noLimitValue: "Tidak ada nilai batas",
      amountConversionNote:
        "Catatan: Batas jumlah ditampilkan dalam konversi ke penggunaan data (biaya pemrosesan: $0.00001/Byte, termasuk penyimpanan 1 tahun)."
    },
    perMonth: "/bulan",
    notifyAction: "Notifikasi",
    restrictAction: "Suspensi"
  },
  policySelection: {
    title: "Pemilihan kebijakan",
    label: "Pilih kebijakan pemrosesan",
    placeholder: "Pilih kebijakan",
    noPolicies: "Tidak ada kebijakan yang tersedia"
  },
  fileUpload: {
    title: "Unggah file",
    selectPolicyFirst: "Silakan pilih kebijakan terlebih dahulu",
    noPoliciesAvailable: "Tidak ada kebijakan yang tersedia",
    dragAndDrop: "Seret & jatuhkan file",
    orClickToSelect: "atau klik untuk memilih",
    maxFiles: "Maksimum {max} file, masing-masing hingga 100 MB",
    supportedFormats: "Format yang didukung: gunakan format yang tercantum dalam {formats}",
    selectedFiles: "File terpilih ({count}/{max})",
    deleteAll: "Hapus semua",
    fileSizeLimit: "{name} terlalu besar. Pilih file berukuran 100 MB atau kurang.",
    pending: "Menunggu",
    uploading: "Mengunggah",
    completed: "Selesai",
    error: "Error",
    startProcessing: "Mulai pemrosesan",
    processing: "Memulai pemrosesan...",
    uploadComplete: "Unggah selesai",
    uploadCompletedMessage: "{count} file berhasil diunggah dan pemrosesan AI dimulai!",
    uploadNotAllowed: "Unggah tidak diizinkan",
    notifyLimitReached: "Batas notifikasi tercapai",
    notifyLimitReachedMessage: "Batas notifikasi ({limit}) tercapai. {count} email notifikasi telah dikirim."
  },
  table: {
    id: "ID",
    userName: "Nama pengguna",
    policyName: "Nama kebijakan",
    usageAmountBytes: "Penggunaan",
    status: "Status",
    errorDetail: "Error",
    createdAt: "Tanggal mulai",
    updatedAt: "Tanggal pembaruan",
    download: "Unduh",
    aiTraining: "Penggunaan AI",
    delete: "Hapus",
    ariaLabel: "Tabel riwayat pemrosesan data"
  },
  status: {
    in_progress: "Sedang berlangsung",
    success: "Selesai",
    failed: "Gagal",
    canceled: "Dibatalkan",
    deleted: "Dihapus",
    delete_failed: "Gagal menghapus"
  },
  notification: {
    uploadSuccess: "Unggah file selesai. Pemrosesan data akan dimulai.",
    uploadError: "Unggah gagal.",
    uploadProcessingError: "Terjadi kesalahan saat memproses unggahan.",
    uploadFailed: "Unggah file gagal. Silakan coba lagi.",
    fetchFailed: "Gagal mengambil data.",
    aiTrainingChanged: "Izin penggunaan untuk pelatihan AI telah diubah.",
    deleteCompleted: "Penghapusan file selesai.",
    uploadCompleted: "Unggah selesai.",
    uploadFailedGeneric: "Unggah gagal.",
    dataFetchFailed: "Gagal mengambil data.",
    notificationSent: "Email notifikasi telah dikirim.",
    notificationFailed: "Gagal mengirim notifikasi.",
    notificationError: "Terjadi kesalahan saat mengirim notifikasi.",
    dataUpdated: "Data telah diperbarui."
  },
  filter: {
    userName: {
      placeholder: "Cari berdasarkan nama pengguna",
      ariaLabel: "Pencarian nama pengguna"
    },
    policyName: {
      placeholder: "Cari berdasarkan nama kebijakan",
      ariaLabel: "Pencarian nama kebijakan"
    },
    dateRange: {
      label: "Rentang tanggal",
      startDate: {
        placeholder: "Tanggal mulai",
        ariaLabel: "Pilih tanggal mulai"
      },
      endDate: {
        placeholder: "Tanggal selesai",
        ariaLabel: "Pilih tanggal selesai"
      },
      separator: "~"
    },
    minUsage: {
      label: "Penggunaan minimum",
      placeholder: "Min",
      ariaLabel: "Penggunaan minimum"
    },
    maxUsage: {
      label: "Penggunaan maksimum",
      placeholder: "Maks",
      ariaLabel: "Penggunaan maksimum"
    },
    reset: "Atur ulang filter",
    rangeSeparator: "~",
    refresh: "Perbarui data",
    deleteSelected: "Hapus item terpilih"
  },
  policy: {
    select: "Pilih kebijakan",
    none: "Belum ada kebijakan yang dibuat.",
    create: "Buat kebijakan",
    noPolicies: "Belum ada kebijakan yang dibuat.",
    createPolicy: "Buat kebijakan"
  },
  deleteDialog: {
    title: "Konfirmasi penghapusan",
    warn1: "File yang dipilih akan dihapus secara permanen.",
    warn2: "Setelah dihapus, file yang telah diproses tidak dapat diunduh lagi.",
    warn3: "File juga tidak dapat digunakan untuk pelatihan AI.",
    warn4: "Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.",
    confirm: "Yakin ingin menghapus? Ketik \"DELETE\".",
    cancel: "Batal",
    delete: "Hapus"
  },
  limitUsage: {
    title: "Status batas penggunaan",
    status: {
      normal: "Normal",
      warning: "Peringatan",
      exceeded: "Melebihi"
    },
    current: "Saat ini:",
    limit: "Batas:",
    noLimit: "Tanpa batas",
    exceedAction: {
      notify: "Notifikasi",
      restrict: "Pembatasan"
    },
    testNotification: "Kirim notifikasi percobaan",
    limitTypes: {
      usage: "Batas penggunaan",
      amount: "Batas jumlah"
    },
    unknownCompany: "Perusahaan tidak dikenal"
  },
  tableEmpty: "Tidak ada riwayat pemrosesan data.",
  pagination: {
    prev: "Sebelumnya",
    next: "Berikutnya"
  },
  displayCount: "Menampilkan {shown} dari {total} (Total {all})",
  processingHistory: {
    title: "Riwayat pemrosesan",
    count: "({count} entri)",
    refresh: "Perbarui",
    empty: "Belum ada riwayat pemrosesan.",
    emptyDescription: "Unggah file dan mulai pemrosesan untuk menampilkan riwayat di sini.",
    noDownloadableFiles: "Tidak ada file yang dapat diunduh.",
    noOutputFiles: "Tidak ada file keluaran yang dapat diunduh.",
    downloadFailed: "Gagal mengunduh.",
    aiTrainingUpdateFailed: "Gagal memperbarui penggunaan pelatihan AI.",
    fileExpiredTooltip: "File dihapus karena melewati masa penyimpanan (1 tahun).",
    unknownUser: "Pengguna tidak dikenal",
    allow: "Izinkan",
    deny: "Tolak",
    columns: {
      policy: "Kebijakan",
      user: "Pengguna",
      status: "Status",
      startTime: "Waktu mulai",
      fileSize: "Ukuran file",
      aiTraining: "Penggunaan AI",
      errorDetail: "Detail error",
      download: "Unduh"
    }
  }
};

export default id;
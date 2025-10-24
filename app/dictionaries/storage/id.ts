export default {
  "table": {
    "id": "ID",
    "userName": "Nama Pengguna",
    "policyName": "Nama Kebijakan",
    "usageAmountBytes": "Penggunaan",
    "status": "Status",
    "errorDetail": "Error",
    "createdAt": "Tanggal Mulai",
    "updatedAt": "Tanggal Update",
    "download": "Unduh",
    "aiTraining": "Pelatihan AI",
    "delete": "Hapus",
    "ariaLabel": "Tabel riwayat pemrosesan data"
  },
  "status": {
    "in_progress": "Sedang Berlangsung",
    "success": "Selesai",
    "failed": "Gagal",
    "canceled": "Dibatalkan",
    "deleted": "Dihapus",
    "delete_failed": "Gagal Menghapus"
  },
  "notification": {
    "uploadSuccess": "Upload file selesai. Pemrosesan data akan dimulai.",
    "uploadError": "Upload gagal.",
    "uploadProcessingError": "Terjadi kesalahan selama pemrosesan upload.",
    "uploadFailed": "Upload file gagal. Silakan coba lagi.",
    "fetchFailed": "Gagal mengambil data.",
    "aiTrainingChanged": "Izin pelatihan AI telah diubah.",
    "deleteCompleted": "Penghapusan file selesai.",
    "uploadCompleted": "Upload selesai.",
    "uploadFailedGeneric": "Upload gagal.",
    "dataFetchFailed": "Gagal mengambil data.",
    "notificationSent": "Email notifikasi berhasil dikirim.",
    "notificationFailed": "Gagal mengirim notifikasi.",
    "notificationError": "Terjadi kesalahan saat mengirim notifikasi.",
    "dataUpdated": "Data berhasil diperbarui."
  },
  "filter": {
    "userName": {
      "placeholder": "Cari berdasarkan nama pengguna",
      "ariaLabel": "Pencarian nama pengguna"
    },
    "policyName": {
      "placeholder": "Cari berdasarkan nama kebijakan",
      "ariaLabel": "Pencarian nama kebijakan"
    },
    "dateRange": {
      "label": "Rentang tanggal",
      "startDate": {
        "placeholder": "Tanggal mulai",
        "ariaLabel": "Pemilihan tanggal mulai"
      },
      "endDate": {
        "placeholder": "Tanggal selesai",
        "ariaLabel": "Pemilihan tanggal selesai"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Penggunaan Min",
      "placeholder": "Min",
      "ariaLabel": "Penggunaan minimum"
    },
    "maxUsage": {
      "label": "Penggunaan Max",
      "placeholder": "Max",
      "ariaLabel": "Penggunaan maksimum"
    },
    "reset": "Reset Filter",
    "rangeSeparator": "~",
    "refresh": "Perbarui Data",
    "deleteSelected": "Hapus Item yang Dipilih"
  },
  "policy": {
    "select": "Pilih Kebijakan",
    "none": "Tidak ada kebijakan yang telah dibuat.",
    "create": "Buat Kebijakan",
    "noPolicies": "Tidak ada kebijakan yang telah dibuat.",
    "createPolicy": "Buat Kebijakan"
  },
  "deleteDialog": {
    "title": "Konfirmasi Hapus",
    "warn1": "File yang dipilih akan dihapus secara permanen.",
    "warn2": "Setelah dihapus, file yang diproses tidak dapat diunduh.",
    "warn3": "Juga, tidak dapat digunakan untuk pelatihan AI.",
    "warn4": "Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.",
    "confirm": "Apakah Anda yakin ingin menghapus? Silakan ketik 'HAPUS'.",
    "cancel": "Batal",
    "delete": "Hapus"
  },
  "limitUsage": {
    "title": "Status Batas Penggunaan",
    "status": {
      "normal": "Normal",
      "warning": "Peringatan",
      "exceeded": "Melebihi"
    },
    "current": "Saat ini:",
    "limit": "Batas:",
    "noLimit": "Tidak Ada Batas",
    "exceedAction": {
      "notify": "Beritahu",
      "restrict": "Batasi"
    },
    "testNotification": "Kirim Notifikasi Test",
    "limitTypes": {
      "usage": "Batas Penggunaan",
      "amount": "Batas Jumlah"
    },
    "unknownCompany": "Perusahaan Tidak Dikenal"
  },
  "tableEmpty": "Tidak ada riwayat pemrosesan data.",
  "pagination": {
    "prev": "Sebelumnya",
    "next": "Selanjutnya"
  },
  "displayCount": "Menampilkan {shown} dari {total} (Semua {all})"
} as const;



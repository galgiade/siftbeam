export default {
  label: {
    policyList: "Daftar Kebijakan",
    policyNotRegistered: "Tidak ada kebijakan terdaftar",
    policyName: "Nama Kebijakan",
    policyNamePlaceholder: "Nama Kebijakan",
    description: "Deskripsi Kebijakan",
    descriptionPlaceholder: "Deskripsi Kebijakan",
    allowedFileTypes: "Jenis File yang Diizinkan:",
    selectFileTypes: "Pilih Jenis File (Banyak)",
    fileTypes: {
      "image/jpeg": "Gambar JPEG",
      "image/png": "Gambar PNG",
      "image/gif": "Gambar GIF",
      "image/webp": "Gambar WebP",
      "application/pdf": "Berkas PDF",
      "text/csv": "Berkas CSV",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Berkas Excel (.xlsx)",
      "application/vnd.ms-excel": "Berkas Excel (.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Berkas Word (.docx)",
      "application/msword": "Berkas Word (.doc)",
      "text/plain": "Berkas Teks",
      "application/json": "Berkas JSON",
      "application/zip": "Arsip ZIP"
    }
  },
  alert: {
    required: "Kolom ini wajib diisi",
    invalidEmail: "Masukkan alamat email yang valid",
    fileTypeRequired: "Pilih setidaknya satu jenis file",
    adminOnlyEditMessage: "Hanya admin yang dapat mengedit kebijakan. Anda tidak memiliki izin untuk mengedit.",
    adminOnlyCreateMessage: "Hanya admin yang dapat membuat kebijakan. Silakan hubungi administrator Anda.",
    updateSuccess: "Kebijakan berhasil diperbarui",
    updateFailed: "Gagal memperbarui kebijakan",
    validationError: "Silakan periksa input Anda"
  },
  analysis: {
    title: "Analisis",
    description: "Hasil evaluasi Model × Dataset",
    noDataMessage: "Tidak ada data analisis tersedia",
    noDataForPolicyMessage: "Tidak ada data analisis tersedia untuk kebijakan yang dipilih",
    paginationAriaLabel: "Paginasi",
    displayCount: "Tampilan",
    columns: {
      evaluationDate: "Tanggal Evaluasi",
      policy: "Kebijakan",
      accuracy: "Akurasi",
      defectDetectionRate: "Tingkat Deteksi Cacat",
      reliability: "Keandalan",
      responseTime: "Waktu Respons",
      stability: "Stabilitas",
      actions: "Aksi"
    },
    actions: {
      view: "Lihat"
    }
  }
} as const;



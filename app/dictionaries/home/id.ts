const id = {
  hero: {
    title: "siftbeam",
    subtitle: "Platform untuk pemrosesan dan pengelolaan data yang efisien",
    contact: "Hubungi Kami",
    buttons: {
      howTo: "Lihat cara kerja",
      pricing: "Lihat harga",
    }
  },
  features: {
    title: "Tiga fitur inti platform pemrosesan data",
    dataAnalysis: {
      title: "Pengelolaan data yang fleksibel",
      description: "Unggah dan kelola file dengan kontrol berbasis kebijakan. Lacak riwayat pemrosesan secara detail.",
      points: [
        "Pemilihan kebijakan dan unggahan massal",
        "Bilah penggunaan bulanan dan peringatan kelebihan",
        "Filter berdasarkan pengguna/kebijakan/tanggal/penggunaan",
        "Unduh massal ZIP, hapus, alihkan izin pembelajaran",
      ]
    },
    anomalyDetection: {
      title: "Pemantauan dan kontrol penggunaan",
      description: "Pantau penggunaan data secara real-time dan jalankan notifikasi atau pembatasan otomatis berdasarkan batas yang dikonfigurasi.",
      points: [
        "Dua mode: beri tahu atau batasi",
        "Ambang berdasarkan penggunaan atau biaya",
        "Beri tahu atau batasi otomatis saat melebihi",
        "Tampilkan batas yang sesuai berdasarkan penggunaan saat ini",
      ]
    },
    customAI: {
      title: "Analisis hasil pemrosesan dan laporan",
      description: "Tinjau data analisis terperinci dari hasil pemrosesan dan manfaatkan untuk optimasi operasional.",
      points: [
        "Tinjau metrik terperinci dari hasil pemrosesan",
        "Indikator kinerja operasional seperti latensi",
        "Lihat dan validasi laporan terperinci",
        "Filter dan urutkan berdasarkan kebijakan",
      ]
    }
  },
  steps: {
    title: "Mulai dalam 3 langkah mudah",
    step1: {
      title: "Pengaturan kebijakan dan unggah data",
      description: "Buat kebijakan yang mendefinisikan format file yang diizinkan, lalu unggah data melalui drag & drop atau API. Autentikasi dua faktor memastikan keamanan."
    },
    step2: {
      title: "Eksekusi pemrosesan otomatis",
      description: "Data yang diunggah diproses secara otomatis berdasarkan kebijakan yang dipilih. Hasil pemrosesan disimpan selama satu tahun."
    },
    step3: {
      title: "Pengelolaan riwayat pemrosesan dan evaluasi kinerja",
      description: "Tinjau riwayat pemrosesan dengan dasbor intuitif. Pantau metrik kinerja model pemrosesan secara real-time untuk operasi optimal. Model bayar sesuai pemakaian mengoptimalkan biaya."
    }
  },
  cta: {
    title: "Mulai pemrosesan data yang efisien sekarang",
    description: "Tentukan aturan pemrosesan dengan kebijakan dan kelola volume data besar secara efisien. Harga bayar sesuai pemakaian menghilangkan biaya yang tidak perlu.",
    button: "Hubungi Kami",
    secondaryButton: "Lihat langkah penyiapan terlebih dahulu"
  }
} as const;

export default id;



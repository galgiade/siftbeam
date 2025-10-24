import type TermsLocale from "./TermsLocale";

const id: TermsLocale = {
  title: "Ketentuan Layanan (siftbeam)",
  intro:
    "Ketentuan Layanan ini (\"Ketentuan\") mengatur penggunaan siftbeam (\"Layanan\") yang disediakan oleh Connect Tech Inc. (\"Perusahaan\"). Dengan menggunakan Layanan, pengguna setuju pada Ketentuan ini.",
  sections: {
    definitions: {
      title: "Definisi",
      items: [
        "Layanan: membangun/meningkatkan model AI berdasarkan data pengguna, melakukan prediksi/clustering/klasifikasi, membuat data statistik, dan mengekspor hasil (mis. CSV).",
        "Data Pengguna: data yang diberikan pengguna kepada Perusahaan (data mentah, metadata, log, instruksi, dll.).",
        "Data Keluaran: hasil yang dihasilkan/diproses oleh Layanan (termasuk ekspor CSV).",
        "Model: model AI yang dibuat/dioperasikan/diperbaiki oleh Perusahaan (fitur, bobot terlatih, prompt, pipeline, metrik).",
        "Penagihan berbasis pemakaian: penagihan berdasarkan volume pemasukan/pemrosesan/penyimpanan data, dll.",
      ],
    },
    scopeChanges: {
      title: "Ruang Lingkup & Perubahan",
      paragraphs: [
        "Ketentuan berlaku untuk seluruh hubungan penggunaan Layanan antara Perusahaan dan pengguna.",
        "Perusahaan dapat mengubah Ketentuan dan akan memberi tahu perubahan material; penggunaan berkelanjutan setelah pemberitahuan dianggap sebagai persetujuan.",
      ],
    },
    account: {
      title: "Akun",
      items: [
        "Jaga informasi pendaftaran tetap akurat dan mutakhir; kelola kredensial secara aman.",
        "Perusahaan tidak bertanggung jawab atas penggunaan akun tidak sah kecuali karena kesengajaan/kelalaian berat Perusahaan.",
      ],
    },
    services: {
      title: "Deskripsi Layanan",
      paragraphs: [
        "Perusahaan membuat model AI sesuai kebutuhan dan melakukan prediksi/clustering/klasifikasi atau membuat data statistik.",
        "Dengan penyediaan data berkelanjutan, Perusahaan dapat meningkatkan model menggunakan data tersebut.",
        "Hasil diproses diekspor dalam format seperti CSV (format/item/frekuensi sesuai spesifikasi terpisah).",
        "Fitur dapat ditambah/diubah/dihentikan; fitur beta/eksperimental dapat disediakan.",
      ],
    },
    dataHandling: {
      title: "Penanganan Data",
      subsections: {
        ownership: {
          title: "Kepemilikan",
          items: [
            "Hak atas Data Pengguna milik pengguna.",
            "Hak atas Data Keluaran pada prinsipnya milik pengguna (pengguna memastikan tidak melanggar hak pihak ketiga).",
            "Hak IP atas model/algoritme/know-how/template milik Perusahaan atau pemberi lisensi.",
          ],
        },
        license: {
          title: "Lisensi",
          paragraphs: [
            "Pengguna memberikan hak non-eksklusif bebas royalti di seluruh dunia kepada Perusahaan untuk menggunakan Data Pengguna guna penyediaan layanan, peningkatan kualitas, pelatihan/ evaluasi/ penalaan model, dan pembuatan statistik. Data pribadi sesuai Kebijakan Privasi.",
            "Perusahaan dapat membuat/mempublikasikan/menggunakan statistik/indikator yang tidak mengidentifikasi pengguna/individu.",
          ],
        },
        storageDeletion: {
          title: "Penyimpanan & Penghapusan",
          paragraphs: [
            "Wilayah penyimpanan default Jepang (Tokyo); perubahan akan diberi tahu, pada prinsipnya, minimal 30 hari sebelumnya melalui email dan/atau notifikasi dalam produk (pengecualian untuk darurat/keharusan hukum).",
            "Pengguna dapat menghapus data secara individual. Setelah permintaan penghapusan akun: penghapusan logis dan penghapusan permanen setelah 90 hari (backup mungkin lebih lama).",
          ],
        },
        incidents: {
          title: "Insiden",
          paragraphs: [
            "Untuk penanganan gangguan, Perusahaan dapat mengakses/menggunakan Data Pengguna sebatas minimum di bawah kontrol akses dan audit; setelah terselesaikan segera hapus/anonomisasi.",
          ],
        },
        learningOptOut: {
          title: "Tidak Ikut Pembelajaran",
          paragraphs: [
            "Dapat opt-out pada tingkat akun atau berkas yang telah diproses; kualitas/akurasi dapat terpengaruh.",
          ],
        },
      },
    },
    privacy: {
      title: "Data Pribadi (Jepang)",
      paragraphs: [
        "Perusahaan menangani informasi pribadi dalam Data Pengguna sesuai APPI dan hukum/pedoman terkait.",
      ],
      items: [
        "Tujuan: penyediaan, operasi/pemeliharaan, respons, peningkatan kualitas, keamanan, kepatuhan hukum.",
        "Alih daya/sub-prosesor: mitra utama AWS (infra) dan Stripe (pembayaran); tidak ada sub-prosesor tambahan tanpa persetujuan sebelumnya (kecuali pemeliharaan/penggantian tak terhindarkan dengan perlindungan setara dan pemberitahuan).",
        "Transfer lintas batas dengan perlindungan legal seperlunya.",
        "Keamanan: kontrol akses, enkripsi, pencatatan, pemisahan tugas, manajemen kerentanan.",
        "Permintaan melalui prosedur Perusahaan (verifikasi identitas diperlukan).",
        "Retensi: hapus dalam periode wajar setelah tujuan terpenuhi/kontrak berakhir (lihat Bagian 5).",
      ],
    },
    prohibited: {
      title: "Larangan",
      items: [
        "Pelanggaran hukum/norma; pelanggaran hak pihak ketiga.",
        "Pengiriman data pribadi/sensitif tanpa dasar hukum.",
        "Akses tidak sah, rekayasa balik, beban berlebih, spam, malware.",
        "Pencemaran nama baik/pernyataan palsu.",
        "Membangun layanan pesaing tanpa persetujuan tertulis sebelumnya.",
      ],
    },
    serviceChange: {
      title: "Perubahan/Penghentian",
      paragraphs: [
        "Perusahaan dapat mengubah/menghentikan/ mengakhiri sebagian/seluruh Layanan karena pemeliharaan, gangguan, kepatuhan, keamanan, atau force majeure.",
        "Kecuali darurat, pemberitahuan sebelumnya dalam cakupan wajar.",
      ],
    },
    fees: {
      title: "Biaya/Penagihan/Pembayaran (Pemakaian)",
      subsections: {
        currencyUnit: {
          title: "Mata Uang/Unit",
          items: [
            "USD (sen AS).",
            "Diukur per byte. Dihitung per byte.",
          ],
        },
        unitPrices: {
          title: "Harga Satuan",
          items: [
            "Pemrosesan: 0,001 sen/B.",
            "Penyimpanan: 0,0001 sen/B per bulan.",
            "Tanpa kuota gratis, biaya minimum, biaya awal.",
          ],
        },
        measurementMethod: {
          title: "Pengukuran",
          items: [
            "Pemrosesan berdasarkan total unggahan bulanan termasuk ekspansi sementara, data antara, percobaan ulang.",
            "Penyimpanan berdasar rata-rata harian atau maksimum bulanan (yang lebih tinggi).",
          ],
        },
        billingPayment: {
          title: "Penagihan/Pembayaran",
          items: [
            "Penutupan: akhir bulan; Tanggal bayar: tanggal 5.",
            "Pembayaran: kartu kredit (Stripe).",
            "Pembulatan sesuai presisi/unit minimum Stripe (aturan pembulatan Perusahaan).",
            "Pajak sesuai hukum.",
            "Tanpa pengembalian untuk layanan yang sudah diberikan (kecuali diwajibkan hukum).",
            "Denda keterlambatan: 14,6% per tahun.",
          ],
        },
        priceChange: {
          title: "Perubahan Harga",
          paragraphs: [
            "Perubahan dengan pemberitahuan wajar; berlaku setelah pemberitahuan.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Kekayaan Intelektual dan Deliverable",
      paragraphs: [
        "Perusahaan mempertahankan hak atas model, template, skrip, dan alur kerja.",
        "Selama masa kontrak, pengguna dapat menggunakan Data Keluaran secara non-eksklusif untuk tujuan bisnisnya.",
        "Untuk model kustom, Perusahaan dapat menggunakan insight/bobot/fitur yang tidak mengidentifikasi pengguna untuk meningkatkan layanan lain (jika ada perjanjian terpisah, perjanjian tersebut berlaku).",
      ],
    },
    representations: {
      title: "Pernyataan dan Jaminan",
      paragraphs: [
        "Pengguna menyatakan memiliki kewenangan/persetujuan/perizinan yang sah atas Data Pengguna, tidak melanggar hak pihak ketiga, dan mematuhi hukum yang berlaku.",
        "Mengingat sifat AI, Perusahaan tidak menjamin akurasi, kelengkapan, kegunaan, kesesuaian, atau keterulangan keluaran.",
      ],
    },
    disclaimer: {
      title: "Penafian",
      paragraphs: [
        "Perusahaan tidak bertanggung jawab atas kerusakan akibat kejadian di luar kendali wajar (bencana, gangguan jaringan/cloud, perubahan hukum, tindakan melawan hukum pihak ketiga).",
        "Fitur beta/eksperimen, kode contoh, dan nilai rekomendasi disediakan apa adanya (as-is).",
      ],
    },
    liabilityLimit: {
      title: "Batasan Tanggung Jawab",
      paragraphs: [
        "Kecuali karena kesengajaan/kelalaian berat, total tanggung jawab Perusahaan dibatasi hingga total imbalan yang dibayarkan pengguna dalam 12 bulan terakhir.",
        "Pengecualian: cedera pribadi, pelanggaran IP yang disengaja, pelanggaran kerahasiaan.",
      ],
    },
    thirdParty: {
      title: "Layanan Pihak Ketiga",
      paragraphs: [
        "Layanan/API pihak ketiga (mis. AWS, Stripe) tunduk pada ketentuan masing-masing; perubahan/berhenti layanannya dapat memengaruhi fungsi tertentu.",
      ],
    },
    confidentiality: {
      title: "Kerahasiaan",
      paragraphs: [
        "Para pihak memperlakukan informasi non-publik pihak lain sebagai rahasia, tidak diungkapkan/dibocorkan ke pihak ketiga, dan tidak digunakan di luar tujuan; kewajiban ini tetap berlaku setelah berakhirnya kontrak.",
      ],
    },
    support: {
      title: "Dukungan",
      items: [
        "Dukungan hanya via chat; tidak ada telepon/panggilan video.",
        "Target respons: dalam 3 hari kerja; tanpa komitmen jam/hari tertentu.",
      ],
    },
    termTermination: {
      title: "Masa Berlaku/Pemutusan",
      items: [
        "Penggunaan mulai pada tanggal aplikasi; pemutusan melalui prosedur yang ditetapkan Perusahaan (pemutusan bulan berjalan mengikuti tenggat internal).",
        "Pelanggaran material, tunggakan pembayaran, atau keterkaitan dengan kelompok antisosial dapat berujung pada penghentian tanpa pemberitahuan.",
      ],
    },
    antisocialForces: {
      title: "Pengecualian Kelompok Antisosial",
      paragraphs: [
        "Para pihak menyatakan tidak termasuk/terlibat dalam kelompok antisosial; pelanggaran dapat mengakibatkan penghentian segera tanpa pemberitahuan.",
      ],
    },
    assignment: {
      title: "Larangan Pengalihan",
      paragraphs: [
        "Pengguna tidak boleh mengalihkan/menjaminkan status kontraktual atau hak/kewajibannya tanpa persetujuan tertulis sebelumnya dari Perusahaan.",
      ],
    },
    severabilityEntire: {
      title: "Keterpisahan/Perjanjian Keseluruhan",
      paragraphs: [
        "Jika ada ketentuan yang tidak sah/tidak dapat dilaksanakan, ketentuan lainnya tetap berlaku.",
        "Ketentuan ini merupakan perjanjian keseluruhan terkait Layanan; bila ada perjanjian terpisah, perjanjian tersebut yang berlaku.",
      ],
    },
    governingLawJurisdiction: {
      title: "Hukum/Yurisdiksi",
      paragraphs: [
        "Hukum Jepang berlaku.",
        "Yurisdiksi eksklusif: Pengadilan Distrik Hamamatsu (tingkat pertama).",
      ],
    },
    notices: {
      title: "Pemberitahuan",
      paragraphs: [
        "Kontak oleh Perusahaan via pemberitahuan dalam aplikasi, email, atau cara sesuai.",
        "Kontak pengguna: connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "14 Agustus 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Jepang",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default id;
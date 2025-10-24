import type PrivacyLocale from "./PrivacyLocale";

const id: PrivacyLocale = {
  title: "Kebijakan Privasi (termasuk DPA) | siftbeam",
  intro:
    "Kebijakan Privasi ini (" +
    "'Kebijakan') menjelaskan cara Connect Tech Inc. ('Perusahaan') memproses informasi/data pribadi dalam layanan 'siftbeam' ('Layanan'). Kebijakan ini mematuhi hukum Jepang (APPI). Ketentuan mengenai Data Processing Agreement (DPA) tercantum dalam lampiran di bawah.",
  sections: {
    definitions: {
      title: "Definisi",
      items: [
        "Informasi/Data pribadi: sebagaimana didefinisikan dalam APPI.",
        "Data Pengguna: data yang diberikan pengguna kepada Perusahaan (data mentah, log, instruksi, metadata, dll.) yang dapat mencakup informasi pribadi.",
        "Data Keluaran: hasil yang dihasilkan/diproses oleh Layanan (termasuk ekspor seperti CSV).",
        "Pemrosesan: setiap operasi termasuk pengumpulan, pencatatan, pengeditan, penyimpanan, penggunaan, penyediaan, penghapusan, dll.",
        "Pemroses/Sub-prosesor: penyedia yang ditugaskan oleh Perusahaan (mis. AWS, Stripe).",
      ],
    },
    company: {
      title: "Informasi Perusahaan",
      items: [
        "Nama: Connect Tech Inc.",
        "Alamat: Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Jepang",
        "Perwakilan: Kazuaki Matsui",
        "Kontak: connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Kategori Informasi yang Dikumpulkan",
      items: [
        "Informasi akun (nama, email, organisasi, peran, dll.)",
        "Informasi autentikasi dan log (ID autentikasi, log akses, alamat IP, informasi perangkat, cookie/teknologi serupa)",
        "Informasi pembayaran (diproses via Stripe; detail kartu dikelola oleh Stripe)",
        "Data Pengguna (data yang diunggah, data untuk pemrosesan/pembelajaran, instruksi)",
        "Komunikasi dukungan (konten chat)",
      ],
    },
    purposes: {
      title: "Tujuan Penggunaan",
      items: [
        "Penyediaan, operasional, peningkatan fitur, dan peningkatan kualitas Layanan (termasuk pelatihan, evaluasi, dan tuning model)",
        "Autentikasi, keamanan, penanganan insiden, dan analisis log",
        "Penagihan, penagihan faktur, dan pencegahan penipuan",
        "Dukungan (chat), pemberitahuan, dan pembaruan kebijakan/syarat",
        "Pembuatan dan publikasi informasi statistik (hanya dalam bentuk yang tidak mengidentifikasi individu atau pengguna tertentu)",
        "Kepatuhan hukum dan perlindungan hak",
      ],
    },
    storageDeletion: {
      title: "Lokasi Penyimpanan, Retensi, dan Penghapusan",
      paragraphs: [
        "Wilayah penyimpanan: pada prinsipnya Jepang (wilayah Tokyo). Perubahan akan diberitahukan sebelumnya.",
        "Untuk perubahan wilayah, pada prinsipnya pemberitahuan dilakukan minimal 30 hari sebelumnya melalui email dan/atau pemberitahuan dalam produk (kecuali dalam keadaan darurat/ketentuan hukum).",
        "Periode retensi: data yang telah diproses disimpan selama 1 tahun dan kemudian dihapus secara otomatis. Pengguna dapat menghapus data secara individual.",
        "Penghapusan akun: penghapusan logis setelah permintaan dan penghapusan permanen setelah 90 hari (cadangan mungkin memerlukan waktu tambahan).",
        "Jika terjadi masalah teknis: Perusahaan dapat mengakses/menggunakan Data Pengguna yang minimum diperlukan untuk investigasi dan resolusi; setelah itu akan segera dihapus atau dianonimkan.",
      ],
    },
    thirdParties: {
      title: "Penyediaan ke Pihak Ketiga, Penggunaan Bersama, dan Alih Daya",
      items: [
        "Penyediaan kepada pihak ketiga: tidak dilakukan tanpa persetujuan kecuali diwajibkan oleh hukum.",
        "Alih daya: pemroses utama adalah AWS (infrastruktur) dan Stripe (pembayaran). Perusahaan melakukan pengawasan yang sesuai.",
        "Sub-prosesor: tidak ada sub-proses lebih lanjut tanpa izin pengguna sebelumnya (jika penggantian tidak terhindarkan, perlindungan setara/lebih ketat diberlakukan dan ada pemberitahuan terlebih dahulu).",
        "Transfer internasional: karena Stripe dan lain-lain, data dapat disimpan/diproses di luar Jepang (mis. AS) dan perlindungan hukum akan diterapkan.",
      ],
      paragraphs: [
        "Jika terjadi transfer internasional, Perusahaan menerapkan perlindungan yang sesuai seperti SCC UE, UK IDTA/UK SCC Addendum, dan Swiss FDPIC Addendum (lihat Lampiran B).",
      ],
    },
    learningOptOut: {
      title: "Penggunaan Pembelajaran dan Opt-out",
      items: [
        "Data Pengguna dapat digunakan untuk peningkatan model.",
        "Opt-out: pengguna dapat mengecualikan data dari pembelajaran pada level akun atau per 'file yang telah diproses'. Hal ini dapat memengaruhi kualitas.",
      ],
    },
    security: {
      title: "Keamanan",
      items: [
        "Penerapan kontrol akses, enkripsi saat transit/di penyimpanan, pemisahan wewenang, log audit, dan manajemen kerentanan.",
        "Kewajiban kerahasiaan dan pelatihan bagi personel dan pemroses.",
        "Jika terjadi pelanggaran yang signifikan, langkah-langkah akan diambil dan pemberitahuan kepada otoritas/individu dilakukan sesuai hukum.",
      ],
    },
    userRights: {
      title: "Hak Pengguna",
      paragraphs: [
        "Pengguna dapat meminta pengungkapan, koreksi, penambahan, penghapusan, penghentian penggunaan, atau penghentian penyediaan kepada pihak ketiga (memerlukan verifikasi identitas). Kontak: connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Dasar Hukum dan Peran (Pengendali/Prosesor)",
      items: [
        "Untuk informasi pribadi terkait manajemen akun, penagihan, dan operasi Layanan, Perusahaan bertindak sebagai 'operator bisnis' (setara dengan pengendali).",
        "Untuk Data Pengguna yang dipercayakan oleh klien (diproses dalam tujuan klien), Perusahaan bertindak sebagai 'prosesor'.",
        "Jika hukum negara bagian AS (mis. CCPA/CPRA) berlaku, Perusahaan akan mematuhi kewajiban sebagai 'penyedia layanan/prosesor' (lihat Lampiran C).",
        "Kebijakan ini didasarkan pada hukum Jepang; jika Layanan tunduk pada yurisdiksi lain (mis. UE/EEA), langkah tambahan (mis. SCC) akan diterapkan sesuai kebutuhan.",
      ],
    },
    cookies: {
      title: "Cookie dan Teknologi Serupa",
      paragraphs: [
        "Kami dapat menggunakan cookie/teknologi serupa untuk kegunaan, keamanan, dan analitik. Anda dapat menonaktifkannya di pengaturan browser, namun beberapa fungsi dapat terpengaruh.",
      ],
    },
    minors: {
      title: "Informasi Pribadi Anak di Bawah Umur",
      paragraphs: [
        "Sebagai aturan, Layanan tidak ditujukan untuk digunakan oleh anak di bawah umur tanpa persetujuan orang tua.",
      ],
    },
    policyChanges: {
      title: "Perubahan Kebijakan Ini",
      paragraphs: [
        "Perubahan material akan diberitahukan sebelumnya. Penggunaan berkelanjutan setelah pemberitahuan dianggap sebagai persetujuan atas perubahan.",
      ],
    },
    contact: {
      title: "Kontak",
      paragraphs: [
        "Untuk pertanyaan terkait penanganan informasi pribadi, hubungi: connectechceomatsui@gmail.com. Dukungan hanya melalui chat; kami menargetkan respons dalam tiga hari kerja.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Lampiran A | Klausul Perjanjian Pemrosesan Data (DPA)",
      subsections: {
        roles: {
          title: "A-1. Peran",
          paragraphs: [
            "Klien adalah pengendali; Perusahaan adalah pemroses dan memproses Data Pengguna sesuai instruksi klien.",
          ],
        },
        scope: {
          title: "A-2. Tujuan dan Cakupan",
          items: [
            "Tujuan: penyediaan siftbeam, pembuatan/peningkatan model, pembuatan keluaran, pemeliharaan/dukungan, keamanan, penagihan.",
            "Data yang diproses: data pribadi yang dikirimkan klien (mis.: nama, pengenal, kontak, atribut, log).",
            "Subjek data: pelanggan, pengguna, karyawan klien.",
          ],
        },
        processorDuties: {
          title: "A-3. Kewajiban Pemroses",
          items: [
            "Memproses hanya sesuai instruksi tertulis (termasuk elektronik) klien.",
            "Menjaga kerahasiaan.",
            "Memelihara langkah-langkah keamanan teknis dan organisasi yang sesuai.",
            "Jika menerima langsung permintaan subjek data, segera meneruskan ke klien dan bekerja sama.",
            "Memberi tahu klien tanpa penundaan yang tidak semestinya dalam hal pelanggaran dan bekerja sama dalam perbaikan.",
            "Bekerja sama dengan audit/permintaan akuntabilitas klien dalam cakupan wajar di bawah kerahasiaan/keamanan yang memadai.",
            "Saat pemrosesan berakhir, menghapus atau mengembalikan data pribadi sesuai pilihan klien (kecuali diwajibkan penyimpanan oleh hukum).",
          ],
        },
        subProcessors: {
          title: "A-4. Sub-prosesor",
          items: [
            "Sub-prosesor yang ada: AWS (infrastruktur), Stripe (pembayaran).",
            "Tidak ada subproses lebih lanjut di luar yang disebutkan tanpa izin awal klien; jika penggantian tak terhindarkan, pastikan perlindungan setara/lebih kuat dan pemberitahuan terlebih dahulu.",
            "Mewajibkan kewajiban perlindungan data setara DPA ini pada semua sub-prosesor.",
          ],
        },
        internationalTransfer: {
          title: "A-5. Transfer Internasional",
          paragraphs: [
            "Jika pemrosesan berlangsung di luar Jepang, Perusahaan menerapkan perlindungan yang diwajibkan hukum yang berlaku (mis.: klausul kontraktual, pemberitahuan yang disyaratkan).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Retensi dan Penghapusan",
          paragraphs: [
            "Setelah instruksi klien atau berakhirnya kontrak, Perusahaan akan menghapus atau mengembalikan data pribadi dalam jangka waktu yang wajar; cadangan dihapus/ditimpa secara aman.",
          ],
        },
        auditReporting: {
          title: "A-7. Audit dan Pelaporan",
          paragraphs: [
            "Klien dapat melakukan audit (mis.: peninjauan dokumen) dengan pemberitahuan yang wajar dan cakupan yang sesuai; Perusahaan akan bekerja sama.",
          ],
        },
        liability: {
          title: "A-8. Tanggung Jawab",
          paragraphs: [
            "Pembagian tanggung jawab mengikuti Ketentuan Layanan dan DPA ini. Untuk kerusakan akibat kesengajaan/kelalaian berat (mis.: pelanggaran kewajiban keamanan), tanggung jawab Perusahaan dibatasi sesuai Ketentuan Layanan.",
          ],
        },
        learningInstruction: {
          title: "A-9. Instruksi Pembelajaran",
          paragraphs: [
            "Klien dapat menentukan izin penggunaan pembelajaran pada tingkat akun atau per berkas tertentu; Perusahaan akan mematuhinya.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Lampiran B | Klausul Transfer Internasional (SCC/UK/Swiss)",
      subsections: {
        applicability: {
          title: "B-1. Berlaku",
          paragraphs: [
            "Untuk transfer dari UE/EEA, diterapkan SCC (2021/914).",
            "Modul: Pengendali→Pemroses (Modul 2) dan Pemroses→Pemroses (Modul 3) sesuai kebutuhan.",
            "Untuk UK: UK IDTA atau UK SCC Addendum; untuk Swiss: FDPIC Addendum.",
          ],
        },
        keyChoices: {
          title: "B-2. Pilihan Utama",
          items: [
            "Klausul 7 (Docking Clause): berlaku.",
            "Klausul 9 (Sub-prosesor): otorisasi umum; sub-prosesor saat ini (AWS, Stripe). Perubahan/baru diberitahukan ~15 hari sebelumnya pada prinsipnya.",
            "Klausul 11 (Redress): tidak berlaku (sesuai hukum).",
            "Klausul 17 (Hukum yang Mengatur): hukum Irlandia.",
            "Klausul 18 (Forum): pengadilan Irlandia.",
          ],
        },
        dpa: {
          title: "B-3. Otoritas Pengawas",
          paragraphs: [
            "Otoritas pengawas utama yang dimaksud: DPC Irlandia, kecuali disepakati lain.",
          ],
        },
        annexI: {
          title: "B-4. Annex I (Detail Transfer)",
          items: [
            "Para pihak: eksportir data (klien) dan importir data (Perusahaan).",
            "Subjek data: pelanggan, pengguna, karyawan klien.",
            "Kategori data: pengenal, kontak, log perilaku, transaksi, instruksi/metadata (sesuai instruksi klien).",
            "Kategori khusus: secara prinsip tidak diharapkan; jika ada, memerlukan kesepakatan sebelumnya.",
            "Tujuan: penyediaan siftbeam, pembuatan/peningkatan model (dapat opt-out), pemeliharaan/keamanan, penagihan, dukungan.",
            "Retensi: hingga tujuan tercapai; setelah kontrak berakhir, hapus/kembalikan (kecuali retensi legal).",
            "Frekuensi pengiriman: berkelanjutan/adhoc.",
          ],
        },
        annexII: {
          title: "B-5. Annex II (Tindakan Teknis & Organisasi)",
          items: [
            "Kontrol akses (hak minimal, MFA, pemisahan tugas)",
            "Enkripsi data (TLS saat transit, AES-256 saat disimpan)",
            "Manajemen kunci (rotasi, KMS)",
            "Pencatatan/audit (tahan gangguan, peringatan)",
            "Pengembangan/operasi aman (SDLC aman, manajemen kerentanan, pemantauan dependensi)",
            "Ketersediaan (backup, redundansi intra-wilayah, rencana DR)",
            "Manajemen vendor (penilaian/kontrak sub-prosesor)",
            "Proses hak subjek data",
            "Respons insiden (deteksi, pengendalian, analisis akar penyebab, notifikasi)",
          ],
        },
        annexIII: {
          title: "B-6. Annex III (Sub-prosesor)",
          items: [
            "AWS (infrastruktur/hosting, utama wilayah Tokyo)",
            "Stripe (pembayaran)",
            "Penambahan akan diberitahukan sebelumnya dan dikenai perlindungan setara/lebih kuat.",
          ],
        },
        govRequests: {
          title: "B-7. Permintaan Pemerintah",
          paragraphs: [
            "Kecuali dilarang oleh hukum, memberi tahu eksportir tanpa penundaan; menelaah legalitas permintaan dan meminimalkan cakupan; laporan transparansi dapat diberikan.",
          ],
        },
        tia: {
          title: "B-8. TIA (Penilaian Dampak Transfer)",
          paragraphs: [
            "Jika diperlukan, Perusahaan akan bekerja sama secara wajar dengan TIA eksportir dan memberikan informasi yang relevan.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Lampiran C | Adendum Hukum Negara Bagian AS (CCPA/CPRA, dll.)",
      subsections: {
        c1: {
          title: "C-1. Peran dan Pembatasan Tujuan",
          paragraphs: [
            "Perusahaan bertindak sebagai 'penyedia layanan/pemroses' dan memproses informasi pribadi hanya untuk tujuan bisnis klien.",
          ],
        },
        c2: {
          title: "C-2. Larangan Penjualan/ Berbagi",
          paragraphs: [
            "Perusahaan tidak 'menjual' atau 'membagikan' informasi pribadi (termasuk iklan perilaku lintas konteks).",
          ],
        },
        c3: {
          title: "C-3. Larangan Penggunaan Sekunder",
          paragraphs: [
            "Perusahaan tidak menggunakan informasi pribadi untuk tujuan independennya (kecuali penggunaan statistik/anonim yang diizinkan).",
          ],
        },
        c4: {
          title: "C-4. Keamanan",
          paragraphs: [
            "Menjaga keamanan yang wajar dan, jika terjadi pelanggaran, memberi tahu serta membantu klien.",
          ],
        },
        c5: {
          title: "C-5. Kerja Sama atas Hak Konsumen",
          paragraphs: [
            "Bekerja sama secara wajar untuk permintaan akses, penghapusan, koreksi, dan opt-out; menghormati sinyal GPC jika berlaku.",
          ],
        },
        c6: {
          title: "C-6. Sub-prosesor",
          paragraphs: [
            "Meneruskan kewajiban setara kepada sub-prosesor dan memberi pemberitahuan wajar atas perubahan.",
          ],
        },
        c7: {
          title: "C-7. Pencatatan dan Audit",
          paragraphs: [
            "Memelihara catatan yang diperlukan untuk kepatuhan CCPA/CPRA dan bekerja sama secara wajar dengan audit klien.",
          ],
        },
      },
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
import type FAQLocale from './faq.d';

const id: FAQLocale = {
  title: 'Pertanyaan yang Sering Diajukan (FAQ)',
  description: 'Temukan jawaban untuk pertanyaan umum tentang layanan pemrosesan data siftbeam.',
  categories: {
    service: {
      title: 'Ikhtisar Layanan',
      items: [
        {
          question: 'Apa itu siftbeam?',
          answer: 'siftbeam adalah layanan pemrosesan data B2B untuk perusahaan. Kami menyediakan alur kerja pemrosesan data yang dapat disesuaikan untuk setiap klien, memungkinkan transformasi, pemrosesan, dan pengelolaan file otomatis pada infrastruktur cloud yang aman.'
        },
        {
          question: 'Untuk jenis perusahaan apa yang cocok?',
          answer: [
            'Ideal untuk:',
            '• Perusahaan yang memerlukan pemrosesan data khusus',
            '• Perusahaan dengan kebutuhan transformasi data yang kompleks',
            '• Organisasi yang mencari solusi pemrosesan data yang dapat diskalakan',
            '• Bisnis yang memerlukan alur kerja data berbasis cloud yang aman'
          ]
        },
        {
          question: 'Apa perbedaan siftbeam dari layanan pemrosesan data lainnya?',
          answer: [
            'Fitur utama:',
            '• Kustomisasi per klien: Tidak seperti alat generik, siftbeam menawarkan alur kerja yang sepenuhnya dapat disesuaikan',
            '• Keandalan tingkat perusahaan: Dibangun di atas infrastruktur cloud yang terbukti',
            '• Tidak ada penguncian vendor: Format data standar dan API terbuka',
            '• Harga transparan: Bayar hanya untuk yang Anda gunakan'
          ]
        }
      ]
    },
    features: {
      title: 'Fitur & Spesifikasi',
      items: [
        {
          question: 'Fitur apa yang tersedia?',
          answer: [
            'Fitur utama:',
            '• Manajemen data yang fleksibel: Upload dan manajemen file berbasis kebijakan',
            '• Pemantauan dan kontrol penggunaan: Pemantauan real-time dengan notifikasi dan pembatasan otomatis',
            '• Analisis hasil pemrosesan: Metrik terperinci dan laporan untuk optimasi operasional',
            '• Penyimpanan file yang aman: Pemrosesan file terenkripsi dengan retensi otomatis 1 tahun',
            '• Dukungan multibahasa: Tersedia dalam 9 bahasa (Jepang, Inggris, Mandarin, Korea, Prancis, Jerman, Spanyol, Portugis, Indonesia)'
          ]
        },
        {
          question: 'Berapa lama data disimpan?',
          answer: 'Data yang diunggah secara otomatis disimpan selama 1 tahun setelah pemrosesan. Data dihapus secara otomatis setelah 1 tahun. Tidak ada biaya penyimpanan tambahan.'
        },
        {
          question: 'Format data apa yang didukung?',
          answer: 'Kami mendukung format data utama termasuk CSV, JSON, dan lainnya. Karena kami menawarkan kustomisasi per klien, silakan hubungi kami jika Anda memerlukan dukungan format tertentu.'
        },
        {
          question: 'Seberapa dapat disesuaikan pemrosesan data?',
          answer: 'Sepenuhnya dapat disesuaikan untuk setiap klien. Anda dapat membangun alur kerja pemrosesan data yang kompleks dan menentukan aturan pemrosesan secara fleksibel menggunakan kebijakan.'
        }
      ]
    },
    pricing: {
      title: 'Harga & Pembayaran',
      items: [
        {
          question: 'Bagaimana struktur harganya?',
          answer: [
            'Harga bayar sesuai penggunaan:',
            '• Biaya pemrosesan data: $0.00001 per byte (0.001 sen per byte)',
            '• Penyimpanan 1 tahun termasuk: Tanpa biaya tambahan',
            '• Tanpa biaya awal: Tanpa biaya pengaturan atau biaya minimum',
            '• Penagihan bulanan: Penggunaan dari tanggal 1 hingga akhir bulan, ditagih pada tanggal 1 bulan berikutnya',
            '',
            'Contoh harga:',
            '• File kecil (100B): $0.001',
            '• File besar (2MB × 3 file = 6,291,456B): $62.91'
          ]
        },
        {
          question: 'Metode pembayaran apa yang tersedia?',
          answer: 'Hanya pembayaran kartu kredit (melalui Stripe). Mata uangnya adalah USD. Biaya bulanan ditagih secara otomatis pada tanggal 1 setiap bulan untuk penggunaan bulan sebelumnya.'
        },
        {
          question: 'Apakah ada uji coba gratis?',
          answer: 'Saat ini kami tidak menawarkan uji coba gratis. Dengan harga bayar sesuai penggunaan kami, Anda hanya membayar untuk apa yang Anda gunakan. Tidak ada biaya penggunaan minimum.'
        },
        {
          question: 'Bisakah harga berubah?',
          answer: 'Harga dapat berubah dengan pemberitahuan sebelumnya yang wajar. Silakan periksa halaman harga untuk informasi terbaru.'
        }
      ]
    },
    security: {
      title: 'Keamanan & Kepatuhan',
      items: [
        {
          question: 'Bagaimana keamanan data dijamin?',
          answer: [
            'Kami menerapkan langkah-langkah keamanan berikut:',
            '• Autentikasi: Sistem autentikasi aman dengan dukungan autentikasi multifaktor (MFA)',
            '• Enkripsi: TLS untuk data dalam transit, AES-256 untuk data saat istirahat',
            '• Kontrol akses: Kontrol akses berbasis peran berdasarkan prinsip hak istimewa paling sedikit',
            '• Log audit: Pencatatan log audit anti-rusak',
            '• Manajemen kerentanan: Pemantauan keamanan berkelanjutan dan respons kerentanan'
          ]
        },
        {
          question: 'Di mana data disimpan?',
          answer: 'Data disimpan pada infrastruktur cloud tingkat perusahaan. Semua data dienkripsi dan dikelola di bawah kontrol akses yang ketat.'
        },
        {
          question: 'Bagaimana dengan kepatuhan?',
          answer: [
            'Kami mematuhi peraturan perlindungan data berikut:',
            '• GDPR: Mematuhi Peraturan Perlindungan Data Umum UE',
            '• CCPA/CPRA: Mematuhi undang-undang privasi California',
            '• Hukum Jepang: Mematuhi Undang-Undang Perlindungan Informasi Pribadi',
            '• Transfer data internasional: Perlindungan yang sesuai seperti Klausul Kontrak Standar (SCC) UE',
            '',
            'Kami menyediakan Kebijakan Privasi yang komprehensif dan Perjanjian Pemrosesan Data (DPA). Silakan lihat Kebijakan Privasi kami untuk detail lebih lanjut.'
          ]
        }
      ]
    },
    support: {
      title: 'Dukungan & Lainnya',
      items: [
        {
          question: 'Bagaimana cara mendapatkan dukungan?',
          answer: [
            'Opsi dukungan:',
            '• Metode kontak: Dukungan obrolan (tersedia melalui dasbor layanan)',
            '• Bahasa: Dukungan dalam 9 bahasa (Jepang, Inggris, Mandarin, Korea, Prancis, Jerman, Spanyol, Portugis, Indonesia)',
            '• Waktu respons: Biasanya merespons dalam 3 hari kerja',
            '• Jam kerja: Waktu Standar Jepang (JST)'
          ]
        },
        {
          question: 'Bagaimana cara memulai?',
          answer: [
            'Mulai dalam 3 langkah sederhana:',
            '1. Daftar (https://siftbeam.com/id/signup/auth)',
            '2. Unggah file data Anda',
            '3. Konfigurasikan alur kerja pemrosesan Anda',
            '4. Pantau pemrosesan secara real-time',
            '5. Unduh hasil yang diproses'
          ]
        },
        {
          question: 'Apakah API disediakan?',
          answer: 'Ya, kami menyediakan API untuk upload data dan manajemen pemrosesan. Dokumentasi terperinci dan kode contoh tersedia setelah pendaftaran.'
        }
      ]
    }
  }
};

export default id;


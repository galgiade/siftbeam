import type { CommonLocale } from './common.d.ts';

const id: CommonLocale = {
  common: {
    navigation: {
      home: 'Beranda',
      about: 'Tentang',
      pricing: 'Harga',
      contact: 'Kontak',
      signIn: 'Masuk',
      signUp: 'Daftar',
      signOut: 'Keluar',
      dashboard: 'Dasbor',
      flow: 'Alur',
      announcement: 'Pengumuman',
      services: 'Layanan',
      myPage: 'Halaman Saya',
      supportCenter: 'Pusat Dukungan',
    },
    footer: {
      title: 'siftbeam',
      description:
        'Platform analitik prediktif cerdas yang melepaskan kekuatan data untuk membentuk masa depan bisnis Anda.',
      links: {
        terms: 'Ketentuan Layanan',
        privacy: 'Kebijakan Privasi',
        legalDisclosures: 'Pengungkapan Hukum',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: 'Seret & Lepas File',
      or: 'atau',
      selectFile: 'Pilih File',
      maxFilesAndSize: 'Maks {maxFiles} file, {maxFileSize}MB masing-masing',
      supportedFormats: 'Format yang didukung: Gambar, Video, Audio, Dokumen',
      pendingFiles: 'Tertunda ({count} file)',
      uploadStart: 'Mulai Unggah',
      uploading: 'Mengunggah...',
      uploadedFiles: 'Diunggah ({count} file)',
      uploadComplete: 'Unggah Selesai',
      uploadError: 'Kesalahan Unggah',
      uploadFailed: 'Unggah gagal',
      maxFilesExceeded: 'Anda dapat mengunggah hingga {maxFiles} file.',
      fileSizeExceeded: 'Ukuran file harus {maxFileSize}MB atau kurang.\nFile terlalu besar: {files}',
      oversizedFiles: 'File terlalu besar',
    },
  },
};

export default id;

import type { APIKeyLocale } from './apiKey.d';

const id: APIKeyLocale = {
  title: 'Manajemen Kunci API',
  actions: {
    create: 'Buat',
    edit: 'Edit',
    delete: 'Hapus',
    save: 'Simpan',
    cancel: 'Batal',
    back: 'Kembali',
  },
  table: {
    apiName: 'Nama API',
    description: 'Deskripsi',
    createdAt: 'Dibuat pada',
    endpoint: 'Endpoint',
    actions: 'Aksi',
  },
  modal: {
    title: 'Edit Kunci API',
    apiName: 'Nama API',
    description: 'Deskripsi',
  },
  messages: {
    noData: 'Tidak ada data',
    updateFailed: 'Gagal memperbarui',
    deleteFailed: 'Gagal menghapus',
    confirmDelete: 'Hapus kunci API ini? Tindakan ini tidak dapat dibatalkan.',
    createFailed: 'Gagal membuat',
    idRequired: 'id diperlukan',
    deleteSuccess: 'Berhasil dihapus',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME tidak diatur',
    apiGatewayDeleteFailed: 'Gagal menghapus kunci API Gateway',
    idAndApiNameRequired: 'id dan apiName diperlukan',
    updateSuccess: 'Berhasil diperbarui',
  },
  alerts: {
    adminOnlyCreate: 'Hanya administrator yang dapat membuat',
    adminOnlyEdit: 'Hanya administrator yang dapat mengedit',
    adminOnlyDelete: 'Hanya administrator yang dapat menghapus',
  },
  create: {
    title: 'Terbitkan Kunci API',
    fields: {
      apiName: 'Nama API',
      apiDescription: 'Deskripsi API',
      policy: 'Tipe API (Kebijakan)',
    },
    submit: 'Terbitkan Kunci API',
    issuedNote: 'Kunci hanya ditampilkan sekali. Simpan dengan aman.',
    endpointLabel: 'Endpoint Upload',
    instructions: 'Konfigurasikan yang berikut di perangkat Anda.',
    apiKeyHeaderLabel: 'Kunci API (header x-api-key)',
    uploadExampleTitle: 'Contoh upload (PowerShell / PNG)',
    csvNote: 'Untuk CSV, atur Content-Type ke text/csv. Sesuaikan untuk jenis file lain.',
    filePathNote: 'Tentukan path ke file Anda',
  },
};

export default id;
export const announcement = {
  locale: 'id',
  hero: {
    title: 'Pengumuman',
    subtitle: 'Periksa pengumuman terbaru',
  },
  table: {
    date: 'Tanggal',
    category: 'Kategori',
    title: 'Judul',
    priority: 'Prioritas',
    action: 'Aksi',
    viewDetails: 'Lihat Detail',
    noAnnouncements: 'Tidak ada pengumuman tersedia',
  },
  category: {
    price: 'Harga',
    feature: 'Fitur',
    other: 'Lainnya',
  },
  priority: {
    high: 'Prioritas Tinggi',
    medium: 'Prioritas Menengah',
    low: 'Prioritas Rendah',
  },
  error: {
    fetchFailed: 'Gagal mengambil pengumuman',
    notFound: 'Pengumuman tidak ditemukan',
  },
  detail: {
    backToList: 'Kembali ke Pengumuman',
    noContent: 'Tidak ada konten tersedia',
  },
  categoryDisplay: {
    price: 'Harga',
    feature: 'Fitur',
    other: 'Lainnya',
  },
} as const;

export default announcement;

---
slug: siftbeam-quick-start-guide
title: "Cara Menggunakan siftbeam: Panduan Lengkap Alur Layanan"
description: "Pelajari alur lengkap pemrosesan data dengan siftbeam, dijelaskan dengan cara yang mudah dipahami untuk pemula. Panduan langkah demi langkah dari pembuatan akun hingga konfigurasi kebijakan, pembuatan grup, pemrosesan file, dan pengunduhan hasil."
author: Tim Editorial siftbeam
publishedAt: 2025-01-16
category: tutorial
tags:
  - Tutorial
  - Cara Penggunaan
  - Panduan Pemula
  - Panduan Lengkap
  - Pemrosesan Data
readingTime: 15 menit
---

# Cara Menggunakan siftbeam: Panduan Lengkap Alur Layanan

## Daftar Isi

1. [Apa yang Akan Anda Pelajari](#apa-yang-akan-anda-pelajari)
2. [Gambaran Umum Alur Layanan](#gambaran-umum-alur-layanan)
3. [Prasyarat](#prasyarat)
4. [Langkah 1: Pembuatan Akun dan Pendaftaran Perusahaan](#langkah-1-pembuatan-akun-dan-pendaftaran-perusahaan)
5. [Langkah 2: Meminta Kebijakan melalui Pesanan Baru](#langkah-2-meminta-kebijakan-melalui-pesanan-baru)
6. [Langkah 3: Membuat Grup](#langkah-3-membuat-grup)
7. [Langkah 4: Memproses File di Halaman Layanan](#langkah-4-memproses-file-di-halaman-layanan)
8. [Langkah 5: Meninjau dan Mengunduh Hasil](#langkah-5-meninjau-dan-mengunduh-hasil)
9. [Langkah Selanjutnya](#langkah-selanjutnya)

## Apa yang Akan Anda Pelajari

Dengan membaca artikel ini, Anda akan dapat:

- ✅ Memahami alur lengkap layanan siftbeam
- ✅ Membuat akun dan mendaftarkan informasi perusahaan
- ✅ Meminta kebijakan (konfigurasi pemrosesan) melalui pesanan baru
- ✅ Membuat grup dan menghubungkan pengguna dengan kebijakan
- ✅ Mengunggah file dan menjalankan pemrosesan di halaman layanan
- ✅ Meninjau dan mengunduh hasil pemrosesan

**Waktu yang Diperlukan**: Pengaturan awal membutuhkan beberapa hari hingga 1 minggu (termasuk konsultasi kebijakan), pemrosesan selanjutnya membutuhkan beberapa menit

**Tingkat Kesulitan**: ★★☆☆☆ (Cocok untuk pemula)

## Gambaran Umum Alur Layanan

siftbeam adalah layanan B2B yang menyediakan pemrosesan data yang disesuaikan untuk setiap perusahaan. Alur untuk mulai menggunakan layanan adalah sebagai berikut:

```
1. Pembuatan Akun & Pendaftaran Perusahaan
   ↓
2. Meminta Kebijakan (Konfigurasi Pemrosesan) melalui Pesanan Baru
   ↓
3. Kebijakan Selesai (Dikonfigurasi oleh Tim Kami)
   ↓
4. Membuat Grup (Menghubungkan Pengguna dengan Kebijakan)
   ↓
5. Mengunggah File & Memproses di Halaman Layanan
   ↓
6. Mengunduh Hasil Pemrosesan
```

**Poin Penting**:
- Fitur utama siftbeam adalah "kustomisasi per pelanggan"
- Pengaturan awal memerlukan konsultasi kebijakan (konfigurasi pemrosesan)
- Setelah kebijakan dikonfigurasi, Anda dapat memproses data secara berulang

## Prasyarat

Sebelum memulai, siapkan hal-hal berikut:

### Item yang Diperlukan

- **Alamat Email**: Digunakan untuk pendaftaran akun
- **Informasi Perusahaan**: Nama perusahaan, alamat, dan informasi dasar lainnya
- **File Data untuk Diproses**: CSV, JSON, Excel, dll. (sebagai file sampel)

### Lingkungan yang Direkomendasikan

- **Browser**: Chrome, Firefox, Safari, Edge (versi terbaru)
- **Koneksi Internet**: Lingkungan koneksi yang stabil

## Langkah 1: Pembuatan Akun dan Pendaftaran Perusahaan

### 1-1. Pendaftaran

Kunjungi [halaman pendaftaran siftbeam](https://siftbeam.com/id/signup/auth).

**Informasi yang Diperlukan**:
- **Alamat Email**: Alamat email bisnis
- **Kata Sandi**: 8 karakter atau lebih, termasuk huruf, angka, dan simbol

Setelah verifikasi email, Anda akan diarahkan ke layar login.

### 1-2. Mendaftarkan Informasi Perusahaan

Pendaftaran informasi perusahaan diperlukan pada login pertama.

**Bidang Wajib**:
- Nama Perusahaan
- Negara
- Kode Pos
- Negara Bagian/Provinsi
- Kota
- Alamat Baris 1
- Nomor Telepon
- Email Penagihan

**Bidang Opsional**:
- Alamat Baris 2 (Nama gedung, nomor kamar, dll.)

### 1-3. Membuat Akun Administrator

Setelah mendaftarkan informasi perusahaan, buat akun administrator.

- Nama
- Alamat Email
- Kata Sandi

Pembuatan akun sekarang selesai. Anda dapat mengakses dashboard.

## Langkah 2: Meminta Kebijakan melalui Pesanan Baru

Kebijakan mendefinisikan "jenis pemrosesan data apa yang akan dilakukan". Karena siftbeam menyediakan pemrosesan yang disesuaikan untuk setiap pelanggan, Anda harus terlebih dahulu meminta konsultasi kebijakan.

### 2-1. Navigasi ke Halaman Pesanan Baru

1. Klik "Pesanan Baru" di dashboard
2. Klik tombol "Buat"

### 2-2. Meminta Konfigurasi Pemrosesan

Isi informasi berikut dalam formulir pesanan baru:

**Bidang Wajib**:
- **Jenis Data**: Pilih dari Data Terstruktur, Data Tidak Terstruktur, Campuran, atau Lainnya
- **Jenis Model**: Pilih dari Klasifikasi, Regresi, Pengelompokan, atau Lainnya
- **Subjek**: Deskripsi singkat tentang kebutuhan pemrosesan
- **Detail**: Deskripsi spesifik tentang pemrosesan data yang diperlukan

**Contoh**:
```
Jenis Data: Data Terstruktur
Jenis Model: Klasifikasi
Subjek: Transformasi Data File CSV

Detail:
- Input: CSV data pelanggan (nama, alamat, nomor telepon, dll.)
- Pemrosesan: Normalisasi alamat, standarisasi format nomor telepon
- Output: File CSV yang diformat
- Frekuensi: Sekitar sekali per minggu
- Volume Data: Sekitar 10.000 catatan per batch
```

### 2-3. Lampirkan File Sampel (Opsional)

Melampirkan file sampel dari data yang ingin Anda proses memungkinkan estimasi yang lebih akurat.

- Maksimal 10 file
- Hingga 50 MB per file

### 2-4. Kirim dan Tinjau

Setelah mengirimkan formulir, tim kami akan meninjau konten dan:

1. **Konfirmasi Persyaratan Pemrosesan**: Mendengarkan kebutuhan
2. **Berikan Estimasi**: Perkiraan biaya pemrosesan
3. **Buat Kebijakan**: Konfigurasi alur pemrosesan
4. **Eksekusi Uji**: Verifikasi operasi dengan data sampel

**Waktu yang Diperlukan**: Biasanya 2-5 hari kerja

### 2-5. Kebijakan Selesai

Setelah tim kami membuat dan menyelesaikan konfigurasi kebijakan, status pesanan baru akan diperbarui. Anda dapat memeriksa kemajuan di halaman "Pesanan Baru" di dashboard.

Setelah kebijakan selesai, Anda dapat melanjutkan ke langkah berikutnya.

## Langkah 3: Membuat Grup

Setelah kebijakan selesai, buat grup. Grup adalah mekanisme untuk mengelola "pengguna mana yang dapat menggunakan kebijakan mana".

### 3-1. Navigasi ke Halaman Manajemen Grup

1. Klik "Manajemen Grup" di dashboard
2. Klik tombol "Buat"

### 3-2. Masukkan Informasi Grup

**Bidang Wajib**:
- **Nama Grup**: Tetapkan nama yang mudah dipahami (misalnya, Departemen Penjualan, Tim Analisis Data)
- **Deskripsi**: Tujuan atau penggunaan grup (opsional)

### 3-3. Pilih Kebijakan

Pilih kebijakan yang akan digunakan grup ini dari kebijakan yang dibuat.

- Beberapa kebijakan dapat dipilih
- Dapat ditambahkan atau dihapus nanti

### 3-4. Tambahkan Pengguna

Tambahkan pengguna yang akan menjadi anggota grup.

**Metode 1: Tambahkan Pengguna yang Ada**
- Pilih pengguna yang sudah dibuat di Manajemen Pengguna

**Metode 2: Buat dan Tambahkan Pengguna Baru**
- Masukkan nama dan alamat email
- Email undangan akan dikirim

### 3-5. Pembuatan Grup Selesai

Setelah Anda membuat grup, pengguna anggota dapat memproses data menggunakan kebijakan yang dipilih.

## Langkah 4: Memproses File di Halaman Layanan

Setelah konfigurasi grup selesai, Anda dapat menjalankan pemrosesan data.

### 4-1. Akses Halaman Layanan

1. Klik "Layanan" di dashboard
2. Pilih kebijakan yang akan digunakan

### 4-2. Unggah File

**Metode 1: Seret dan Lepas**
- Seret dan lepas file ke area unggah

**Metode 2: Pemilihan File**
- Klik "Pilih File" dan pilih dari browser file

**Batasan**:
- Maksimal 10 file
- Direkomendasikan 100 MB atau kurang per file
- Format yang Didukung: Format yang dikonfigurasi dalam kebijakan

### 4-3. Mulai Pemrosesan

1. Setelah file diunggah, klik tombol "Mulai Pemrosesan"
2. Pemrosesan dimulai secara otomatis

### 4-4. Pantau Status Pemrosesan

Anda dapat memeriksa status pemrosesan:

- **Status**: "Sedang Diproses", "Selesai", "Kesalahan"
- **Waktu Pemrosesan**: Waktu yang telah berlalu sejak pemrosesan dimulai
- **Informasi File**: Nama file, ukuran

**Waktu Estimasi**:
- Bervariasi tergantung pada volume data dan konten pemrosesan
- Biasanya beberapa detik hingga menit

### 4-5. Pemrosesan Latar Belakang

Selama pemrosesan, Anda dapat:

- ✅ Mengunggah file lain
- ✅ Memeriksa riwayat pemrosesan sebelumnya
- ✅ Menutup layar (pemrosesan berlanjut)

## Langkah 5: Meninjau dan Mengunduh Hasil

Setelah pemrosesan selesai, tinjau dan unduh hasilnya.

### 5-1. Periksa Riwayat Pemrosesan

Anda dapat memeriksa riwayat pemrosesan di halaman layanan atau dashboard.

**Informasi yang Ditampilkan**:
- **Status**: Pemrosesan Selesai, Sedang Diproses, Kesalahan
- **Tanggal/Waktu Pemrosesan**: Tanggal dan waktu eksekusi pemrosesan
- **Nama File**: Nama file yang diproses
- **Waktu Pemrosesan**: Waktu yang dibutuhkan untuk pemrosesan
- **Volume Data**: Ukuran data yang diproses

### 5-2. Unduh Hasil

Anda dapat mengunduh file yang selesai dengan langkah-langkah berikut:

1. Pilih file target dari riwayat pemrosesan
2. Klik tombol "Unduh"
3. File diunduh secara otomatis

**File yang Dapat Diunduh**:
- **File Input**: File asli yang diunggah
- **File Output**: File setelah pemrosesan

### 5-3. Periode Retensi Data

- **Periode Retensi**: 1 tahun sejak unggah
- **Penghapusan Otomatis**: Dihapus secara otomatis setelah 1 tahun
- **Unduh Ulang**: Dapat diunduh beberapa kali selama periode retensi

**Penting**: 
Selalu cadangkan data yang diperlukan secara lokal.

### 5-4. Jika Terjadi Kesalahan Pemrosesan

Jika terjadi kesalahan, periksa hal-hal berikut:

1. **Periksa Pesan Kesalahan**: Identifikasi penyebabnya
2. **Verifikasi Format File**: Apakah format yang ditentukan dalam kebijakan?
3. **Periksa Ukuran File**: Apakah dalam batas?
4. **Hubungi Dukungan**: Jika tidak terselesaikan, hubungi dukungan chat

## Pertanyaan yang Sering Diajukan

Untuk informasi lebih rinci dan jawaban atas pertanyaan umum, silakan kunjungi [halaman FAQ](https://siftbeam.com/id/faq) kami.

Topik yang dibahas meliputi:
- Keamanan dan perlindungan data
- Harga dan penagihan
- Format file yang didukung
- Sistem dukungan
- Fitur tambahan

Dan banyak lagi.

## Langkah Selanjutnya

### Untuk Penggunaan Lebih Lanjut

Setelah Anda memahami dasar-dasar siftbeam, lanjutkan ke langkah-langkah berikutnya:

#### 1. Manajemen Pengguna

- Tambahkan anggota tim
- Kontrol akses dengan pengaturan izin
- Buat grup berdasarkan departemen

#### 2. Integrasi API

- Terbitkan kunci API
- Buat skrip otomasi
- Integrasikan dengan sistem yang ada

#### 3. Konfigurasi Pemrosesan Terjadwal

- Atur pemrosesan terjadwal
- Konfigurasi unggahan otomatis
- Buat laporan berkala

#### 4. Pengaturan Lanjutan

- Konsultasi tentang alur pemrosesan khusus
- Optimalkan untuk volume data besar
- Perkuat pengaturan keamanan

### Jika Anda Mengalami Masalah

Jika masalah muncul, gunakan sumber daya berikut:

- **FAQ**: Periksa solusi di [halaman FAQ](https://siftbeam.com/id/faq)
- **Permintaan Dukungan**: Kirim permintaan dari Dukungan di dashboard akun Anda
- **Waktu Respons**: Biasanya merespons dalam 3 hari kerja

## Ringkasan

Artikel ini menjelaskan alur lengkap pemrosesan data dengan siftbeam:

1. ✅ **Pembuatan Akun & Pendaftaran Perusahaan**: Pendaftaran dengan email dan kata sandi, masukkan informasi perusahaan
2. ✅ **Meminta Kebijakan melalui Pesanan Baru**: Konsultasikan dengan tim kami tentang pemrosesan data yang diperlukan
3. ✅ **Membuat Grup**: Hubungkan pengguna dengan kebijakan untuk mempersiapkan penggunaan
4. ✅ **Memproses File di Halaman Layanan**: Unggah file, jalankan pemrosesan, pantau status
5. ✅ **Meninjau dan Mengunduh Hasil**: Periksa riwayat, unduh file hasil

siftbeam adalah layanan pemrosesan data yang dapat disesuaikan untuk perusahaan. Optimalkan pemrosesan data bisnis Anda dengan alur kerja yang disesuaikan untuk setiap pelanggan.

### Mulai Sekarang

Ketika Anda siap, mulai dengan siftbeam hari ini.

[Mulai dengan siftbeam](https://siftbeam.com/id/signup/auth)

---

**Apakah artikel ini membantu?** Kami menunggu umpan balik Anda.


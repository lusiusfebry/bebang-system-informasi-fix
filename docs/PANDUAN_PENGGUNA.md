# Panduan Pengguna (User Guide) - Modul HR
Bebang Information System

## Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Login & Akses](#login--akses)
3. [Dashboard HR](#dashboard-hr)
4. [Manajemen Karyawan](#manajemen-karyawan)
   - [Daftar Karyawan](#daftar-karyawan)
   - [Tambah Karyawan Baru](#tambah-karyawan-baru)
   - [Edit Karyawan](#edit-karyawan)
   - [Detail Keluarga & Dokumen](#detail-keluarga--dokumen)
   - [Generate QR Code](#generate-qr-code)
5. [Import Data Karyawan](#import-data-karyawan)
6. [Manajemen Pengunduran Diri (Resign)](#manajemen-pengunduran-diri-resign)
7. [FAQ (Tanya Jawab)](#faq-tanya-jawab)

---

## Pendahuluan
Modul HR Bebang Sistem Informasi dirancang untuk memudahkan staf HRD dan Administrator dalam mengelola siklus hidup data karyawan, mulai dari rekrutmen data awal, pengelolaan keluarga, hingga proses pengunduran diri.

## Login & Akses
1. Buka aplikasi melalui browser (Chrome/Edge/Firefox) di alamat yang diberikan Administrator (cth: `http://localhost:5173`).
2. Masukkan **NIK (Nomor Induk Karyawan)** dan **Password**.
3. Klik tombol **Masuk**.
4. Jika lupa password, silakan hubungi Administrator IT.

## Dashboard HR
Setelah berhasil login, Anda akan diarahkan ke Dashboard. Halaman ini memberikan ringkasan cepat:
- **Total Karyawan**: Jumlah seluruh karyawan aktif.
- **Karyawan Baru**: Daftar karyawan yang baru bergabung bulan ini.
- **Pengajuan Resign**: Notifikasi pengajuan pengunduran diri yang perlu persetujuan.

## Manajemen Karyawan

### Daftar Karyawan
Menu **Data Karyawan** menampilkan tabel seluruh pegawai.
- **Pencarian**: Gunakan kolom pencarian untuk mencari berdasarkan Nama atau NIK.
- **Filter**: Filter data berdasarkan Divisi, Departemen, atau Status (Kontrak/Tetap).
- **Export**: Klik tombol **Export CSV** untuk mengunduh laporan data karyawan.

### Tambah Karyawan Baru
1. Klik tombol **+ Tambah Karyawan** di kanan atas tabel.
2. Isi formulir **Data Pribadi**:
   - Nama Lengkap, NIK (Wajib unik), No HP, Email.
   - Tempat/Tanggal Lahir, Agama, Gender.
3. Isi formulir **Data Pekerjaan**:
   - Divisi, Departemen, Jabatan.
   - Status Karyawan, Tanggal Masuk.
4. Klik **Simpan** untuk membuat data karyawan baru.

### Edit Karyawan
1. Pada tabel karyawan, klik tombol **Aksi** (ikon pensil atau titik tiga) pada baris karyawan.
2. Pilih **Detail** untuk melihat profil lengkap.
3. Lakukan perubahan pada kolom yang tersedia dan klik **Simpan Perubahan**.

### Detail Keluarga & Dokumen
Di halaman Detail Karyawan, terdapat tab tambahan:
- **Keluarga**:
  - Klik **Tambah Data Keluarga** untuk memasukkan data Pasangan, Anak, atau Saudara Kandung.
  - Data ini penting untuk keperluan BPJS dan tunjangan.
- **Dokumen**:
  - Unggah dokumen pendukung seperti KTP, NPWP, Ijazah dalam format PDF/JPG.

### Generate QR Code
Untuk keperluan ID Card atau Absensi:
1. Pilih satu atau beberapa karyawan di tabel (checklist).
2. Klik tombol **Generate QR Code**.
3. QR Code akan dibuat berdasarkan NIK karyawan dan dapat dicetak.

## Import Data Karyawan
Fitur ini memudahkan input data massal dari file Excel.

1. Buka menu **Import Karyawan**.
2. **Download Template**: Klik tombol untuk mengunduh file format Excel yang baku.
3. **Isi Data**: Masukkan data karyawan ke dalam template Excel tersebut. Jangan mengubah header kolom.
4. **Upload File**:
   - Klik area upload atau drag-and-drop file Excel yang sudah diisi.
   - Sistem akan melakukan **Preview** dan validasi data.
5. **Konfirmasi**:
   - Jika data valid, klik **Proses Import**.
   - Jika ada error (misal NIK kembar), perbaiki file Excel dan upload ulang.

## Manajemen Pengunduran Diri (Resign)
Fitur untuk mencatat dan memproses karyawan yang keluar.

### Mengajukan Resign (Admin/HR Input)
1. Buka menu **Pengunduran Diri**.
2. Klik **Buat Pengajuan**.
3. Pilih Nama Karyawan.
4. Isi **Tanggal Efektif** dan **Alasan Pengunduran Diri**.
5. Klik **Simpan**. Status awal adalah `PENDING`.

### Proses Persetujuan (Approval)
1. Di daftar Pengunduran Diri, klik tombol pada status pengajuan.
2. Pilih **Setujui** untuk memfinalisasi proses resign, atau **Tolak** jika pengajuan dibatalkan.
3. Karyawan yang disetujui resign-nya akan otomatis dinonaktifkan statusnya pada Tanggal Efektif yang ditentukan.

## FAQ (Tanya Jawab)

**Q: Bagaimana jika NIK sudah terdaftar saat Import?**
A: Sistem akan menolak baris data tersebut. Pastikan NIK unik untuk setiap karyawan.

**Q: Apakah data karyawan yang sudah Resign bisa dilihat?**
A: Ya, data tetap tersimpan namun statusnya menjadi "Non-Aktif" atau "Resign". Anda bisa mencarinya dengan filter status.

**Q: Saya tidak bisa menghapus Data Master (Divisi/Jabatan)?**
A: Data Master yang sedang digunakan oleh Karyawan tidak bisa dihapus untuk menjaga konsistensi data. Ubah dulu data karyawan terkait, baru hapus Master-nya.

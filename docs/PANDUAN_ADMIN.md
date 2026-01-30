# Panduan Administrator (Admin Guide)
Bebang Information System

## Daftar Isi
1. [Manajemen Pengguna (User Management)](#manajemen-pengguna)
2. [Manajemen Hak Akses (RBAC)](#manajemen-hak-akses-rbac)
3. [Manajemen Data Master](#manajemen-data-master)
4. [Pemeliharaan Sistem](#pemeliharaan-sistem)

---

## Manajemen Pengguna
Menu **Admin > Users** digunakan untuk mengelola akun yang bisa login ke aplikasi.

### Membuat Akun Baru
Akun pengguna biasanya dibuat otomatis saat data Karyawan ditambahkan (jika disetting demikian), atau bisa dibuat manual:
1. Klik **Tambah User**.
2. Hubungkan dengan **Data Karyawan** (pilih NIK).
3. Tentukan **Role** (Peran).
4. Password default akan dikirim ke email atau diset standard (misal: `123456` - harap segera diganti).

### Reset Password
Jika user lupa password:
1. Cari user di daftar.
2. Klik tombol **Reset Password**.
3. User akan bisa login dengan password sementara.

### Non-Aktifkan Akun
Untuk memblokir akses (misal karyawan resign atau cuti panjang):
- Ubah status switch **Active** menjadi **Inactive**.

## Manajemen Hak Akses (RBAC)
Sistem menggunakan *Role-Based Access Control*. Akses ditentukan oleh Role, dan Role memiliki sekumpulan Permission.

### Konfigurasi Role
Menu **Admin > Roles & Permissions**.
1. **Daftar Role**: Contoh Role bawaan adalah `SUPER_ADMIN`, `HR_ADMIN`, `EMPLOYEE`, `MANAGER`.
2. **Edit Permission**:
   - Klik pada Role untuk melihat permission-nya.
   - Centang fitur yang boleh diakses.
   - Contoh: Role `HR_ADMIN` boleh `employee.create`, `employee.edit`, tapi Role `EMPLOYEE` hanya boleh `employee.read` (data diri sendiri).

**PENTING**: Hati-hati mengubah permission untuk `SUPER_ADMIN`, pastikan jangan sampai menghapus akses diri sendiri.

## Manajemen Data Master
Data Master adalah referensi utama agar input data konsisten. Administrator wajib melengkapi ini saat inisialisasi sistem.

Menu: **Data Master**
1. **Divisi & Departemen**: Struktur organisasi.
2. **Posisi Jabatan & Level**: Jenjang karir.
3. **Lokasi Kerja**: Alamat kantor/site.
4. **Status Karyawan**: PKWT, PKWTT, Freelance, dll.

### Tips Data Master
- **Hapus Data**: Data master hanya bisa dihapus jika BELUM DIGUNAKAN oleh karyawan.
- **Edit Data**: Perubahan nama divisi/jabatan akan otomatis terupdate di seluruh data karyawan terkait.

## Pemeliharaan Sistem
### Backup Database
Disarankan melakukan backup database secara berkala (Harian/Mingguan). Hubungi tim IT Support untuk script auto-backup.

### Cek Log Error
Jika terjadi masalah aplikasi:
1. Cek file log di server backend (`backend/logs/combined.log` atau `error.log`).
2. Kirimkan pesan error tersebut ke tim developer jika menemukan bug.

# Panduan Administrator (Admin Guide)

## Pendahuluan
Panduan ini ditujukan untuk Administrator Sistem yang bertanggung jawab mengelola akses pengguna, data master, dan konfigurasi sistem.

## Akses Admin
Pastikan Anda login dengan akun yang memiliki Role **ADMIN** atau **SUPER_ADMIN**.

## Manajemen Pengguna (User Management)
### Mengelola Akun Pengguna
1. Masuk ke menu **Admin Panel > Users**.
2. Anda dapat melihat daftar semua pengguna sistem.
3. **Reset Password**: Jika karyawan lupa password, masuk ke detail user dan pilih opsi reset password.
4. **Nonaktifkan Akun**: Ubah status `isActive` menjadi `false` untuk memblokir akses login.

## Role Based Access Control (RBAC)
### Manajemen Role
1. Masuk ke menu **Admin Panel > Roles**.
2. Anda dapat membuat Role baru (misal: HR Staff, Manager, Employee).
3. Klik **Permissions** pada role untuk mengatur hak akses spesifik.

### Manajemen Permission
Permission mendefinisikan aksi apa yang boleh dilakukan (Contoh: `user.create`, `employee.read`).
- Assign permission ke Role yang sesuai agar User dengan Role tersebut dapat mengakses fitur.

## Manajemen Data Master
Menu **Data Master** digunakan untuk mengatur referensi data yang digunakan di seluruh sistem:
- **Divisi & Departemen**: Struktur organisasi perusahaan.
- **Jabatan & Pangkat**: Level dan posisi karir.
- **Lokasi Kerja**: Kantor cabang atau lokasi site.
- **Status Karyawan**: Kontrak, Tetap, Probation.

Pastikan data master terisi sebelum menginput data karyawan agar relasi data valid.

## Monitoring & Logs
Administrator dapat melihat log aktivitas (jika fitur diaktifkan) untuk memantau penggunaan sistem dan mendeteksi error.
- Cek file log di server: `backend/logs/`.

# Kredensial & Akses Sistem (Development)

Dokumen ini berisi daftar akun pengguna default yang dibuat saat proses seeding database (`npx prisma db seed`). 

> **⚠️ PERINGATAN**: Kredensial ini HANYA untuk lingkungan Development. Jangan gunakan di Production.

## Kredensial Default

### Administrator (Super Admin)
Akun ini memiliki **akses penuh** ke seluruh modul sistem (User, Role, Manajemen karyawan, dll).

| Role | NIK | Email | Password |
|---|---|---|---|
| **ADMIN** | `DEV_ADMIN` | `dev.admin@bebang.local` | `DevAdmin@2024!` |

### User Test
Akun ini adalah contoh user biasa dengan akses terbatas.

| Role | NIK | Email | Password |
|---|---|---|---|
| **EMPLOYEE** | `DEV_USER` | `dev.user@bebang.local` | `DevUser@2024!` |

### Karyawan Sample Data
Data karyawan berikut dibuat sebagai sampel, tetapi akun loginnya perlu dibuat manual melalui Admin Panel jika belum ada.

| NIK | Nama | Peran (Role) | Keterangan |
|---|---|---|---|
| `EMP001` | Budi Santoso | HR Manager | Manager HR, Atasan EMP002 |
| `EMP002` | Siti Nurhaliza | HR Staff | Staff HR |
| `EMP003` | Ahmad Hidayat | IT Staff | Staff IT |

## Role & Hak Akses (RBAC)

Sistem menggunakan 4 Role utama:

1. **ADMIN** (`ADMIN`): Akses penuh ke sistem.
2. **HR Manager** (`HR_MANAGER`): Akses penuh modul HR, bisa approve resign.
3. **HR Staff** (`HR_STAFF`): Akses operasional HR, input data, lihat master data.
4. **Employee** (`EMPLOYEE`): Akses dasar (lihat data diri).

## Cara Reset Database & Seed Ulang
Jika ingin mereset data dan kembali menggunakan kredensial default ini:

```bash
# Di folder backend
npx prisma migrate reset
```
Perintah ini akan menghapus semua data, menjalankan migrasi ulang, dan mengisi data seed default.

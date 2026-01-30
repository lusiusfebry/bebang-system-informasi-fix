# Panduan Instalasi & Deployment
Bebang Information System

Dokumen ini menjelaskan cara instalasi aplikasi di server lokal (Windows/Linux) untuk keperluan produksi atau staging.

## Prasyarat Sistem (Requirements)
Pastikan server Anda memiliki spesifikasi berikut:
- **Node.js**: Versi 18 LTS atau terbaru.
- **Database**: PostgreSQL Versi 13 atau terbaru.
- **Git**: Untuk kloning repository.
- **PM2**: (Opsional tapi disarankan) Untuk manajemen proses background.

## Langkah Instalasi

### 1. Persiapan Database
1. Buat database baru di PostgreSQL, misal `bebang_db`.
2. Pastikan username dan password database siap.

### 2. Setup Backend
1. Masuk ke folder backend: `cd backend`
2. Install dependency:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   - Copy `.env.example` ke `.env`.
   - Edit `.env` dan sesuaikan `DATABASE_URL`, `JWT_SECRET`, dan Port.
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/bebang_db?schema=public"
   PORT=3001
   ```
4. Jalankan Migrasi Database:
   ```bash
   npx prisma migrate deploy
   ```
5. (Opsional) Seeding Data Awal:
   ```bash
   npx prisma db seed
   ```
6. Build & Jalankan:
   ```bash
   npm run build
   node dist/index.js
   # Atau menggunakan PM2
   pm2 start dist/index.js --name "bebang-backend"
   ```

### 3. Setup Frontend
1. Masuk ke folder frontend: `cd frontend`
2. Install dependency:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   - Copy `.env.example` ke `.env`.
   - Sesuaikan URL backend:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```
4. Build untuk Produksi:
   ```bash
   npm run build
   ```
   Folder `dist/` akan terbentuk. Folder ini berisi file statis yang siap di-serve.

### 4. Serving Frontend
Anda bisa menggunakan web server seperti Nginx, Apache, atau `serve` untuk menjalankan frontend.
Contoh menggunakan `serve`:
```bash
npm install -g serve
serve -s dist -l 5173
```
Atau setup Nginx sebagai Reverse Proxy agar frontend dan backend bisa diakses via domain utama.

## Troubleshooting Umum
- **Gagal Connect Database**: Cek string koneksi di `.env` dan pastikan service PostgreSQL berjalan.
- **CORS Error**: Pastikan konfigurasi CORS di backend (`src/app.ts`) mengizinkan domain/IP frontend Anda.
- **Upload File Gagal**: Pastikan folder `uploads/` di backend memiliki permission write yang cukup.

## Deployment Guide (Lanjutan)
Untuk panduan deployment tingkat lanjut termasuk Docker, silakan lihat file `DEPLOYMENT_GUIDE.md` (Bahasa Inggris).

# Panduan Instalasi Bebang Sistem Informasi

## Prasyarat
Sebelum memulai instalasi, pastikan sistem Anda memiliki:
- **Node.js**: Versi 20.x atau lebih baru.
- **PostgreSQL**: Versi 15.x atau lebih baru.
- **Git**: Untuk mengunduh kode sumber.
- **PowerShell**: (Untuk Windows) Menjalankan skrip otomatis.

## 1. Clone Repository
```bash
git clone https://github.com/organization/bebang-information-system.git
cd bebang-information-system
```

## 2. Instalasi Otomatis (Windows)
Kami menyediakan skrip PowerShell untuk instalasi mudah di Windows.

1. Buka PowerShell sebagai Administrator.
2. Jalankan perintah berikut:
```powershell
./scripts/setup-local.ps1
```
Skrip ini akan:
- Menginstal dependensi Backend dan Frontend.
- Mengatur variabel lingkungan (`.env`).
- Menjalankan migrasi database dan seeding data awal.

## 3. Instalasi Manual

### Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Salin konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` sesuai konfigurasi database Anda.
4. Setup Database:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Jalankan server:
   ```bash
   npm run dev
   ```

### Frontend
1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## 4. Verifikasi Instalasi
Buka browser dan akses:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/api-docs

## Troubleshooting
- **Error Database Code 28P01**: Cek password database di .env.
- **Port Conflict**: Pastikan port 3001 dan 5173 tidak digunakan aplikasi lain.

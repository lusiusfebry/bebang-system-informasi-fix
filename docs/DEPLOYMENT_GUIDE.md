# Panduan Deployment ke Produksi

## 1. Persiapan Server
- OS: Ubuntu 22.04 LTS (Rekomendasi)
- Runtime: Node.js v20+
- Database: PostgreSQL 15+
- Web Server: Nginx (Reverse Proxy)
- Process Manager: PM2

## 2. Environment Variables
Pastikan file `.env` diisi dengan konfigurasi produksi:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://user:pass@localhost:5432/bebang_prod?schema=public"
JWT_SECRET="GANTI_DENGAN_SECRET_YANG_KUAT"
CORS_ORIGIN="https://hr.domainanda.com"
```

## 3. Deployment Langkah-demi-langkah

### Backend
1. Build aplikasi:
   ```bash
   cd backend
   npm ci
   npm run build
   ```
2. Jalankan migrasi database:
   ```bash
   npm run prisma:migrate
   ```
3. Jalankan aplikasi dengan PM2:
   ```bash
   pm2 start dist/index.js --name "bebang-backend"
   ```

### Frontend
1. Build aplikasi untuk produksi:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```
2. Hasil build ada di folder `dist/`. File ini statis dan harus disajikan oleh Web Server (Nginx).

## 4. Konfigurasi Nginx (Contoh)
```nginx
server {
    listen 80;
    server_name hr.domainanda.com;

    # Frontend
    location / {
        root /var/www/bebang/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## 5. Monitoring
Gunakan PM2 monitor untuk memantau performa backend:
```bash
pm2 monit
```

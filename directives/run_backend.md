# Run Backend Development Server

## Goal
Menjalankan backend development server untuk project Bebang Sistem Informasi.

## Inputs
- Path ke folder backend: `backend/`
- Environment variables di `backend/.env`

## Prerequisites
1. Node.js 18+ terinstall
2. PostgreSQL running di localhost:5432
3. Dependencies sudah terinstall (`npm install`)
4. Prisma client sudah di-generate (`npx prisma generate`)
5. Database migration sudah dijalankan (`npx prisma migrate dev`)

## Tools
- `execution/run_backend.ps1` - Script PowerShell untuk menjalankan backend

## Execution Steps
1. Pastikan PostgreSQL service running
2. Navigate ke folder `backend/`
3. Jalankan `npm run dev`
4. Verifikasi server running di http://localhost:3001/health

## Outputs
- Backend API server running di port 3001
- Health check endpoint: `GET /health`
- API base: `GET /api`

## Edge Cases
- **Database connection failed**: Periksa PostgreSQL running dan credentials di `.env`
- **Port already in use**: Kill process yang menggunakan port 3001 atau ubah PORT di `.env`
- **Prisma client not generated**: Jalankan `npx prisma generate` dulu

## Learnings
- Backend menggunakan Express + TypeScript
- Prisma ORM untuk PostgreSQL
- Default credentials: postgres:123456789

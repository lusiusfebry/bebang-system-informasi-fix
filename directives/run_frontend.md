# Run Frontend Development Server

## Goal
Menjalankan frontend development server untuk project Bebang Sistem Informasi.

## Inputs
- Path ke folder frontend: `frontend/`
- Environment variables di `frontend/.env`

## Prerequisites
1. Node.js 18+ terinstall
2. Dependencies sudah terinstall (`npm install`)
3. Backend server running (untuk API calls)

## Tools
- `execution/run_frontend.ps1` - Script PowerShell untuk menjalankan frontend

## Execution Steps
1. Navigate ke folder `frontend/`
2. Jalankan `npm run dev`
3. Akses http://localhost:5173

## Outputs
- Frontend server running di port 5173
- Hot Module Replacement (HMR) enabled
- Proxy ke backend API di `/api`

## Edge Cases
- **Port already in use**: Vite akan otomatis mencari port lain
- **Backend not running**: API calls akan gagal, pastikan backend running dulu

## Learnings
- Frontend menggunakan React + Vite + TypeScript
- Tailwind CSS untuk styling
- Vite dev server dengan HMR untuk fast refresh

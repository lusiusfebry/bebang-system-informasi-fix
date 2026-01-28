I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

## Observasi Kunci

Berdasarkan analisis codebase dan dokumen perencanaan, project **Bebang Sistem Informasi** adalah aplikasi enterprise web baru yang akan dibangun dari awal. Desain UI/UX sudah tersedia menggunakan **Tailwind CSS**, **Material Symbols Icons**, dan **Inter font**. Terdapat contoh todo-app di folder `.agent/skills` yang menggunakan **Express + TypeScript** untuk backend dan **React + Vite** untuk frontend, yang dapat dijadikan referensi arsitektur. Database akan menggunakan **PostgreSQL** dengan credentials yang sudah ditentukan (user: postgres, password: 123456789).

## Pendekatan Implementasi

Pendekatan yang dipilih adalah **monorepo structure** dengan folder terpisah untuk backend, frontend, dan modules untuk memudahkan scalability dan maintenance. Backend akan menggunakan **Node.js + Express + TypeScript** dengan **Prisma ORM** untuk database management karena Prisma menyediakan type-safety, migration tools, dan seeding yang powerful. Frontend akan menggunakan **React + TypeScript + Vite + Tailwind CSS** sesuai dengan desain UI yang sudah ada. Struktur modular akan memudahkan penambahan module baru di masa depan (Inventory, Mess Management, dll).

## Langkah Implementasi

### 1. Inisialisasi Root Project Structure

Buat struktur folder root project:

```
bebang-information-system-fix/
├── backend/
├── frontend/
├── modules/
│   └── hr/
├── .env
├── .gitignore
├── README.md
└── package.json (root workspace)
```

**Detail:**
- Buat file `file:.gitignore` di root untuk mengabaikan `node_modules/`, `.env`, `dist/`, `build/`, dll
- Buat file `file:README.md` dengan dokumentasi project overview
- Buat file `file:package.json` di root untuk workspace management (opsional, jika menggunakan npm workspaces atau yarn workspaces)

### 2. Setup Backend - Inisialisasi Project

Masuk ke folder `backend/` dan inisialisasi Node.js project:

**Struktur folder backend:**
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── modules/
│   │   └── hr/
│   │       ├── routes/
│   │       ├── controllers/
│   │       ├── services/
│   │       └── validators/
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── utils/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── .gitignore
```

**Dependencies yang dibutuhkan:**
- **Runtime**: `express`, `cors`, `dotenv`, `helmet`, `compression`
- **Database**: `@prisma/client`, `pg` (PostgreSQL driver)
- **Validation**: `zod` atau `joi`
- **Dev Dependencies**: `typescript`, `@types/node`, `@types/express`, `@types/cors`, `ts-node`, `nodemon`, `prisma`

**File `file:backend/package.json`:**
```json
{
  "name": "bebang-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

### 3. Setup Backend - Konfigurasi Database dengan Prisma

**File `file:backend/prisma/schema.prisma`:**
- Definisikan datasource PostgreSQL dengan connection string dari environment variable
- Setup generator untuk Prisma Client
- Buat model dasar untuk User (untuk authentication di fase berikutnya)

**Connection string format:**
```
DATABASE_URL="postgresql://postgres:123456789@localhost:5432/bebang_db?schema=public"
```

**File `file:backend/.env.example`:**
```
DATABASE_URL=postgresql://postgres:123456789@localhost:5432/bebang_db
PORT=3001
NODE_ENV=development
```

**File `file:backend/.env`:**
- Copy dari `.env.example` dan sesuaikan dengan environment lokal

**Jalankan Prisma commands:**
- `npx prisma init` (jika belum ada folder prisma)
- `npx prisma migrate dev --name init` untuk membuat initial migration
- `npx prisma generate` untuk generate Prisma Client

### 4. Setup Backend - Express Server & Middleware

**File `file:backend/src/index.ts`:**
- Import express, cors, helmet, compression
- Setup middleware: `express.json()`, `cors()`, `helmet()`, `compression()`
- Setup error handling middleware
- Setup health check endpoint (`GET /health`)
- Setup API routes dengan prefix `/api`
- Graceful shutdown handler untuk database connection

**File `file:backend/src/config/database.ts`:**
- Export Prisma Client instance
- Setup connection pooling
- Handle database connection errors

**File `file:backend/src/middleware/errorHandler.ts`:**
- Global error handler middleware
- Format error response dengan struktur konsisten
- Log errors untuk debugging

**File `file:backend/src/middleware/logger.ts`:**
- Request logging middleware (method, path, status, response time)
- Gunakan library seperti `morgan` atau custom logger

### 5. Setup Backend - TypeScript Configuration

**File `file:backend/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 6. Setup Frontend - Inisialisasi React + Vite Project

Gunakan Vite untuk create React + TypeScript project:

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

**Struktur folder frontend:**
```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── modules/
│   │       └── hr/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Welcome.tsx
│   │   └── modules/
│   │       └── hr/
│   ├── hooks/
│   ├── services/
│   │   └── api.ts
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 7. Setup Frontend - Install Dependencies

**Dependencies yang dibutuhkan:**
- **UI Framework**: `react`, `react-dom`
- **Routing**: `react-router-dom`
- **HTTP Client**: `axios` atau `fetch` (native)
- **State Management**: `zustand` atau `react-query` (untuk server state)
- **Form Handling**: `react-hook-form`
- **Styling**: `tailwindcss`, `autoprefixer`, `postcss`
- **Icons**: Material Symbols (via CDN atau package)
- **Dev Dependencies**: `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `typescript`, `vite`

**Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 8. Setup Frontend - Tailwind CSS Configuration

**File `file:frontend/tailwind.config.js`:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

**File `file:frontend/src/index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### 9. Setup Frontend - Environment Variables & API Configuration

**File `file:frontend/.env.example`:**
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Bebang Sistem Informasi
```

**File `file:frontend/.env`:**
- Copy dari `.env.example`

**File `file:frontend/src/services/api.ts`:**
- Setup axios instance dengan base URL dari environment variable
- Setup request/response interceptors
- Export API client untuk digunakan di seluruh aplikasi

### 10. Setup Frontend - Routing Configuration

**File `file:frontend/src/App.tsx`:**
- Setup React Router dengan routes:
  - `/login` → Login page
  - `/` → Welcome page (protected)
  - `/hr/*` → HR module routes (protected)
- Implementasi protected route wrapper untuk authentication check

**Install React Router:**
```bash
npm install react-router-dom
```

### 11. Setup Frontend - TypeScript Configuration

**File `file:frontend/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 12. Setup Modules Folder Structure

**Struktur `file:modules/hr/`:**
```
modules/
└── hr/
    ├── docs/
    │   └── README.md
    ├── database/
    │   └── schema.md (dokumentasi schema HR)
    └── api-spec/
        └── openapi.yaml (API specification)
```

Folder ini akan berisi dokumentasi dan spesifikasi untuk HR module. Implementasi actual code akan ada di `backend/src/modules/hr/` dan `frontend/src/pages/modules/hr/`.

### 13. Setup Database Migrations & Seeding Tools

**File `file:backend/prisma/seed.ts`:**
- Script untuk seeding initial data
- Buat user development dengan NIK dan password default (untuk testing)
- Export seed function

**Tambahkan di `file:backend/package.json`:**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Jalankan seeding:**
```bash
npx prisma db seed
```

### 14. Setup Git & Documentation

**File `file:.gitignore` (root):**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Database
*.db
*.db-journal
*.db-shm
*.db-wal

# Prisma
prisma/migrations/**/migration.sql
```

**File `file:README.md`:**
- Project overview
- Tech stack
- Setup instructions (backend & frontend)
- Database setup
- Running the application
- Folder structure explanation
- Contributing guidelines

### 15. Verifikasi & Testing Setup

**Backend verification:**
- Jalankan `npm run dev` di folder backend
- Akses `http://localhost:3001/health` untuk health check
- Verifikasi database connection berhasil

**Frontend verification:**
- Jalankan `npm run dev` di folder frontend
- Akses `http://localhost:5173` (default Vite port)
- Verifikasi Tailwind CSS berfungsi dengan baik
- Verifikasi dark mode toggle (jika sudah diimplementasi)

**Database verification:**
- Jalankan `npx prisma studio` untuk membuka Prisma Studio
- Verifikasi koneksi ke PostgreSQL berhasil
- Verifikasi tables sudah terbuat (jika ada)

## Diagram Arsitektur

```mermaid
graph TD
    A[Client Browser] -->|HTTP/HTTPS| B[Frontend - React + Vite]
    B -->|API Calls| C[Backend - Express + TypeScript]
    C -->|Prisma ORM| D[PostgreSQL Database]
    
    B --> B1[Pages]
    B --> B2[Components]
    B --> B3[Services/API]
    
    C --> C1[Routes]
    C --> C2[Controllers]
    C --> C3[Services]
    C --> C4[Prisma Client]
    
    C1 --> C2
    C2 --> C3
    C3 --> C4
    C4 --> D
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
```

## Struktur Folder Final

```
bebang-information-system-fix/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/hr/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── modules/
│   └── hr/
│       └── docs/
├── planning/
├── desain-ui-ux/
├── .env
├── .gitignore
└── README.md
```

## Catatan Penting

1. **Database Setup**: Pastikan PostgreSQL sudah terinstall dan running di `localhost:5432` dengan user `postgres` dan password `123456789`
2. **Node.js Version**: Gunakan Node.js versi 18+ untuk compatibility dengan dependencies modern
3. **Port Configuration**: Backend default port `3001`, Frontend default port `5173` (Vite)
4. **CORS**: Pastikan CORS dikonfigurasi dengan benar untuk allow frontend origin
5. **Environment Variables**: Jangan commit file `.env` ke git, gunakan `.env.example` sebagai template
6. **Prisma**: Setiap perubahan schema harus diikuti dengan `prisma migrate dev` dan `prisma generate`
7. **Tailwind CSS**: Pastikan content paths di `tailwind.config.js` sudah benar untuk purging unused styles
8. **TypeScript**: Gunakan strict mode untuk type safety maksimal
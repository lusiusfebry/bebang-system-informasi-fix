# Bebang Sistem Informasi

Enterprise web application for organizational information management built with modern web technologies.

## 📚 Dokumentasi
Silakan baca dokumentasi lengkap di folder `docs/`:

- [Panduan Instalasi](docs/INSTALLATION.md)
- [Panduan Pengguna (HR)](docs/USER_GUIDE.md)
- [Panduan Admin](docs/ADMIN_GUIDE.md)
- [Panduan Testing](docs/TESTING_STRATEGY.md)
- [Panduan Deployment](docs/DEPLOYMENT_GUIDE.md)
- [FAQ & Troubleshooting](docs/FAQ.md)

## Tech Stack

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios

## Project Structure

```
bebang-information-system-fix/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── modules/   # Feature modules
│   │   ├── middleware/# Express middleware
│   │   └── utils/     # Utility functions
│   └── prisma/        # Database schema & migrations
├── frontend/          # React application
│   ├── src/
│   │   ├── components/# UI components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   └── hooks/     # Custom hooks
│   └── public/        # Static assets
└── modules/           # Module documentation
```

## Features

- **Manajemen Karyawan**: 
  - CRUD Data Karyawan (Personal, HR, Family)
  - **Import Data Karyawan** via Excel
  - **Cetak ID Card** Karyawan
  - **Generator QR Code** (Single & Bulk)
- **Struktur Organisasi**: Divisi, Departemen, Jabatan
- **Role-Based Access Control** (Admin, HR, etc.)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create database (PostgreSQL)
createdb bebang_db

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend (port 3001)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Prisma Studio**: `npx prisma studio`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:123456789@localhost:5432/bebang_db
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Bebang Sistem Informasi
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Create feature branch from `main`
2. Make changes with proper TypeScript types
3. Follow existing code style
4. Test thoroughly before PR

## License

Proprietary - All rights reserved

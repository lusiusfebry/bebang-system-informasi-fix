# Setup Database

## Goal
Menyiapkan database PostgreSQL untuk project Bebang Sistem Informasi.

## Inputs
- Database credentials di `backend/.env`
- Prisma schema di `backend/prisma/schema.prisma`

## Prerequisites
1. PostgreSQL 14+ terinstall dan running
2. User postgres dengan password yang sesuai

## Tools
- `execution/setup_database.ps1` - Script PowerShell untuk setup database

## Execution Steps
1. Buat database baru `bebang_db`:
   ```bash
   createdb bebang_db
   ```
2. Navigate ke folder `backend/`
3. Jalankan Prisma migrate:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Seed database dengan data awal:
   ```bash
   npx prisma db seed
   ```

## Outputs
- Database `bebang_db` dengan schema terbaru
- Tables sesuai Prisma schema
- Default admin user (NIK: ADMIN001, password: admin123)
- Default test user (NIK: USER001, password: user123)

## Edge Cases
- **Database already exists**: Drop dulu atau gunakan nama berbeda
- **Permission denied**: Pastikan user postgres punya akses
- **Migration failed**: Check Prisma schema syntax

## Learnings
- Prisma migrate: `npx prisma migrate dev`
- Prisma Studio untuk GUI: `npx prisma studio`
- Reset database: `npx prisma migrate reset`

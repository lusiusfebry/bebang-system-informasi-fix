# HR Master Data API Documentation

## Overview

API untuk mengelola master data Human Resources (HR) pada Bebang Sistem Informasi.

**Base URL**: `http://localhost:3001/api/hr/master`

## Authentication

Semua endpoint membutuhkan JWT token. Sertakan header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": [...]
  }
}
```

## Common Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status: `AKTIF` atau `TIDAK_AKTIF` |
| search | string | Search by nama field |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

---

## Endpoints

### 1. Divisi

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/divisi` | Get all divisi (paginated) |
| GET | `/divisi/:id` | Get divisi by ID |
| POST | `/divisi` | Create new divisi |
| PUT | `/divisi/:id` | Update divisi |
| DELETE | `/divisi/:id` | Soft delete divisi |

**Create/Update Body:**
```json
{
  "namaDivisi": "Divisi IT",
  "keterangan": "Mengelola teknologi informasi",
  "status": "AKTIF"
}
```

---

### 2. Department

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/department` | Get all department |
| GET | `/department/:id` | Get department by ID |
| POST | `/department` | Create new department |
| PUT | `/department/:id` | Update department |
| DELETE | `/department/:id` | Soft delete department |

**Create/Update Body:**
```json
{
  "namaDepartment": "IT Support",
  "divisiId": "uuid-divisi",
  "managerId": "uuid-user",
  "keterangan": "IT Support team"
}
```

---

### 3. Posisi Jabatan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posisi-jabatan` | Get all posisi jabatan |
| GET | `/posisi-jabatan/:id` | Get posisi jabatan by ID |
| POST | `/posisi-jabatan` | Create new posisi jabatan |
| PUT | `/posisi-jabatan/:id` | Update posisi jabatan |
| DELETE | `/posisi-jabatan/:id` | Soft delete posisi jabatan |

**Create/Update Body:**
```json
{
  "namaPosisiJabatan": "IT Manager",
  "departmentId": "uuid-department",
  "keterangan": "Kepala IT"
}
```

---

### 4. Kategori Pangkat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kategori-pangkat` | Get all kategori pangkat |
| GET | `/kategori-pangkat/:id` | Get kategori pangkat by ID |
| POST | `/kategori-pangkat` | Create new kategori pangkat |
| PUT | `/kategori-pangkat/:id` | Update kategori pangkat |
| DELETE | `/kategori-pangkat/:id` | Soft delete kategori pangkat |

**Create/Update Body:**
```json
{
  "namaKategoriPangkat": "Staff",
  "keterangan": "Level staff biasa"
}
```

---

### 5. Golongan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/golongan` | Get all golongan |
| GET | `/golongan/:id` | Get golongan by ID |
| POST | `/golongan` | Create new golongan |
| PUT | `/golongan/:id` | Update golongan |
| DELETE | `/golongan/:id` | Soft delete golongan |

---

### 6. Sub Golongan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sub-golongan` | Get all sub golongan |
| GET | `/sub-golongan/:id` | Get sub golongan by ID |
| POST | `/sub-golongan` | Create new sub golongan |
| PUT | `/sub-golongan/:id` | Update sub golongan |
| DELETE | `/sub-golongan/:id` | Soft delete sub golongan |

---

### 7. Jenis Hubungan Kerja

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jenis-hubungan-kerja` | Get all jenis hubungan kerja |
| GET | `/jenis-hubungan-kerja/:id` | Get jenis hubungan kerja by ID |
| POST | `/jenis-hubungan-kerja` | Create new jenis hubungan kerja |
| PUT | `/jenis-hubungan-kerja/:id` | Update jenis hubungan kerja |
| DELETE | `/jenis-hubungan-kerja/:id` | Soft delete jenis hubungan kerja |

---

### 8. Tag

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tag` | Get all tag |
| GET | `/tag/:id` | Get tag by ID |
| POST | `/tag` | Create new tag |
| PUT | `/tag/:id` | Update tag |
| DELETE | `/tag/:id` | Soft delete tag |

**Create/Update Body:**
```json
{
  "namaTag": "Prioritas Tinggi",
  "warnaTag": "#FF0000",
  "keterangan": "Tag untuk prioritas tinggi"
}
```

> **Note**: `warnaTag` harus dalam format hex color (#RRGGBB)

---

### 9. Lokasi Kerja

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lokasi-kerja` | Get all lokasi kerja |
| GET | `/lokasi-kerja/:id` | Get lokasi kerja by ID |
| POST | `/lokasi-kerja` | Create new lokasi kerja |
| PUT | `/lokasi-kerja/:id` | Update lokasi kerja |
| DELETE | `/lokasi-kerja/:id` | Soft delete lokasi kerja |

**Create/Update Body:**
```json
{
  "namaLokasiKerja": "Kantor Pusat Jakarta",
  "alamat": "Jl. Sudirman No. 123, Jakarta",
  "keterangan": "Head Office"
}
```

---

### 10. Status Karyawan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status-karyawan` | Get all status karyawan |
| GET | `/status-karyawan/:id` | Get status karyawan by ID |
| POST | `/status-karyawan` | Create new status karyawan |
| PUT | `/status-karyawan/:id` | Update status karyawan |
| DELETE | `/status-karyawan/:id` | Soft delete status karyawan |

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error atau invalid data |
| 401 | Unauthorized - Token tidak valid atau expired |
| 404 | Not Found - Data tidak ditemukan |
| 409 | Conflict - Data duplikat (unique constraint) |
| 500 | Internal Server Error |

## Examples

### Login dan Get Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nik": "DEV_ADMIN", "password": "DevAdmin@2024!"}'
```

### Get All Divisi

```bash
curl http://localhost:3001/api/hr/master/divisi \
  -H "Authorization: Bearer <token>"
```

### Create New Divisi

```bash
curl -X POST http://localhost:3001/api/hr/master/divisi \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"namaDivisi": "Divisi Baru", "keterangan": "Test"}'
```

### Filter by Status

```bash
curl "http://localhost:3001/api/hr/master/divisi?status=AKTIF&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Search

```bash
curl "http://localhost:3001/api/hr/master/divisi?search=IT" \
  -H "Authorization: Bearer <token>"
```

## Swagger UI

Akses dokumentasi interaktif di: **http://localhost:3001/api-docs**

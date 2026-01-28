# Employee API Documentation

## Overview
API endpoints untuk Employee Management dalam sistem Bebang Information System.

## Base URL
```
/api/hr/employees
```

## Authentication
Semua endpoints memerlukan JWT authentication:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. List Karyawan

```http
GET /api/hr/employees
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| search | string | - | Search by nama, NIK, atau email |
| divisiId | uuid | - | Filter by divisi |
| departmentId | uuid | - | Filter by department |
| statusKaryawanId | uuid | - | Filter by status karyawan |
| lokasiKerjaId | uuid | - | Filter by lokasi kerja |
| tagId | uuid | - | Filter by tag |
| jenisHubunganKerjaId | uuid | - | Filter by jenis hubungan kerja |
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max 100) |
| sortBy | string | namaLengkap | Sort field: namaLengkap, nomorIndukKaryawan, createdAt, tanggalMasuk |
| sortOrder | string | asc | Sort order: asc, desc |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

### 2. Get Karyawan by ID

```http
GET /api/hr/employees/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "namaLengkap": "Budi Santoso",
    "nomorIndukKaryawan": "EMP001",
    "divisi": {...},
    "department": {...},
    "anak": [...],
    "saudaraKandung": [...],
    "dokumen": [...]
  },
  "message": "Karyawan berhasil ditemukan"
}
```

---

### 3. Get Karyawan by NIK

```http
GET /api/hr/employees/nik/:nik
```

---

### 4. Create Karyawan

```http
POST /api/hr/employees
```

**Request Body (required fields):**
```json
{
  "namaLengkap": "Budi Santoso",
  "nomorIndukKaryawan": "EMP001",
  "nomorHandphone": "081234567890"
}
```

**Optional fields:** divisiId, departmentId, posisiJabatanId, emailPerusahaan, jenisKelamin, tempatLahir, tanggalLahir, agama, golonganDarah, nomorKtp, nomorNpwp, alamatDomisili, statusPernikahan, dll.

---

### 5. Update Karyawan

```http
PUT /api/hr/employees/:id
```

**Request Body:** Partial update dengan field yang ingin diubah.

---

### 6. Delete Karyawan

```http
DELETE /api/hr/employees/:id
```

---

## Child Data - Anak

### Add Anak

```http
POST /api/hr/employees/:id/anak
```

**Request Body:**
```json
{
  "urutanAnak": 1,
  "namaAnak": "Anak Pertama",
  "jenisKelamin": "LAKI_LAKI",
  "tanggalLahir": "2015-05-20"
}
```

### Update Anak

```http
PUT /api/hr/employees/:id/anak/:anakId
```

### Delete Anak

```http
DELETE /api/hr/employees/:id/anak/:anakId
```

---

## Child Data - Saudara Kandung

> **Note:** Maksimal 5 saudara kandung per karyawan.

### Add Saudara Kandung

```http
POST /api/hr/employees/:id/saudara-kandung
```

**Request Body:**
```json
{
  "urutanSaudara": 1,
  "namaSaudaraKandung": "Saudara Pertama",
  "jenisKelamin": "PEREMPUAN"
}
```

### Update Saudara Kandung

```http
PUT /api/hr/employees/:id/saudara-kandung/:saudaraId
```

### Delete Saudara Kandung

```http
DELETE /api/hr/employees/:id/saudara-kandung/:saudaraId
```

---

## File Upload

### Upload Photo

```http
POST /api/hr/employees/:id/photo
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| photo | file | Image file (JPEG, PNG, max 5MB) |

### Upload Document

```http
POST /api/hr/employees/:id/documents
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| document | file | Document file (PDF, DOC, max 5MB) |
| jenisDokumen | string | Document type (e.g., "KTP", "NPWP") |
| keterangan | string | Optional description |

### Delete Document

```http
DELETE /api/hr/employees/:id/documents/:documentId
```

---

## QR Code

### Generate QR Code

```http
GET /api/hr/employees/:id/qrcode
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| format | string | image | Output format: `image` (PNG) or `base64` (JSON) |

**Response (format=image):**
- Content-Type: `image/png`
- Binary PNG image

**Response (format=base64):**
```json
{
  "success": true,
  "data": {
    "qrcode": "data:image/png;base64,...",
    "nik": "EMP001"
  },
  "message": "QR Code berhasil dibuat"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Karyawan tidak ditemukan"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Data dengan nilai tersebut sudah ada"
}
```

---

## Validation Rules

### Phone Numbers
Pattern: `^(\+62|62|0)[0-9]{9,12}$`
- Must start with +62, 62, or 0
- Followed by 9-12 digits

### NIK (KTP)
Pattern: `^\d{16}$` - Exactly 16 digits

### NPWP
Pattern: `^\d{15}$` - Exactly 15 digits

### Email
Standard email format validation

---

## Enums

| Enum | Values |
|------|--------|
| JenisKelamin | LAKI_LAKI, PEREMPUAN |
| Agama | ISLAM, KRISTEN, KATOLIK, HINDU, BUDDHA, KONGHUCU |
| GolonganDarah | A, B, AB, O |
| StatusPernikahan | BELUM_MENIKAH, MENIKAH, CERAI_HIDUP, CERAI_MATI |
| StatusKelulusan | LULUS, TIDAK_LULUS, SEDANG_BELAJAR |
| TingkatPendidikan | SD, SMP, SMA, D3, S1, S2, S3 |

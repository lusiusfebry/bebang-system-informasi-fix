/**
 * Swagger Configuration
 * OpenAPI 3.0 specification untuk Bebang Sistem Informasi API
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bebang Sistem Informasi API',
            version: '1.0.0',
            description: 'REST API untuk Bebang Sistem Informasi - Enterprise Resource Planning',
            contact: {
                name: 'IT Department',
                email: 'it@bebang.local',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // Common Schemas
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' },
                        message: { type: 'string' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                details: { type: 'array', items: { type: 'object' } },
                            },
                        },
                    },
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'array', items: { type: 'object' } },
                        meta: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                total: { type: 'number' },
                                totalPages: { type: 'number' },
                            },
                        },
                    },
                },
                StatusMaster: {
                    type: 'string',
                    enum: ['AKTIF', 'TIDAK_AKTIF'],
                },
                // ==========================================
                // DIVISI
                // ==========================================
                Divisi: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaDivisi: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateDivisi: {
                    type: 'object',
                    required: ['namaDivisi'],
                    properties: {
                        namaDivisi: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateDivisi: {
                    type: 'object',
                    properties: {
                        namaDivisi: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // DEPARTMENT
                // ==========================================
                Department: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaDepartment: { type: 'string' },
                        divisiId: { type: 'string', format: 'uuid' },
                        managerId: { type: 'string', format: 'uuid', nullable: true },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        divisi: { $ref: '#/components/schemas/Divisi' },
                    },
                },
                CreateDepartment: {
                    type: 'object',
                    required: ['namaDepartment', 'divisiId'],
                    properties: {
                        namaDepartment: { type: 'string', minLength: 1, maxLength: 100 },
                        divisiId: { type: 'string', format: 'uuid' },
                        managerId: { type: 'string', format: 'uuid' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateDepartment: {
                    type: 'object',
                    properties: {
                        namaDepartment: { type: 'string', minLength: 1, maxLength: 100 },
                        divisiId: { type: 'string', format: 'uuid' },
                        managerId: { type: 'string', format: 'uuid' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // POSISI JABATAN
                // ==========================================
                PosisiJabatan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaPosisiJabatan: { type: 'string' },
                        departmentId: { type: 'string', format: 'uuid', nullable: true },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreatePosisiJabatan: {
                    type: 'object',
                    required: ['namaPosisiJabatan'],
                    properties: {
                        namaPosisiJabatan: { type: 'string', minLength: 1, maxLength: 100 },
                        departmentId: { type: 'string', format: 'uuid' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdatePosisiJabatan: {
                    type: 'object',
                    properties: {
                        namaPosisiJabatan: { type: 'string', minLength: 1, maxLength: 100 },
                        departmentId: { type: 'string', format: 'uuid' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // KATEGORI PANGKAT
                // ==========================================
                KategoriPangkat: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaKategoriPangkat: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateKategoriPangkat: {
                    type: 'object',
                    required: ['namaKategoriPangkat'],
                    properties: {
                        namaKategoriPangkat: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateKategoriPangkat: {
                    type: 'object',
                    properties: {
                        namaKategoriPangkat: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // GOLONGAN
                // ==========================================
                Golongan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaGolongan: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateGolongan: {
                    type: 'object',
                    required: ['namaGolongan'],
                    properties: {
                        namaGolongan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateGolongan: {
                    type: 'object',
                    properties: {
                        namaGolongan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // SUB GOLONGAN
                // ==========================================
                SubGolongan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaSubGolongan: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateSubGolongan: {
                    type: 'object',
                    required: ['namaSubGolongan'],
                    properties: {
                        namaSubGolongan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateSubGolongan: {
                    type: 'object',
                    properties: {
                        namaSubGolongan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // JENIS HUBUNGAN KERJA
                // ==========================================
                JenisHubunganKerja: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaJenisHubunganKerja: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateJenisHubunganKerja: {
                    type: 'object',
                    required: ['namaJenisHubunganKerja'],
                    properties: {
                        namaJenisHubunganKerja: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateJenisHubunganKerja: {
                    type: 'object',
                    properties: {
                        namaJenisHubunganKerja: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // TAG
                // ==========================================
                Tag: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaTag: { type: 'string' },
                        warnaTag: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateTag: {
                    type: 'object',
                    required: ['namaTag'],
                    properties: {
                        namaTag: { type: 'string', minLength: 1, maxLength: 50 },
                        warnaTag: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', example: '#FF5733' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateTag: {
                    type: 'object',
                    properties: {
                        namaTag: { type: 'string', minLength: 1, maxLength: 50 },
                        warnaTag: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // LOKASI KERJA
                // ==========================================
                LokasiKerja: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaLokasiKerja: { type: 'string' },
                        alamat: { type: 'string', nullable: true },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateLokasiKerja: {
                    type: 'object',
                    required: ['namaLokasiKerja'],
                    properties: {
                        namaLokasiKerja: { type: 'string', minLength: 1, maxLength: 100 },
                        alamat: { type: 'string', maxLength: 500 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateLokasiKerja: {
                    type: 'object',
                    properties: {
                        namaLokasiKerja: { type: 'string', minLength: 1, maxLength: 100 },
                        alamat: { type: 'string', maxLength: 500 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // STATUS KARYAWAN
                // ==========================================
                StatusKaryawan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaStatusKaryawan: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateStatusKaryawan: {
                    type: 'object',
                    required: ['namaStatusKaryawan'],
                    properties: {
                        namaStatusKaryawan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                UpdateStatusKaryawan: {
                    type: 'object',
                    properties: {
                        namaStatusKaryawan: { type: 'string', minLength: 1, maxLength: 100 },
                        keterangan: { type: 'string', maxLength: 500 },
                        status: { $ref: '#/components/schemas/StatusMaster' },
                    },
                },
                // ==========================================
                // EMPLOYEE MANAGEMENT SCHEMAS
                // ==========================================
                JenisKelamin: {
                    type: 'string',
                    enum: ['LAKI_LAKI', 'PEREMPUAN'],
                },
                Agama: {
                    type: 'string',
                    enum: ['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'],
                },
                GolonganDarah: {
                    type: 'string',
                    enum: ['A', 'B', 'AB', 'O'],
                },
                StatusPernikahan: {
                    type: 'string',
                    enum: ['BELUM_MENIKAH', 'MENIKAH', 'CERAI_HIDUP', 'CERAI_MATI'],
                },
                Karyawan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaLengkap: { type: 'string' },
                        nomorIndukKaryawan: { type: 'string' },
                        nomorHandphone: { type: 'string' },
                        fotoKaryawan: { type: 'string', nullable: true },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tempatLahir: { type: 'string', nullable: true },
                        tanggalLahir: { type: 'string', format: 'date', nullable: true },
                        agama: { $ref: '#/components/schemas/Agama' },
                        golonganDarah: { $ref: '#/components/schemas/GolonganDarah' },
                        statusPernikahan: { $ref: '#/components/schemas/StatusPernikahan' },
                        emailPerusahaan: { type: 'string', format: 'email', nullable: true },
                        emailPribadi: { type: 'string', format: 'email', nullable: true },
                        divisiId: { type: 'string', format: 'uuid', nullable: true },
                        departmentId: { type: 'string', format: 'uuid', nullable: true },
                        posisiJabatanId: { type: 'string', format: 'uuid', nullable: true },
                        statusKaryawanId: { type: 'string', format: 'uuid', nullable: true },
                        lokasiKerjaId: { type: 'string', format: 'uuid', nullable: true },
                        tagId: { type: 'string', format: 'uuid', nullable: true },
                        jenisHubunganKerjaId: { type: 'string', format: 'uuid', nullable: true },
                        tanggalMasuk: { type: 'string', format: 'date', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                KaryawanList: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        namaLengkap: { type: 'string' },
                        nomorIndukKaryawan: { type: 'string' },
                        fotoKaryawan: { type: 'string', nullable: true },
                        divisi: { type: 'object', properties: { id: { type: 'string' }, namaDivisi: { type: 'string' } } },
                        department: { type: 'object', properties: { id: { type: 'string' }, namaDepartment: { type: 'string' } } },
                        posisiJabatan: { type: 'object', properties: { id: { type: 'string' }, namaPosisiJabatan: { type: 'string' } } },
                        statusKaryawan: { type: 'object', properties: { id: { type: 'string' }, namaStatus: { type: 'string' } } },
                    },
                },
                CreateKaryawan: {
                    type: 'object',
                    required: ['namaLengkap', 'nomorIndukKaryawan', 'nomorHandphone'],
                    properties: {
                        namaLengkap: { type: 'string', minLength: 1, maxLength: 200 },
                        nomorIndukKaryawan: { type: 'string', minLength: 1, maxLength: 50 },
                        nomorHandphone: { type: 'string', pattern: '^(\\+62|62|0)[0-9]{9,12}$' },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tempatLahir: { type: 'string', maxLength: 100 },
                        tanggalLahir: { type: 'string', format: 'date' },
                        agama: { $ref: '#/components/schemas/Agama' },
                        emailPerusahaan: { type: 'string', format: 'email' },
                        divisiId: { type: 'string', format: 'uuid' },
                        departmentId: { type: 'string', format: 'uuid' },
                        posisiJabatanId: { type: 'string', format: 'uuid' },
                        statusKaryawanId: { type: 'string', format: 'uuid' },
                        lokasiKerjaId: { type: 'string', format: 'uuid' },
                        tagId: { type: 'string', format: 'uuid' },
                        jenisHubunganKerjaId: { type: 'string', format: 'uuid' },
                    },
                },
                UpdateKaryawan: {
                    type: 'object',
                    properties: {
                        namaLengkap: { type: 'string', minLength: 1, maxLength: 200 },
                        nomorHandphone: { type: 'string', pattern: '^(\\+62|62|0)[0-9]{9,12}$' },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tempatLahir: { type: 'string', maxLength: 100 },
                        tanggalLahir: { type: 'string', format: 'date' },
                        divisiId: { type: 'string', format: 'uuid' },
                        departmentId: { type: 'string', format: 'uuid' },
                        posisiJabatanId: { type: 'string', format: 'uuid' },
                        statusKaryawanId: { type: 'string', format: 'uuid' },
                        lokasiKerjaId: { type: 'string', format: 'uuid' },
                        tagId: { type: 'string', format: 'uuid' },
                        jenisHubunganKerjaId: { type: 'string', format: 'uuid' },
                    },
                },
                Anak: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        karyawanId: { type: 'string', format: 'uuid' },
                        urutanAnak: { type: 'integer' },
                        namaAnak: { type: 'string' },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tanggalLahir: { type: 'string', format: 'date', nullable: true },
                        keterangan: { type: 'string', nullable: true },
                    },
                },
                CreateAnak: {
                    type: 'object',
                    required: ['urutanAnak', 'namaAnak', 'jenisKelamin'],
                    properties: {
                        urutanAnak: { type: 'integer', minimum: 1 },
                        namaAnak: { type: 'string', minLength: 1, maxLength: 200 },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tanggalLahir: { type: 'string', format: 'date' },
                        keterangan: { type: 'string', maxLength: 500 },
                    },
                },
                SaudaraKandung: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        karyawanId: { type: 'string', format: 'uuid' },
                        urutanSaudara: { type: 'integer' },
                        namaSaudaraKandung: { type: 'string' },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tanggalLahir: { type: 'string', format: 'date', nullable: true },
                        pekerjaan: { type: 'string', nullable: true },
                    },
                },
                CreateSaudaraKandung: {
                    type: 'object',
                    required: ['urutanSaudara', 'namaSaudaraKandung', 'jenisKelamin'],
                    properties: {
                        urutanSaudara: { type: 'integer', minimum: 1, maximum: 5 },
                        namaSaudaraKandung: { type: 'string', minLength: 1, maxLength: 200 },
                        jenisKelamin: { $ref: '#/components/schemas/JenisKelamin' },
                        tanggalLahir: { type: 'string', format: 'date' },
                        pekerjaan: { type: 'string', maxLength: 100 },
                    },
                },
                DokumenKaryawan: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        karyawanId: { type: 'string', format: 'uuid' },
                        jenisDokumen: { type: 'string' },
                        namaFile: { type: 'string' },
                        pathFile: { type: 'string' },
                        ukuranFile: { type: 'integer' },
                        mimeType: { type: 'string' },
                        keterangan: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                QRCodeResponse: {
                    type: 'object',
                    properties: {
                        qrcode: { type: 'string', description: 'Base64 encoded QR code image' },
                        nik: { type: 'string', description: 'Nomor Induk Karyawan' },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Employee Management', description: 'Manajemen data karyawan' },
            { name: 'Divisi', description: 'Divisi master data' },
            { name: 'Department', description: 'Department master data' },
            { name: 'Posisi Jabatan', description: 'Posisi Jabatan master data' },
            { name: 'Kategori Pangkat', description: 'Kategori Pangkat master data' },
            { name: 'Golongan', description: 'Golongan master data' },
            { name: 'Sub Golongan', description: 'Sub Golongan master data' },
            { name: 'Jenis Hubungan Kerja', description: 'Jenis Hubungan Kerja master data' },
            { name: 'Tag', description: 'Tag master data' },
            { name: 'Lokasi Kerja', description: 'Lokasi Kerja master data' },
            { name: 'Status Karyawan', description: 'Status Karyawan master data' },
        ],
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Bebang API Documentation',
    }));

    // Swagger JSON endpoint
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('📚 Swagger UI available at /api-docs');
};

export { swaggerSpec };

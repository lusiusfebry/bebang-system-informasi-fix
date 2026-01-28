import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// DEV-ONLY credentials - DO NOT USE IN PRODUCTION
const DEV_CREDENTIALS = {
    admin: {
        nik: 'DEV_ADMIN',
        email: 'dev.admin@bebang.local',
        password: 'DevAdmin@2024!',
        fullName: 'Development Administrator',
    },
    user: {
        nik: 'DEV_USER',
        email: 'dev.user@bebang.local',
        password: 'DevUser@2024!',
        fullName: 'Development Test User',
    },
};

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('⚠️  Using DEV-ONLY credentials - DO NOT USE IN PRODUCTION');

    // Hash passwords before storing
    const adminHashedPassword = await hashPassword(DEV_CREDENTIALS.admin.password);
    const userHashedPassword = await hashPassword(DEV_CREDENTIALS.user.password);

    // Create default admin user with hashed password
    const adminUser = await prisma.user.upsert({
        where: { nik: DEV_CREDENTIALS.admin.nik },
        update: {
            password: adminHashedPassword, // Update password if user exists
        },
        create: {
            nik: DEV_CREDENTIALS.admin.nik,
            email: DEV_CREDENTIALS.admin.email,
            password: adminHashedPassword,
            fullName: DEV_CREDENTIALS.admin.fullName,
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('✅ Created/Updated admin user:', adminUser.nik);

    // Create test user with hashed password
    const testUser = await prisma.user.upsert({
        where: { nik: DEV_CREDENTIALS.user.nik },
        update: {
            password: userHashedPassword, // Update password if user exists
        },
        create: {
            nik: DEV_CREDENTIALS.user.nik,
            email: DEV_CREDENTIALS.user.email,
            password: userHashedPassword,
            fullName: DEV_CREDENTIALS.user.fullName,
            role: 'USER',
            isActive: true,
        },
    });

    console.log('✅ Created/Updated test user:', testUser.nik);

    // ==========================================
    // HR MASTER DATA SEEDING
    // ==========================================

    console.log('');
    console.log('📁 Seeding HR Master Data...');

    // Generate stable UUIDs for master data (using deterministic approach for repeatability)
    // These UUIDs are generated once and hard-coded for consistency across runs
    const DIVISI_IDS = {
        operasional: 'a1b2c3d4-1111-4aaa-bbbb-111111111111',
        keuangan: 'a1b2c3d4-2222-4aaa-bbbb-222222222222',
        it: 'a1b2c3d4-3333-4aaa-bbbb-333333333333',
    };

    const DEPT_IDS = {
        hr: 'b1c2d3e4-1111-4bbb-cccc-111111111111',
        finance: 'b1c2d3e4-2222-4bbb-cccc-222222222222',
        itSupport: 'b1c2d3e4-3333-4bbb-cccc-333333333333',
        accounting: 'b1c2d3e4-4444-4bbb-cccc-444444444444',
        operations: 'b1c2d3e4-5555-4bbb-cccc-555555555555',
    };

    const POSISI_IDS = {
        hrManager: 'c1d2e3f4-1111-4ccc-dddd-111111111111',
        financeManager: 'c1d2e3f4-2222-4ccc-dddd-222222222222',
        itStaff: 'c1d2e3f4-3333-4ccc-dddd-333333333333',
        accountant: 'c1d2e3f4-4444-4ccc-dddd-444444444444',
        opsManager: 'c1d2e3f4-5555-4ccc-dddd-555555555555',
        hrStaff: 'c1d2e3f4-6666-4ccc-dddd-666666666666',
    };

    // Seed Divisi (3 records)
    const divisiData = [
        { id: DIVISI_IDS.operasional, namaDivisi: 'Divisi Operasional', keterangan: 'Mengelola operasional perusahaan' },
        { id: DIVISI_IDS.keuangan, namaDivisi: 'Divisi Keuangan', keterangan: 'Mengelola keuangan dan akuntansi' },
        { id: DIVISI_IDS.it, namaDivisi: 'Divisi IT', keterangan: 'Mengelola teknologi informasi' },
    ];

    for (const divisi of divisiData) {
        await prisma.divisi.upsert({
            where: { id: divisi.id },
            update: { namaDivisi: divisi.namaDivisi, keterangan: divisi.keterangan },
            create: divisi,
        });
    }
    console.log('  ✅ Divisi: 3 records');

    // Seed Department (5 records, linked to Divisi)
    const departmentData = [
        { id: DEPT_IDS.hr, namaDepartment: 'HR Department', divisiId: DIVISI_IDS.operasional, keterangan: 'Human Resources' },
        { id: DEPT_IDS.finance, namaDepartment: 'Finance Department', divisiId: DIVISI_IDS.keuangan, keterangan: 'Financial Operations' },
        { id: DEPT_IDS.itSupport, namaDepartment: 'IT Support', divisiId: DIVISI_IDS.it, keterangan: 'IT Support & Infrastructure' },
        { id: DEPT_IDS.accounting, namaDepartment: 'Accounting', divisiId: DIVISI_IDS.keuangan, keterangan: 'Accounting & Reporting' },
        { id: DEPT_IDS.operations, namaDepartment: 'Operations', divisiId: DIVISI_IDS.operasional, keterangan: 'Day-to-day Operations' },
    ];

    for (const dept of departmentData) {
        await prisma.department.upsert({
            where: { id: dept.id },
            update: { namaDepartment: dept.namaDepartment, divisiId: dept.divisiId, keterangan: dept.keterangan },
            create: dept,
        });
    }
    console.log('  ✅ Department: 5 records');

    // Seed Posisi Jabatan (6 records, linked to Department)
    const posisiJabatanData = [
        { id: POSISI_IDS.hrManager, namaPosisiJabatan: 'HR Manager', departmentId: DEPT_IDS.hr, keterangan: 'Manages HR operations' },
        { id: POSISI_IDS.financeManager, namaPosisiJabatan: 'Finance Manager', departmentId: DEPT_IDS.finance, keterangan: 'Manages financial operations' },
        { id: POSISI_IDS.itStaff, namaPosisiJabatan: 'IT Support Staff', departmentId: DEPT_IDS.itSupport, keterangan: 'Provides IT support' },
        { id: POSISI_IDS.accountant, namaPosisiJabatan: 'Accountant', departmentId: DEPT_IDS.accounting, keterangan: 'Handles accounting tasks' },
        { id: POSISI_IDS.opsManager, namaPosisiJabatan: 'Operations Manager', departmentId: DEPT_IDS.operations, keterangan: 'Manages operations' },
        { id: POSISI_IDS.hrStaff, namaPosisiJabatan: 'HR Staff', departmentId: DEPT_IDS.hr, keterangan: 'HR administrative tasks' },
    ];

    for (const pos of posisiJabatanData) {
        await prisma.posisiJabatan.upsert({
            where: { id: pos.id },
            update: { namaPosisiJabatan: pos.namaPosisiJabatan, departmentId: pos.departmentId, keterangan: pos.keterangan },
            create: pos,
        });
    }
    console.log('  ✅ Posisi Jabatan: 6 records');

    // Seed Kategori Pangkat (3 records) - use randomUUID for non-relational tables
    const kategoriPangkatData = [
        { id: randomUUID(), namaKategoriPangkat: 'Staff', keterangan: 'Level staff biasa' },
        { id: randomUUID(), namaKategoriPangkat: 'Supervisor', keterangan: 'Level supervisor' },
        { id: randomUUID(), namaKategoriPangkat: 'Manager', keterangan: 'Level manager' },
    ];

    for (const kp of kategoriPangkatData) {
        // Use upsert by namaKategoriPangkat to avoid duplicates
        const existing = await prisma.kategoriPangkat.findFirst({ where: { namaKategoriPangkat: kp.namaKategoriPangkat } });
        if (!existing) {
            await prisma.kategoriPangkat.create({ data: kp });
        }
    }
    console.log('  ✅ Kategori Pangkat: 3 records');

    // Seed Golongan (4 records)
    const golonganData = [
        { id: randomUUID(), namaGolongan: 'Golongan I', keterangan: 'Golongan terendah' },
        { id: randomUUID(), namaGolongan: 'Golongan II', keterangan: 'Golongan menengah bawah' },
        { id: randomUUID(), namaGolongan: 'Golongan III', keterangan: 'Golongan menengah atas' },
        { id: randomUUID(), namaGolongan: 'Golongan IV', keterangan: 'Golongan tertinggi' },
    ];

    for (const gol of golonganData) {
        const existing = await prisma.golongan.findFirst({ where: { namaGolongan: gol.namaGolongan } });
        if (!existing) {
            await prisma.golongan.create({ data: gol });
        }
    }
    console.log('  ✅ Golongan: 4 records');

    // Seed Sub Golongan (4 records)
    const subGolonganData = [
        { id: randomUUID(), namaSubGolongan: 'Sub Golongan A', keterangan: 'Sub level A' },
        { id: randomUUID(), namaSubGolongan: 'Sub Golongan B', keterangan: 'Sub level B' },
        { id: randomUUID(), namaSubGolongan: 'Sub Golongan C', keterangan: 'Sub level C' },
        { id: randomUUID(), namaSubGolongan: 'Sub Golongan D', keterangan: 'Sub level D' },
    ];

    for (const sg of subGolonganData) {
        const existing = await prisma.subGolongan.findFirst({ where: { namaSubGolongan: sg.namaSubGolongan } });
        if (!existing) {
            await prisma.subGolongan.create({ data: sg });
        }
    }
    console.log('  ✅ Sub Golongan: 4 records');

    // Seed Jenis Hubungan Kerja (3 records)
    const jenisHubunganKerjaData = [
        { id: randomUUID(), namaJenisHubunganKerja: 'Karyawan Tetap', keterangan: 'Karyawan dengan kontrak tetap' },
        { id: randomUUID(), namaJenisHubunganKerja: 'Karyawan Kontrak', keterangan: 'Karyawan dengan kontrak terbatas' },
        { id: randomUUID(), namaJenisHubunganKerja: 'Karyawan Magang', keterangan: 'Karyawan dalam program magang' },
    ];

    for (const jhk of jenisHubunganKerjaData) {
        const existing = await prisma.jenisHubunganKerja.findFirst({ where: { namaJenisHubunganKerja: jhk.namaJenisHubunganKerja } });
        if (!existing) {
            await prisma.jenisHubunganKerja.create({ data: jhk });
        }
    }
    console.log('  ✅ Jenis Hubungan Kerja: 3 records');

    // Seed Tag (5 records with colors)
    const tagData = [
        { id: randomUUID(), namaTag: 'Prioritas Tinggi', warnaTag: '#FF0000', keterangan: 'Penanda prioritas tinggi' },
        { id: randomUUID(), namaTag: 'Karyawan Baru', warnaTag: '#00FF00', keterangan: 'Penanda karyawan baru' },
        { id: randomUUID(), namaTag: 'Training', warnaTag: '#0000FF', keterangan: 'Sedang dalam training' },
        { id: randomUUID(), namaTag: 'Remote Worker', warnaTag: '#FFA500', keterangan: 'Bekerja secara remote' },
        { id: randomUUID(), namaTag: 'Part Time', warnaTag: '#800080', keterangan: 'Karyawan paruh waktu' },
    ];

    for (const tag of tagData) {
        const existing = await prisma.tag.findFirst({ where: { namaTag: tag.namaTag } });
        if (!existing) {
            await prisma.tag.create({ data: tag });
        }
    }
    console.log('  ✅ Tag: 5 records');

    // Seed Lokasi Kerja (3 records)
    const lokasiKerjaData = [
        { id: randomUUID(), namaLokasiKerja: 'Kantor Pusat Jakarta', alamat: 'Jl. Sudirman No. 123, Jakarta', keterangan: 'Head Office' },
        { id: randomUUID(), namaLokasiKerja: 'Kantor Cabang Surabaya', alamat: 'Jl. Tunjungan No. 45, Surabaya', keterangan: 'Branch Office Surabaya' },
        { id: randomUUID(), namaLokasiKerja: 'Kantor Cabang Bandung', alamat: 'Jl. Asia Afrika No. 67, Bandung', keterangan: 'Branch Office Bandung' },
    ];

    for (const lok of lokasiKerjaData) {
        const existing = await prisma.lokasiKerja.findFirst({ where: { namaLokasiKerja: lok.namaLokasiKerja } });
        if (!existing) {
            await prisma.lokasiKerja.create({ data: lok });
        }
    }
    console.log('  ✅ Lokasi Kerja: 3 records');

    // Seed Status Karyawan (4 records)
    const statusKaryawanData = [
        { id: randomUUID(), namaStatus: 'Aktif', keterangan: 'Karyawan aktif bekerja' },
        { id: randomUUID(), namaStatus: 'Cuti', keterangan: 'Karyawan sedang cuti' },
        { id: randomUUID(), namaStatus: 'Resign', keterangan: 'Karyawan sudah mengundurkan diri' },
        { id: randomUUID(), namaStatus: 'Pensiun', keterangan: 'Karyawan sudah pensiun' },
    ];

    for (const sk of statusKaryawanData) {
        const existing = await prisma.statusKaryawan.findFirst({ where: { namaStatus: sk.namaStatus } });
        if (!existing) {
            await prisma.statusKaryawan.create({ data: sk });
        }
    }
    console.log('  ✅ Status Karyawan: 4 records');

    console.log('');
    console.log('🔐 DEV-ONLY Credentials (passwords are hashed in DB):');
    console.log(`   Admin: NIK=${DEV_CREDENTIALS.admin.nik}, Password=${DEV_CREDENTIALS.admin.password}`);
    console.log(`   User:  NIK=${DEV_CREDENTIALS.user.nik}, Password=${DEV_CREDENTIALS.user.password}`);
    console.log('');
    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

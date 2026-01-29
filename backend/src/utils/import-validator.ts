import { prisma } from '../lib/prisma';
import { ParsedEmployeeData } from './excel-parser';
import { z } from 'zod';
import { createKaryawanSchema } from '../validators/employee.validator';

export interface ImportValidationResult {
    summary: {
        totalRows: number;
        validRows: number;
        invalidRows: number;
    };
    results: ParsedEmployeeData[];
}

// Master data cache interface
interface MasterDataCache {
    divisi: Map<string, string>;
    department: Map<string, string>;
    posisiJabatan: Map<string, string>;
    statusKaryawan: Map<string, string>;
    lokasiKerja: Map<string, string>;
    existingNIKs: Set<string>;
    existingEmails: Set<string>;
}

export async function validateImportData(parsedData: ParsedEmployeeData[]): Promise<ImportValidationResult> {
    // 1. Fetch all master data for lookup
    const [
        divisi,
        departments,
        posisi,
        status,
        lokasi,
        existingEmployees
    ] = await Promise.all([
        prisma.divisi.findMany(),
        prisma.department.findMany(),
        prisma.posisiJabatan.findMany(),
        prisma.statusKaryawan.findMany(),
        prisma.lokasiKerja.findMany(),
        prisma.karyawan.findMany({
            select: { nomorIndukKaryawan: true, emailPerusahaan: true }
        })
    ]);

    // 2. Build Maps for O(1) lookup
    // Normalize names to lowercase/trim for better matching
    const cache: MasterDataCache = {
        divisi: new Map(divisi.map(d => [d.namaDivisi.toLowerCase().trim(), d.id])),
        department: new Map(departments.map(d => [d.namaDepartment.toLowerCase().trim(), d.id])),
        posisiJabatan: new Map(posisi.map(d => [d.namaPosisiJabatan.toLowerCase().trim(), d.id])),
        statusKaryawan: new Map(status.map(d => [d.namaStatus.toLowerCase().trim(), d.id])),
        lokasiKerja: new Map(lokasi.map(d => [d.namaLokasiKerja.toLowerCase().trim(), d.id])),
        existingNIKs: new Set(existingEmployees.map(e => e.nomorIndukKaryawan)),
        existingEmails: new Set(existingEmployees.filter(e => e.emailPerusahaan).map(e => e.emailPerusahaan!))
    };

    const results = parsedData.map(row => {
        const errors = [...row.errors];
        const data = row.data;

        // 3. Resolve Relations
        if (data.divisiName) {
            const id = cache.divisi.get(data.divisiName.toLowerCase().trim());
            if (id) data.divisiId = id;
            else errors.push(`Divisi '${data.divisiName}' tidak ditemukan`);
        }

        if (data.departmentName) {
            const id = cache.department.get(data.departmentName.toLowerCase().trim());
            if (id) data.departmentId = id;
            else errors.push(`Department '${data.departmentName}' tidak ditemukan`);
        }

        if (data.posisiJabatanName) {
            const id = cache.posisiJabatan.get(data.posisiJabatanName.toLowerCase().trim());
            if (id) data.posisiJabatanId = id;
            else errors.push(`Posisi '${data.posisiJabatanName}' tidak ditemukan`);
        }

        if (data.statusKaryawanName) {
            const id = cache.statusKaryawan.get(data.statusKaryawanName.toLowerCase().trim());
            if (id) data.statusKaryawanId = id;
            else errors.push(`Status '${data.statusKaryawanName}' tidak ditemukan`);
        }

        if (data.lokasiKerjaName) {
            const id = cache.lokasiKerja.get(data.lokasiKerjaName.toLowerCase().trim());
            if (id) data.lokasiKerjaId = id;
            else errors.push(`Lokasi '${data.lokasiKerjaName}' tidak ditemukan`);
        }

        // 4. Check Duplicates (Internal & Database)
        if (data.nomorIndukKaryawan && cache.existingNIKs.has(data.nomorIndukKaryawan)) {
            errors.push(`NIK '${data.nomorIndukKaryawan}' sudah terdaftar`);
        }

        if (data.emailPerusahaan && cache.existingEmails.has(data.emailPerusahaan)) {
            errors.push(`Email '${data.emailPerusahaan}' sudah terdaftar`);
        }

        // 5. Schema Validation using Zod
        try {
            // Create a partial object for Zod validation
            // We only validate fields that are present, as Excel might be incomplete vs full form
            const minimalSchema = createKaryawanSchema.pick({
                namaLengkap: true,
                nomorIndukKaryawan: true,
                emailPerusahaan: true,
                nomorHandphone: true,
                jenisKelamin: true,
                agama: true,
                golonganDarah: true,
                statusPernikahan: true,
                tempatLahir: true,
                alamatKtp: true,
                alamatDomisili: true
            }).partial();

            minimalSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach(err => {
                    errors.push(`${err.path.join('.')}: ${err.message}`);
                });
            }
        }

        return {
            ...row,
            errors
        };
    });

    // Check for duplicates within the import file itself
    const seenNIKs = new Set<string>();
    results.forEach(row => {
        if (row.data.nomorIndukKaryawan) {
            if (seenNIKs.has(row.data.nomorIndukKaryawan)) {
                row.errors.push(`Duplicate NIK '${row.data.nomorIndukKaryawan}' dalam file import`);
            } else {
                seenNIKs.add(row.data.nomorIndukKaryawan);
            }
        }
    });

    const validRows = results.filter(r => r.errors.length === 0).length;
    const invalidRows = results.length - validRows;

    return {
        summary: {
            totalRows: results.length,
            validRows,
            invalidRows
        },
        results
    };
}

import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { validateImportData, ImportValidationResult } from '../utils/import-validator';
import { parseEmployeeExcel, ParsedEmployeeData } from '../utils/excel-parser';
import { cleanupTempFiles } from '../utils/cleanup';
import { deleteFile } from '../config/upload';

export class ImportService {
    /**
     * Preview import data before executing
     * Parses Excel and runs validation
     */
    async previewImport(filePath: string): Promise<ImportValidationResult> {
        try {
            // 1. Parse Excel
            const parsedData = parseEmployeeExcel(filePath);

            // 2. Validate Data
            const validationResult = await validateImportData(parsedData);

            return validationResult;
        } catch (error) {
            console.error('Error in previewImport:', error);
            throw error;
        }
    }

    /**
     * Confirm and execute import
     * Inserts valid data into database using transaction
     */
    async executeImport(filePath: string): Promise<{ successCount: number; data: any[] }> {
        const parsedData = parseEmployeeExcel(filePath);
        const validationResult = await validateImportData(parsedData);

        // Filter only valid rows
        const validRows = validationResult.results.filter(r => r.errors.length === 0);

        if (validRows.length === 0) {
            throw new Error('Tidak ada data valid untuk diimport');
        }

        try {
            // Execute in transaction
            const result = await prisma.$transaction(async (tx) => {
                const inserted = [];

                for (const row of validRows) {
                    const data = row.data;

                    // Create minimal employee record
                    const employee = await tx.karyawan.create({
                        data: {
                            // Required Fields (validated by import-validator)
                            namaLengkap: data.namaLengkap!,
                            nomorIndukKaryawan: data.nomorIndukKaryawan!,
                            emailPerusahaan: data.emailPerusahaan!,
                            nomorHandphone: data.nomorHandphone!,

                            // Relations (IDs assumed valid from validation step)
                            divisiId: data.divisiId,
                            departmentId: data.departmentId,
                            posisiJabatanId: data.posisiJabatanId,
                            statusKaryawanId: data.statusKaryawanId,
                            lokasiKerjaId: data.lokasiKerjaId,

                            // Optional Fields map
                            jenisKelamin: data.jenisKelamin,
                            agama: data.agama,
                            golonganDarah: data.golonganDarah,
                            statusPernikahan: data.statusPernikahan,
                            tempatLahir: data.tempatLahir,
                            tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
                            alamatKtp: data.alamatKtp,
                            alamatDomisili: data.alamatDomisili,
                            tanggalMasuk: data.tanggalMasuk ? new Date(data.tanggalMasuk) : new Date(),
                        }
                    });
                    inserted.push(employee);
                }

                return inserted;
            });

            // Cleanup temp file after success
            cleanupTempFiles(); // Clean old files
            deleteFile(filePath); // Delete current file

            return {
                successCount: result.length,
                data: result
            };

        } catch (error) {
            console.error('Transaction failed:', error);
            throw new Error(`Import gagal: ${(error as Error).message}`);
        }
    }

    /**
     * Get template file path
     */
    getTemplatePath(): string {
        // Try multiple potential paths to be safe (dev vs prod/build)
        const possiblePaths = [
            path.resolve(process.cwd(), 'planning', 'BMI-kosong.xlsx'),
            path.resolve(process.cwd(), '..', 'planning', 'BMI-kosong.xlsx'), // If running from src
            path.join(__dirname, '..', '..', 'planning', 'BMI-kosong.xlsx')
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }

        // Fallback: Create a basic template if file missing
        throw new Error('Template file not found at: ' + possiblePaths[0]);
    }
}

export const importService = new ImportService();

import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { parseEmployeeExcel, parseExcelDate, ParsedRawData } from '../utils/excel-parser';
import { cleanupTempFiles } from '../utils/cleanup';
import { deleteFile } from '../config/upload';
import { PROFILE_MAPPING } from '../config/excel-mapping';

// Helper to convert snake_case to camelCase
const snakeToCamel = (s: string) => {
    return s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

// Relation Mapping Config
const RELATION_MAP: Record<string, { model: string, field: string, fk: string }> = {
    'divisi': { model: 'divisi', field: 'namaDivisi', fk: 'divisiId' },
    'department': { model: 'department', field: 'namaDepartment', fk: 'departmentId' },
    'posisi_jabatan': { model: 'posisiJabatan', field: 'namaPosisiJabatan', fk: 'posisiJabatanId' },
    'kategori_pangkat': { model: 'kategoriPangkat', field: 'namaKategoriPangkat', fk: 'kategoriPangkatId' },
    'golongan_pangkat': { model: 'golongan', field: 'namaGolongan', fk: 'golonganPangkatId' },
    'sub_golongan_pangkat': { model: 'subGolongan', field: 'namaSubGolongan', fk: 'subGolonganPangkatId' },
    'jenis_hubungan_kerja': { model: 'jenisHubunganKerja', field: 'namaJenisHubunganKerja', fk: 'jenisHubunganKerjaId' },
    'tag': { model: 'tag', field: 'namaTag', fk: 'tagId' },
    'lokasi_kerja': { model: 'lokasiKerja', field: 'namaLokasiKerja', fk: 'lokasiKerjaId' },
    'lokasi_sebelumnya': { model: 'lokasiKerja', field: 'namaLokasiKerja', fk: 'lokasiSebelumnyaId' },
    'status_karyawan': { model: 'statusKaryawan', field: 'namaStatus', fk: 'statusKaryawanId' },
};

export class ImportService {

    async previewImport(filePath: string): Promise<any> {
        // Just parse and show raw data for user confirmation (simplified)
        const parsed = parseEmployeeExcel(filePath);
        return {
            totalRows: parsed.length,
            preview: parsed.slice(0, 5)
        };
    }

    async executeImport(filePath: string): Promise<{ successCount: number; errors: any[] }> {
        const rows = parseEmployeeExcel(filePath);
        const errors: any[] = [];
        let successCount = 0;

        // Pre-load Master Data
        const masterDataCache: Record<string, Map<string, string>> = {};

        for (const key in RELATION_MAP) {
            const config = RELATION_MAP[key];
            // @ts-ignore
            const items = await prisma[config.model].findMany();
            const map = new Map<string, string>();
            items.forEach((item: any) => {
                const name = item[config.field];
                if (name) map.set(name.toLowerCase().trim(), item.id);
            });
            masterDataCache[key] = map;
        }

        for (const row of rows) {
            const rawData = row.data;
            const mappedData: any = {};
            const anakData: Record<number, any> = {};
            const saudaraData: Record<number, any> = {};

            try {
                // Determine NIK first
                const nikHeader = PROFILE_MAPPING.find(m => m.dbField === 'nomor_induk_karyawan')?.excelHeader;
                if (!nikHeader || !rawData[nikHeader]) {
                    errors.push({ row: row.rowNumber, error: 'NIK Missing' });
                    continue;
                }
                const nik = String(rawData[nikHeader]).trim();
                mappedData['nomorIndukKaryawan'] = nik;

                // Process all mappings
                for (const mapping of PROFILE_MAPPING) {
                    const excelVal = rawData[mapping.excelHeader];
                    if (excelVal === undefined || excelVal === null || mapping.dbField === null || mapping.dbField === 'null') continue;

                    const dbFieldRaw = mapping.dbField;

                    // Handle Nested Arrays (Anak, Saudara)
                    if (dbFieldRaw.includes('_anak_')) {
                        const parts = dbFieldRaw.split('_anak_');
                        const fieldName = parts[0]; // e.g., 'nama', 'jenis_kelamin'
                        const index = parseInt(parts[1]);
                        if (!isNaN(index)) {
                            if (!anakData[index]) anakData[index] = { urutanAnak: index };
                            anakData[index][snakeToCamel(fieldName + '_anak')] = excelVal; // Fix field naming if needed
                            // Actually schema has `namaAnak`, `jenisKelamin`. 
                            // Mapping: `nama_anak_1` -> `namaAnak`
                            // My simple logic: `fieldName` is `nama` -> `namaAnak`? 
                            // Let's refine: `nama_anak_1`. prefix `nama_anak`. 
                            // Schema: `namaAnak`. 
                            // `jenis_kelamin_anak_1`. Schema `jenisKelamin`.
                            // `tanggal_lahir_anak_1`. Schema `tanggalLahir`.
                            // `keterangan_anak_1`. Schema `keterangan`.

                            // Adjust Mapping keys manually for cleaner code
                            if (dbFieldRaw.startsWith('nama_anak_')) anakData[index].namaAnak = String(excelVal);
                            if (dbFieldRaw.startsWith('jenis_kelamin_anak_')) {
                                anakData[index].jenisKelamin = String(excelVal).toUpperCase().replace(/\s/g, '_') === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI';
                            }
                            if (dbFieldRaw.startsWith('tanggal_lahir_anak_')) anakData[index].tanggalLahir = parseExcelDate(excelVal);
                            if (dbFieldRaw.startsWith('keterangan_anak_')) anakData[index].keterangan = String(excelVal);
                        }
                        continue;
                    }

                    if (dbFieldRaw.includes('_saudara_kandung_')) {
                        const parts = dbFieldRaw.split('_saudara_kandung_');
                        const fieldName = parts[0];
                        const index = parseInt(parts[1]);
                        if (!isNaN(index)) {
                            if (!saudaraData[index]) saudaraData[index] = { urutanSaudara: index };
                            // Schema: namaSaudaraKandung, jenisKelamin, tanggalLahir, pendidikanTerakhir, pekerjaan, keterangan
                            if (dbFieldRaw.startsWith('nama_saudara_kandung_')) saudaraData[index].namaSaudaraKandung = String(excelVal);
                            if (dbFieldRaw.startsWith('jenis_kelamin_saudara_kandung_')) {
                                saudaraData[index].jenisKelamin = String(excelVal).toUpperCase().replace(/\s/g, '_') === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI';
                            }
                            if (dbFieldRaw.startsWith('tanggal_lahir_saudara_kandung_')) saudaraData[index].tanggalLahir = parseExcelDate(excelVal);
                            if (dbFieldRaw.startsWith('pendidikan_terakhir_saudara_kandung_')) saudaraData[index].pendidikanTerakhir = String(excelVal);
                            if (dbFieldRaw.startsWith('pekerjaan_saudara_kandung_')) saudaraData[index].pekerjaan = String(excelVal);
                            if (dbFieldRaw.startsWith('keterangan_saudara_kandung_')) saudaraData[index].keterangan = String(excelVal);
                        }
                        continue;
                    }


                    // Handle Relations
                    if (RELATION_MAP[dbFieldRaw]) {
                        const config = RELATION_MAP[dbFieldRaw];
                        const cache = masterDataCache[dbFieldRaw];
                        const key = String(excelVal).toLowerCase().trim();
                        if (cache && cache.has(key)) {
                            mappedData[config.fk] = cache.get(key);
                        } else {
                            // Option: Create or Skip? For now, skip and log warning?
                            // Or leave null.
                        }
                        continue;
                    }

                    // Handle Standard Fields
                    const camelKey = snakeToCamel(dbFieldRaw); // e.g. nama_lengkap -> namaLengkap

                    // Date Parsing
                    if (['tanggalLahir', 'tanggalMasuk', 'tanggalMasukGroup', 'tanggalKontrak', 'tanggalAkhirKontrak', 'tanggalPermanent', 'tanggalBerhenti', 'tanggalMenikah', 'tanggalCerai', 'tanggalWafatPasangan', 'tanggalLahirPasangan', 'tanggalMutasi', 'tanggalLahirAyahMertua', 'tanggalLahirIbuMertua'].includes(camelKey)) {
                        mappedData[camelKey] = parseExcelDate(excelVal);
                    }
                    // Enums (Simple mapping)
                    else if (['jenisKelamin', 'agama', 'golonganDarah', 'statusPernikahan'].includes(camelKey)) {
                        mappedData[camelKey] = String(excelVal).toUpperCase().replace(/\s/g, '_');
                    }
                    else if (['jumlahAnak', 'jumlahSaudaraKandung', 'anakKe'].includes(camelKey)) {
                        mappedData[camelKey] = Number(excelVal) || 0;
                    }
                    else {
                        mappedData[camelKey] = String(excelVal);
                    }
                }

                // Prepare Nested Data for Prisma
                const anakCreate = Object.values(anakData).filter(a => a.namaAnak); // Only valid
                const saudaraCreate = Object.values(saudaraData).filter(s => s.namaSaudaraKandung);

                // Transaction Upsert
                await prisma.$transaction(async (tx) => {
                    // Check if exists
                    const existing = await tx.karyawan.findUnique({ where: { nomorIndukKaryawan: nik } });

                    if (existing) {
                        // Update
                        await tx.karyawan.update({
                            where: { id: existing.id },
                            data: {
                                ...mappedData,
                                // Handle nested updates? For simplicity, delete and recreate children or just create new ones? 
                                // Proper: deleteMany then createMany.
                                anak: { deleteMany: {}, create: anakCreate },
                                saudaraKandung: { deleteMany: {}, create: saudaraCreate }
                            }
                        });
                    } else {
                        // Create
                        await tx.karyawan.create({
                            data: {
                                ...mappedData,
                                anak: { create: anakCreate },
                                saudaraKandung: { create: saudaraCreate }
                            }
                        });
                    }
                });

                successCount++;

            } catch (err) {
                console.error(`Error processing row ${row.rowNumber}:`, err);
                errors.push({ row: row.rowNumber, error: (err as Error).message });
            }
        }

        // Cleanup
        cleanupTempFiles();
        deleteFile(filePath);

        return { successCount, errors };
    }

    getTemplatePath(): string {
        const p = path.resolve(process.cwd(), 'planning', 'BMI-kosong.xlsx');
        if (fs.existsSync(p)) return p;
        // Try relative to src
        const p2 = path.resolve(process.cwd(), '../planning', 'BMI-kosong.xlsx');
        if (fs.existsSync(p2)) return p2;

        throw new Error('Template file not found');
    }
}


export const importService = new ImportService();

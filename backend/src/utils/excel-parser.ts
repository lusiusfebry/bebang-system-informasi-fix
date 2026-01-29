import * as XLSX from 'xlsx';
import {
    CreateKaryawanInput
} from '../validators/employee.validator';

// Enums (Define locally since we only need string keys)
const JenisKelamin = { LAKI_LAKI: 'LAKI_LAKI', PEREMPUAN: 'PEREMPUAN' };
const Agama = { ISLAM: 'ISLAM', KRISTEN: 'KRISTEN', KATOLIK: 'KATOLIK', HINDU: 'HINDU', BUDDHA: 'BUDDHA', KONGHUCU: 'KONGHUCU' };
const GolonganDarah = { A: 'A', B: 'B', AB: 'AB', O: 'O' };
const StatusPernikahan = { BELUM_MENIKAH: 'BELUM_MENIKAH', MENIKAH: 'MENIKAH', CERAI_HIDUP: 'CERAI_HIDUP', CERAI_MATI: 'CERAI_MATI' };

export interface ExcelEmployeeRow {
    'Nama Lengkap': string;
    'NIK': string;
    'Email Perusahaan': string;
    'No. Handphone': string;
    'Tempat Lahir'?: string;
    'Tanggal Lahir'?: number | string; // Excel serial date or string
    'Jenis Kelamin'?: string;
    'Agama'?: string;
    'Golongan Darah'?: string;
    'Status Pernikahan'?: string;
    'Alamat KTP'?: string;
    'Alamat Domisili'?: string;
    'Divisi'?: string;
    'Department'?: string;
    'Posisi Jabatan'?: string;
    'Status Karyawan'?: string;
    'Lokasi Kerja'?: string;
    'Tanggal Masuk'?: number | string;
}

export interface ParsedEmployeeData {
    data: Partial<CreateKaryawanInput> & {
        divisiName?: string;
        departmentName?: string;
        posisiJabatanName?: string;
        statusKaryawanName?: string;
        lokasiKerjaName?: string;
    };
    rowNumber: number;
    errors: string[];
}

export interface ImportPreview {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    preview: ParsedEmployeeData[];
    errors: { row: number; errors: string[] }[];
}

// Helper to parse Excel date
function parseExcelDate(value: any): string | undefined {
    if (!value) return undefined;

    // If it's a number (Excel serial date)
    if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value);
        // Format to YYYY-MM-DD
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }

    // If it's a string, try to parse or return as is (validation will handle validity)
    return String(value);
}

// Helper to map enums
function mapEnum<T>(value: string | undefined, enumType: any, defaultValue?: T): T | undefined {
    if (!value) return defaultValue;

    const normalized = value.trim().toUpperCase().replace(/\s+/g, '_');
    if (Object.values(enumType).includes(normalized)) {
        return normalized as T;
    }

    return undefined;
}

export function parseEmployeeExcel(filePath: string): ParsedEmployeeData[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json<ExcelEmployeeRow>(worksheet);
    const parsedData: ParsedEmployeeData[] = [];

    jsonData.forEach((row, index) => {
        const errors: string[] = [];
        const rowNumber = index + 2; // +2 because Excel is 1-based and has header

        // Basic required check
        if (!row['Nama Lengkap']) errors.push('Nama Lengkap required');
        if (!row['NIK']) errors.push('NIK required');

        const data: any = {
            namaLengkap: row['Nama Lengkap'],
            nomorIndukKaryawan: row['NIK'], // Will be converted to string,
            emailPerusahaan: row['Email Perusahaan'],
            nomorHandphone: row['No. Handphone'],
            tempatLahir: row['Tempat Lahir'],
            alamatKtp: row['Alamat KTP'],
            alamatDomisili: row['Alamat Domisili'],

            // Helper properties for IDs lookup
            divisiName: row['Divisi'],
            departmentName: row['Department'],
            posisiJabatanName: row['Posisi Jabatan'],
            statusKaryawanName: row['Status Karyawan'],
            lokasiKerjaName: row['Lokasi Kerja'],
        };

        // Handle numeric NIK conversions
        if (data.nomorIndukKaryawan) {
            data.nomorIndukKaryawan = String(data.nomorIndukKaryawan);
        }

        if (data.nomorHandphone) {
            data.nomorHandphone = String(data.nomorHandphone);
        }

        // Parse Dates
        if (row['Tanggal Lahir']) {
            data.tanggalLahir = parseExcelDate(row['Tanggal Lahir']);
        }

        if (row['Tanggal Masuk']) {
            data.tanggalMasuk = parseExcelDate(row['Tanggal Masuk']);
        }

        // Map Enums
        if (row['Jenis Kelamin']) data.jenisKelamin = mapEnum(row['Jenis Kelamin'], JenisKelamin);
        if (row['Agama']) data.agama = mapEnum(row['Agama'], Agama);
        if (row['Golongan Darah']) data.golonganDarah = mapEnum(row['Golongan Darah'], GolonganDarah);
        if (row['Status Pernikahan']) data.statusPernikahan = mapEnum(row['Status Pernikahan'], StatusPernikahan);

        parsedData.push({
            data,
            rowNumber,
            errors
        });
    });

    return parsedData;
}

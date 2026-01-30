// @ts-ignore
import { Parser } from 'json2csv';

export function generateEmployeeCSV(employees: any[]): string {
    const fields = [
        { label: 'ID', value: 'id' },
        { label: 'Nama Lengkap', value: 'namaLengkap' },
        { label: 'NIK', value: 'nomorIndukKaryawan' },
        { label: 'Email', value: 'emailPerusahaan' },
        { label: 'No. HP', value: 'nomorHandphone' },
        { label: 'Divisi', value: 'divisi.namaDivisi', default: '-' },
        { label: 'Department', value: 'department.namaDepartment', default: '-' },
        { label: 'Posisi', value: 'posisiJabatan.namaPosisiJabatan', default: '-' },
        { label: 'Status', value: 'statusKaryawan.namaStatus', default: '-' },
        { label: 'Tanggal Masuk', value: 'tanggalMasuk' },
    ];

    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(employees);
}

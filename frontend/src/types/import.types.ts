import { CreateEmployeeDTO } from './employee.types';

export interface ParsedEmployeeData {
    data: Partial<CreateEmployeeDTO> & {
        divisiName?: string;
        departmentName?: string;
        posisiJabatanName?: string;
        statusKaryawanName?: string;
        lokasiKerjaName?: string;
    };
    rowNumber: number;
    errors: string[];
}

export interface ImportError {
    row: number;
    errors: string[];
}

export interface ImportPreviewResponse {
    success: boolean;
    data: {
        totalRows: number;
        validRows: number;
        invalidRows: number;
        preview: ParsedEmployeeData[];
        errors: { row: number; errors: string[] }[];
        tempFilePath: string;
    };
    message: string;
}

export interface ImportResultResponse {
    success: boolean;
    message: string;
    data: {
        successCount: number;
        data: any[];
    };
}

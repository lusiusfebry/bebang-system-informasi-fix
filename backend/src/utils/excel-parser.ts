import * as XLSX from 'xlsx';

export interface ParsedRawData {
    data: Record<string, any>;
    rowNumber: number;
}

// Helper to parse Excel date
export function parseExcelDate(value: any): Date | undefined {
    if (!value) return undefined;

    // If it's a number (Excel serial date)
    if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value);
        return new Date(date.y, date.m - 1, date.d);
    }

    // If it's a string, try to parse
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return undefined;
}

export function parseEmployeeExcel(filePath: string): ParsedRawData[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assume first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Get raw JSON with header row as keys
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        raw: true, // Keep original types (numbers, bools)
        defval: null // Default value for empty cells
    });

    return jsonData.map((row, index) => ({
        data: row,
        rowNumber: index + 2
    }));
}

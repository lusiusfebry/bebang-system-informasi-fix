/**
 * Employee Service
 * API calls for employee management
 */

import api from './api';
import {
    Employee,
    EmployeeQueryParams,
    PaginatedEmployeeResponse,
    EmployeeResponse,
    CreateEmployeeDTO,
    UpdateEmployeeDTO,
    CreateAnakDTO,
    CreateSaudaraKandungDTO,
    Anak,
    SaudaraKandung,
    DokumenKaryawan,
    QRCodeResponse,
} from '../types/employee.types';

const BASE_URL = '/hr/employees';

// ==========================================
// Main CRUD Operations
// ==========================================

/**
 * Get paginated list of employees with filters
 */
export const getEmployees = async (params: EmployeeQueryParams = {}): Promise<PaginatedEmployeeResponse> => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.divisiId) queryParams.append('divisiId', params.divisiId);
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params.statusKaryawanId) queryParams.append('statusKaryawanId', params.statusKaryawanId);
    if (params.lokasiKerjaId) queryParams.append('lokasiKerjaId', params.lokasiKerjaId);
    if (params.tagId) queryParams.append('tagId', params.tagId);
    if (params.jenisHubunganKerjaId) queryParams.append('jenisHubunganKerjaId', params.jenisHubunganKerjaId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await api.get<PaginatedEmployeeResponse>(`${BASE_URL}?${queryParams.toString()}`);
    return response.data;
};

/**
 * Get employee by ID with all relations
 */
export const getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await api.get<EmployeeResponse>(`${BASE_URL}/${id}`);
    return response.data.data;
};

/**
 * Get employee by NIK
 */
export const getEmployeeByNik = async (nik: string): Promise<Employee> => {
    const response = await api.get<EmployeeResponse>(`${BASE_URL}/nik/${nik}`);
    return response.data.data;
};

/**
 * Create new employee
 */
export const createEmployee = async (data: CreateEmployeeDTO): Promise<Employee> => {
    const response = await api.post<EmployeeResponse>(BASE_URL, data);
    return response.data.data;
};

/**
 * Update employee
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeDTO): Promise<Employee> => {
    const response = await api.put<EmployeeResponse>(`${BASE_URL}/${id}`, data);
    return response.data.data;
};

/**
 * Delete employee
 */
export const deleteEmployee = async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};

// ==========================================
// Photo Upload
// ==========================================

/**
 * Upload employee photo
 */
export const uploadEmployeePhoto = async (id: string, file: File): Promise<Employee> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post<EmployeeResponse>(`${BASE_URL}/${id}/photo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

// ==========================================
// Document Management
// ==========================================

/**
 * Upload employee document
 */
export const uploadEmployeeDocument = async (
    id: string,
    file: File,
    jenisDokumen: string,
    keterangan?: string
): Promise<DokumenKaryawan> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('jenisDokumen', jenisDokumen);
    if (keterangan) formData.append('keterangan', keterangan);

    const response = await api.post<{ success: boolean; data: DokumenKaryawan }>(`${BASE_URL}/${id}/documents`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

/**
 * Delete employee document
 */
export const deleteEmployeeDocument = async (id: string, documentId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}/documents/${documentId}`);
};

// ==========================================
// Child Data - Anak
// ==========================================

/**
 * Add child to employee
 */
export const createAnak = async (employeeId: string, data: CreateAnakDTO): Promise<Anak> => {
    const response = await api.post<{ success: boolean; data: Anak }>(`${BASE_URL}/${employeeId}/anak`, data);
    return response.data.data;
};

/**
 * Update child
 */
export const updateAnak = async (employeeId: string, anakId: string, data: Partial<CreateAnakDTO>): Promise<Anak> => {
    const response = await api.put<{ success: boolean; data: Anak }>(`${BASE_URL}/${employeeId}/anak/${anakId}`, data);
    return response.data.data;
};

/**
 * Delete child
 */
export const deleteAnak = async (employeeId: string, anakId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${employeeId}/anak/${anakId}`);
};

// ==========================================
// Child Data - Saudara Kandung
// ==========================================

/**
 * Add sibling to employee
 */
export const createSaudaraKandung = async (employeeId: string, data: CreateSaudaraKandungDTO): Promise<SaudaraKandung> => {
    const response = await api.post<{ success: boolean; data: SaudaraKandung }>(`${BASE_URL}/${employeeId}/saudara-kandung`, data);
    return response.data.data;
};

/**
 * Update sibling
 */
export const updateSaudaraKandung = async (employeeId: string, saudaraId: string, data: Partial<CreateSaudaraKandungDTO>): Promise<SaudaraKandung> => {
    const response = await api.put<{ success: boolean; data: SaudaraKandung }>(`${BASE_URL}/${employeeId}/saudara-kandung/${saudaraId}`, data);
    return response.data.data;
};

/**
 * Delete sibling
 */
export const deleteSaudaraKandung = async (employeeId: string, saudaraId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${employeeId}/saudara-kandung/${saudaraId}`);
};

// ==========================================
// QR Code
// ==========================================

/**
 * Get QR code for employee
 * @param format - 'image' returns PNG blob, 'base64' returns base64 string
 */
export const getEmployeeQRCode = async (id: string, format: 'image' | 'base64' = 'base64'): Promise<QRCodeResponse | Blob> => {
    if (format === 'image') {
        const response = await api.get(`${BASE_URL}/${id}/qrcode?format=image`, {
            responseType: 'blob',
        });
        return response.data;
    }

    const response = await api.get<QRCodeResponse>(`${BASE_URL}/${id}/qrcode?format=base64`);
    return response.data;
};

/**
 * Get QR code as base64 string
 */
export const getEmployeeQRCodeBase64 = async (id: string): Promise<string> => {
    const response = await api.get<QRCodeResponse>(`${BASE_URL}/${id}/qrcode?format=base64`);
    return response.data.data.qrcode;
};

/**
 * Export employee data as PDF
 */
export const exportEmployeePDF = async (id: string): Promise<Blob> => {
    const response = await api.get(`${BASE_URL}/${id}/export-pdf`, {
        responseType: 'blob',
    });
    return response.data;
};

/**
 * Bulk delete employees
 */
export const bulkDeleteEmployees = async (ids: string[]): Promise<void> => {
    await api.post(`${BASE_URL}/bulk-delete`, { ids });
};

/**
 * Export employees to CSV
 */
export const exportEmployeesCSV = async (params: EmployeeQueryParams): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.divisiId) queryParams.append('divisiId', params.divisiId);
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params.statusKaryawanId) queryParams.append('statusKaryawanId', params.statusKaryawanId);
    if (params.lokasiKerjaId) queryParams.append('lokasiKerjaId', params.lokasiKerjaId);
    if (params.tagId) queryParams.append('tagId', params.tagId);
    if (params.jenisHubunganKerjaId) queryParams.append('jenisHubunganKerjaId', params.jenisHubunganKerjaId);

    const response = await api.get(`${BASE_URL}/export?${queryParams.toString()}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const bulkGenerateQRCodes = async (employeeIds: string[]): Promise<Blob> => {
    const response = await api.post(`${BASE_URL}/bulk-qrcode`,
        { ids: employeeIds },
        { responseType: 'blob' }
    );
    return response.data;
};

// Export as object for compatibility
export const employeeService = {
    getEmployees,
    getEmployeeById,
    getEmployeeByNik,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    uploadEmployeePhoto,
    uploadEmployeeDocument,
    deleteEmployeeDocument,
    createAnak,
    updateAnak,
    deleteAnak,
    createSaudaraKandung,
    updateSaudaraKandung,
    deleteSaudaraKandung,
    getEmployeeQRCode,
    getEmployeeQRCodeBase64,
    exportEmployeePDF,
    bulkDeleteEmployees,
    exportEmployeesCSV,
    bulkGenerateQRCodes,
};

export default employeeService;

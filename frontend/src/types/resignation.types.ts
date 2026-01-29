import { Employee } from './employee.types';

export enum ResignationType {
    RESIGNATION = 'RESIGNATION',
    TERMINATION = 'TERMINATION',
    LAYOFF = 'LAYOFF',
    RETIREMENT = 'RETIREMENT',
    OTHER = 'OTHER'
}

export enum ResignationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export interface Resignation {
    id: string;
    karyawanId: string;
    type: ResignationType;
    submissionDate: string;
    effectiveDate: string;
    reason: string;
    remarks?: string;
    status: ResignationStatus;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
    karyawan?: Partial<Employee>; // Include basic info
}

export interface CreateResignationDTO {
    karyawanId: string;
    type: ResignationType;
    effectiveDate: string | Date;
    reason: string;
    remarks?: string;
}

export interface ResignationFilters {
    page?: number;
    limit?: number;
    status?: ResignationStatus;
    search?: string;
}

export interface ResignationListResponse {
    data: Resignation[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

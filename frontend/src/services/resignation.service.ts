import api from './api';
import {
    Resignation,
    CreateResignationDTO,
    ResignationFilters,
    ResignationListResponse
} from '../types/resignation.types';

const BASE_URL = '/hr/resignations';

export const resignationService = {
    getAll: async (params?: ResignationFilters): Promise<ResignationListResponse> => {
        const response = await api.get(BASE_URL, { params });
        return response.data;
    },

    getById: async (id: string): Promise<Resignation> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data.data;
    },

    create: async (data: CreateResignationDTO): Promise<Resignation> => {
        const response = await api.post(BASE_URL, data);
        return response.data.data;
    },

    approve: async (id: string): Promise<Resignation> => {
        const response = await api.patch(`${BASE_URL}/${id}/approve`);
        return response.data.data;
    },

    reject: async (id: string, reason: string): Promise<Resignation> => {
        const response = await api.patch(`${BASE_URL}/${id}/reject`, { reason });
        return response.data.data;
    }
};

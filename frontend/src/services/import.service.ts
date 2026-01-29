import axios from 'axios';
import { ImportPreviewResponse, ImportResultResponse } from '../types/import.types';

const API_Base_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const importService = {
    /**
     * Download template Excel
     */
    downloadTemplate: async () => {
        try {
            const response = await axios.get(`${API_Base_URL}/hr/import/template`, {
                responseType: 'blob',
                withCredentials: true
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Employee_Import_Template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading template:', error);
            throw error;
        }
    },

    /**
     * Upload and preview Excel file
     */
    uploadAndPreview: async (file: File): Promise<ImportPreviewResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post<ImportPreviewResponse>(
            `${API_Base_URL}/hr/import/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            }
        );

        return response.data;
    },

    /**
     * Confirm import
     */
    confirmImport: async (filePath: string): Promise<ImportResultResponse> => {
        const response = await axios.post<ImportResultResponse>(
            `${API_Base_URL}/hr/import/confirm`,
            { filePath },
            { withCredentials: true }
        );

        return response.data;
    }
};

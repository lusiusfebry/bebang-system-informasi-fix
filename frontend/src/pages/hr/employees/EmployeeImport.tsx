
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const EmployeeImport: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; errors?: any[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/hr/employees/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult({
                success: true,
                message: response.data.message || 'Import berhasil',
                errors: response.data.data?.errors || []
            });
        } catch (error: any) {
            setResult({
                success: false,
                message: error.response?.data?.message || 'Import gagal',
                errors: error.response?.data?.errors
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Import Karyawan</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Upload file Excel untuk import data karyawan secara massal
                    </p>
                </div>
                <button
                    onClick={() => navigate('/hr/employees')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span className="material-symbols-rounded mr-2 text-base">arrow_back</span>
                    Kembali
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            File Excel (.xlsx)
                        </label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
                            <div className="space-y-1 text-center">
                                <span className="material-symbols-rounded mx-auto h-12 w-12 text-gray-400 text-5xl">description</span>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    XLSX, XLS up to 10MB
                                </p>
                                {file && (
                                    <p className="text-sm text-green-600 font-medium flex items-center justify-center mt-2">
                                        <span className="material-symbols-rounded mr-1">check_circle</span>
                                        Selected: {file.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleImport}
                            disabled={!file || loading}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-rounded mr-2 text-base">upload</span>
                                    Import
                                </>
                            )}
                        </button>
                    </div>

                    {result && (
                        <div className={`rounded-md p-4 ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {result.success ? (
                                        <span className="material-symbols-rounded text-green-400">check_circle</span>
                                    ) : (
                                        <span className="material-symbols-rounded text-red-400">error</span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h3 className={`text-sm font-medium ${result.success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                                        {result.message}
                                    </h3>
                                    {result.errors && result.errors.length > 0 && (
                                        <div className={`mt-2 text-sm ${result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {result.errors.map((err: any, idx: number) => (
                                                    <li key={idx}>
                                                        Row {err.row}: {Array.isArray(err.errors) ? err.errors.join(', ') : err.error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default EmployeeImport;

/**
 * Employee Profile Header Component
 * Displays employee photo, basic info, and action buttons
 */

import React from 'react';
import { Employee, StatusMaster } from '../../types/employee.types';
import { EmployeeStatusBadge } from '../common/EmployeeStatusBadge';

interface EmployeeProfileHeaderProps {
    employee: Employee;
    onEdit?: () => void;
    onExportPDF?: () => void;
    onPrintIDCard?: () => void;
    exportLoading?: boolean;
    exportError?: string | null;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
    employee,
    onEdit,
    onExportPDF,
    onPrintIDCard,
    exportLoading = false,
    exportError,
}) => {
    const getPhotoUrl = () => {
        if (employee.fotoKaryawan) {
            // Handle relative path from backend
            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
            return `${baseUrl}/${employee.fotoKaryawan}`;
        }
        return null;
    };

    const photoUrl = getPhotoUrl();
    const status = employee.statusKaryawan?.namaStatus === 'Aktif' ? StatusMaster.AKTIF : StatusMaster.TIDAK_AKTIF;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo Section */}
                <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={employee.namaLengkap}
                                className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                                <span className="material-symbols-rounded text-5xl text-primary">person</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-4">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                            {employee.namaLengkap}
                        </h1>
                        <EmployeeStatusBadge status={status} size="md" />
                    </div>

                    <div className="space-y-2">
                        {/* NIK */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-rounded text-lg">fingerprint</span>
                            <span className="font-medium">{employee.nomorIndukKaryawan}</span>
                        </div>

                        {/* Divisi */}
                        {employee.divisi && (
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-rounded text-lg">hub</span>
                                <span>{employee.divisi.namaDivisi}</span>
                            </div>
                        )}

                        {/* Department */}
                        {employee.department && (
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-rounded text-lg">corporate_fare</span>
                                <span>{employee.department.namaDepartment}</span>
                            </div>
                        )}

                        {/* Position */}
                        {employee.posisiJabatan && (
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-rounded text-lg">work</span>
                                <span>{employee.posisiJabatan.namaPosisiJabatan}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:justify-start">
                    <button
                        onClick={onEdit}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-rounded text-lg">edit</span>
                        Edit Profil
                    </button>
                    <button
                        onClick={onExportPDF}
                        disabled={exportLoading}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${exportLoading
                            ? 'bg-primary/60 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-dark'
                            }`}
                    >
                        {exportLoading ? (
                            <>
                                <span className="material-symbols-rounded text-lg animate-spin">sync</span>
                                Mengekspor...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-rounded text-lg">file_download</span>
                                Ekspor PDF
                            </>
                        )}
                    </button>
                    <button
                        onClick={onPrintIDCard}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                    >
                        <span className="material-symbols-rounded text-lg">badge</span>
                        Cetak ID Card
                    </button>
                    {exportError && (
                        <p className="text-xs text-red-500 dark:text-red-400 text-center lg:text-left">
                            {exportError}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfileHeader;

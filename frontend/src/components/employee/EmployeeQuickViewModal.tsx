
import React, { useEffect, useState } from 'react';
import { Modal } from '../common';
import { Avatar } from '../common/Avatar';
import { employeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee.types';

interface EmployeeQuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string | null;
    onViewFullProfile: (id: string) => void;
}

export const EmployeeQuickViewModal: React.FC<EmployeeQuickViewModalProps> = ({
    isOpen,
    onClose,
    employeeId,
    onViewFullProfile
}) => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && employeeId) {
            fetchEmployee();
        } else {
            setEmployee(null);
        }
    }, [isOpen, employeeId]);

    const fetchEmployee = async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const response = await employeeService.getEmployeeById(employeeId);
            setEmployee(response);
        } catch (error) {
            console.error('Failed to fetch employee details', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ringkasan Data Karyawan"
            size="lg"
        >
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : employee ? (
                <div>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <Avatar
                                src={employee.fotoKaryawan}
                                name={employee.namaLengkap}
                                size="xl"
                                className="w-24 h-24 text-3xl"
                            />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{employee.namaLengkap}</h3>
                            <p className="text-sm text-gray-500 mb-2">{employee.nomorIndukKaryawan}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                <span className="px-2.5 py-1 text-sm rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                    {employee.statusKaryawan?.namaStatus || '-'}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                    {employee.divisi?.namaDivisi || '-'}
                                </span>
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                                    {employee.posisiJabatan?.namaPosisiJabatan || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email Perusahaan</span>
                            <span className="font-medium">{employee.emailPerusahaan || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nomor Handphone</span>
                            <span className="font-medium">{employee.nomorHandphone || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Department</span>
                            <span className="font-medium">{employee.department?.namaDepartment || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Lokasi Kerja</span>
                            <span className="font-medium">{employee.lokasiKerja?.namaLokasiKerja || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tanggal Masuk</span>
                            <span className="font-medium">
                                {employee.tanggalMasuk ? new Date(employee.tanggalMasuk).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                }) : '-'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tags</span>
                            <div className="flex flex-wrap gap-1">
                                {employee.tag ? (
                                    <span style={{ backgroundColor: employee.tag.warnaTag }} className="px-2 py-0.5 text-white text-[10px] rounded">
                                        {employee.tag.namaTag}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">Tidak ada tag</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => {
                                if (employeeId) onViewFullProfile(employeeId);
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                            <span>Lihat Detail Lengkap</span>
                            <span className="material-symbols-rounded text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Data karyawan tidak ditemukan
                </div>
            )}
        </Modal>
    );
};

/**
 * DepartmentFormModal Component
 * Form modal untuk create/edit Department
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../components/common';
import { TextInput, TextArea, Select } from '../../../../components/common/form';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput, StatusMaster, Divisi } from '../../../../types/hr-master.types';
import { divisiService } from '../../../../services/hr-master.service';

interface DepartmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDepartmentInput | UpdateDepartmentInput) => Promise<void>;
    department: Department | null;
    loading?: boolean;
}

const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
];

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    department,
    loading = false,
}) => {
    const isEditMode = department !== null;
    const [divisiList, setDivisiList] = useState<Divisi[]>([]);
    const [loadingDivisi, setLoadingDivisi] = useState(false);
    const [formData, setFormData] = useState({
        namaDepartment: '',
        namaManager: '',
        divisiId: '',
        keterangan: '',
        status: 'AKTIF' as StatusMaster,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch divisi list for dropdown
    useEffect(() => {
        const fetchDivisi = async () => {
            setLoadingDivisi(true);
            try {
                const response = await divisiService.getAll({ status: 'AKTIF', limit: 100 });
                if (response.success) {
                    setDivisiList(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch divisi:', error);
            } finally {
                setLoadingDivisi(false);
            }
        };
        if (isOpen) {
            fetchDivisi();
        }
    }, [isOpen]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (department) {
                setFormData({
                    namaDepartment: department.namaDepartment,
                    namaManager: department.namaManager || '',
                    divisiId: department.divisiId || '',
                    keterangan: department.keterangan || '',
                    status: department.status,
                });
            } else {
                setFormData({
                    namaDepartment: '',
                    namaManager: '',
                    divisiId: '',
                    keterangan: '',
                    status: 'AKTIF',
                });
            }
            setErrors({});
        }
    }, [isOpen, department]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.namaDepartment.trim()) {
            newErrors.namaDepartment = 'Nama Department wajib diisi';
        } else if (formData.namaDepartment.length < 2) {
            newErrors.namaDepartment = 'Nama Department minimal 2 karakter';
        }

        if (formData.keterangan && formData.keterangan.length > 500) {
            newErrors.keterangan = 'Keterangan maksimal 500 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data: CreateDepartmentInput | UpdateDepartmentInput = {
            namaDepartment: formData.namaDepartment.trim(),
            namaManager: formData.namaManager.trim() || undefined,
            divisiId: formData.divisiId || undefined,
            keterangan: formData.keterangan.trim() || undefined,
            status: formData.status,
        };

        await onSubmit(data);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const divisiOptions = divisiList.map((d) => ({ value: d.id, label: d.namaDivisi }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Department' : 'Tambah Department Baru'}
            size="lg"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                            bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                            rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="department-form"
                        disabled={loading || loadingDivisi}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                            rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                            inline-flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                    </button>
                </div>
            }
        >
            <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Nama Department"
                    value={formData.namaDepartment}
                    onChange={(e) => handleChange('namaDepartment', e.target.value)}
                    placeholder="Masukkan nama department"
                    required
                    error={errors.namaDepartment}
                    disabled={loading}
                />

                <Select
                    label="Divisi"
                    value={formData.divisiId}
                    onChange={(e) => handleChange('divisiId', e.target.value)}
                    options={divisiOptions}
                    placeholder={loadingDivisi ? 'Memuat...' : 'Pilih Divisi'}
                    disabled={loading || loadingDivisi}
                />

                <TextInput
                    label="Nama Manager"
                    value={formData.namaManager}
                    onChange={(e) => handleChange('namaManager', e.target.value)}
                    placeholder="Masukkan nama manager (opsional)"
                    disabled={loading}
                />

                <TextArea
                    label="Keterangan"
                    value={formData.keterangan}
                    onChange={(e) => handleChange('keterangan', e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    rows={3}
                    error={errors.keterangan}
                    disabled={loading}
                />

                <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    options={statusOptions}
                    required
                    disabled={loading}
                />
            </form>
        </Modal>
    );
};

export default DepartmentFormModal;

/**
 * PosisiJabatanFormModal Component
 * Form modal untuk create/edit Posisi Jabatan dengan department selection
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../components/common';
import { TextInput, TextArea, Select } from '../../../../components/common/form';
import type { PosisiJabatan, CreatePosisiJabatanInput, UpdatePosisiJabatanInput, StatusMaster, Department } from '../../../../types/hr-master.types';
import { departmentService } from '../../../../services/hr-master.service';

interface PosisiJabatanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePosisiJabatanInput | UpdatePosisiJabatanInput) => Promise<void>;
    posisiJabatan: PosisiJabatan | null;
    loading?: boolean;
}

const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
];

export const PosisiJabatanFormModal: React.FC<PosisiJabatanFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    posisiJabatan,
    loading = false,
}) => {
    const isEditMode = posisiJabatan !== null;
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [formData, setFormData] = useState({
        namaPosisiJabatan: '',
        departmentId: '',
        keterangan: '',
        status: 'AKTIF' as StatusMaster,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch departments for dropdown
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoadingDepartments(true);
            try {
                const response = await departmentService.getAll({ status: 'AKTIF', limit: 100 });
                if (response.success) {
                    setDepartmentList(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            } finally {
                setLoadingDepartments(false);
            }
        };
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (posisiJabatan) {
                setFormData({
                    namaPosisiJabatan: posisiJabatan.namaPosisiJabatan,
                    departmentId: posisiJabatan.departmentId || '',
                    keterangan: posisiJabatan.keterangan || '',
                    status: posisiJabatan.status,
                });
            } else {
                setFormData({
                    namaPosisiJabatan: '',
                    departmentId: '',
                    keterangan: '',
                    status: 'AKTIF',
                });
            }
            setErrors({});
        }
    }, [isOpen, posisiJabatan]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.namaPosisiJabatan.trim()) {
            newErrors.namaPosisiJabatan = 'Nama Posisi Jabatan wajib diisi';
        } else if (formData.namaPosisiJabatan.length < 2) {
            newErrors.namaPosisiJabatan = 'Nama Posisi Jabatan minimal 2 karakter';
        } else if (formData.namaPosisiJabatan.length > 100) {
            newErrors.namaPosisiJabatan = 'Nama Posisi Jabatan maksimal 100 karakter';
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

        const data: CreatePosisiJabatanInput | UpdatePosisiJabatanInput = {
            namaPosisiJabatan: formData.namaPosisiJabatan.trim(),
            departmentId: formData.departmentId || undefined,
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

    const departmentOptions = departmentList.map((d) => ({ value: d.id, label: d.namaDepartment }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Posisi Jabatan' : 'Tambah Posisi Jabatan Baru'}
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
                        form="posisi-jabatan-form"
                        disabled={loading || loadingDepartments}
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
            <form id="posisi-jabatan-form" onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Nama Posisi Jabatan"
                    value={formData.namaPosisiJabatan}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('namaPosisiJabatan', e.target.value)}
                    placeholder="Masukkan nama posisi jabatan"
                    required
                    error={errors.namaPosisiJabatan}
                    disabled={loading}
                />

                <Select
                    label="Department"
                    value={formData.departmentId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('departmentId', e.target.value)}
                    options={departmentOptions}
                    placeholder={loadingDepartments ? 'Memuat...' : 'Pilih Department (opsional)'}
                    disabled={loading || loadingDepartments}
                />

                <TextArea
                    label="Keterangan"
                    value={formData.keterangan}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('keterangan', e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    rows={3}
                    error={errors.keterangan}
                    disabled={loading}
                />

                <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('status', e.target.value)}
                    options={statusOptions}
                    required
                    disabled={loading}
                />
            </form>
        </Modal>
    );
};

export default PosisiJabatanFormModal;

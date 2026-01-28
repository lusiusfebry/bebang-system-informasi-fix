/**
 * DivisiFormModal Component
 * Form modal untuk create/edit Divisi
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../components/common';
import { TextInput, TextArea, Select } from '../../../../components/common/form';
import type { Divisi, CreateDivisiInput, UpdateDivisiInput, StatusMaster } from '../../../../types/hr-master.types';

interface DivisiFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDivisiInput | UpdateDivisiInput) => Promise<void>;
    divisi: Divisi | null; // null = create mode, object = edit mode
    loading?: boolean;
}

const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
];

export const DivisiFormModal: React.FC<DivisiFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    divisi,
    loading = false,
}) => {
    const isEditMode = divisi !== null;
    const [formData, setFormData] = useState({
        namaDivisi: '',
        keterangan: '',
        status: 'AKTIF' as StatusMaster,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or divisi changes
    useEffect(() => {
        if (isOpen) {
            if (divisi) {
                setFormData({
                    namaDivisi: divisi.namaDivisi,
                    keterangan: divisi.keterangan || '',
                    status: divisi.status,
                });
            } else {
                setFormData({
                    namaDivisi: '',
                    keterangan: '',
                    status: 'AKTIF',
                });
            }
            setErrors({});
        }
    }, [isOpen, divisi]);

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.namaDivisi.trim()) {
            newErrors.namaDivisi = 'Nama Divisi wajib diisi';
        } else if (formData.namaDivisi.length < 2) {
            newErrors.namaDivisi = 'Nama Divisi minimal 2 karakter';
        } else if (formData.namaDivisi.length > 100) {
            newErrors.namaDivisi = 'Nama Divisi maksimal 100 karakter';
        }

        if (formData.keterangan && formData.keterangan.length > 500) {
            newErrors.keterangan = 'Keterangan maksimal 500 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const data: CreateDivisiInput | UpdateDivisiInput = {
            namaDivisi: formData.namaDivisi.trim(),
            keterangan: formData.keterangan.trim() || undefined,
            status: formData.status,
        };

        await onSubmit(data);
    };

    // Handle input change
    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Divisi' : 'Tambah Divisi Baru'}
            size="md"
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
                        form="divisi-form"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                            rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                            inline-flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                    </button>
                </div>
            }
        >
            <form id="divisi-form" onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Nama Divisi"
                    value={formData.namaDivisi}
                    onChange={(e) => handleChange('namaDivisi', e.target.value)}
                    placeholder="Masukkan nama divisi"
                    required
                    error={errors.namaDivisi}
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

export default DivisiFormModal;

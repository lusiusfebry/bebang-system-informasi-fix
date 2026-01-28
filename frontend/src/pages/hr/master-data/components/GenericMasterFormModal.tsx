/**
 * GenericMasterFormModal Component
 * Form modal generik untuk master data sederhana (tanpa relasi)
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../components/common';
import { TextInput, TextArea, Select, ColorPicker } from '../../../../components/common/form';
import type { StatusMaster } from '../../../../types/hr-master.types';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'color';
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
}

interface GenericMasterFormModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    item: T | null;
    loading?: boolean;
    title: string;
    fields: FormField[];
}

const statusOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
];

export function GenericMasterFormModal<T extends { status?: StatusMaster }>({
    isOpen,
    onClose,
    onSubmit,
    item,
    loading = false,
    title,
    fields,
}: GenericMasterFormModalProps<T>) {
    const isEditMode = item !== null;
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<StatusMaster>('AKTIF');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            const initialData: Record<string, string> = {};
            fields.forEach((field) => {
                if (item) {
                    initialData[field.name] = String((item as Record<string, unknown>)[field.name] || '');
                } else {
                    initialData[field.name] = field.type === 'color' ? '#3B82F6' : '';
                }
            });
            setFormData(initialData);
            setStatus(item?.status || 'AKTIF');
            setErrors({});
        }
    }, [isOpen, item, fields]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach((field) => {
            const value = formData[field.name]?.trim() || '';

            if (field.required && !value) {
                newErrors[field.name] = `${field.label} wajib diisi`;
            } else if (value && field.minLength && value.length < field.minLength) {
                newErrors[field.name] = `${field.label} minimal ${field.minLength} karakter`;
            } else if (value && field.maxLength && value.length > field.maxLength) {
                newErrors[field.name] = `${field.label} maksimal ${field.maxLength} karakter`;
            }

            // Validate hex color
            if (field.type === 'color' && value && !/^#[0-9A-F]{6}$/i.test(value)) {
                newErrors[field.name] = 'Format warna harus #XXXXXX';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data: Record<string, unknown> = { status };
        fields.forEach((field) => {
            const value = formData[field.name]?.trim();
            if (value) {
                data[field.name] = value;
            }
        });

        await onSubmit(data);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <TextArea
                        key={field.name}
                        label={field.label}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        error={errors[field.name]}
                        disabled={loading}
                    />
                );
            case 'color':
                return (
                    <ColorPicker
                        key={field.name}
                        label={field.label}
                        value={formData[field.name] || '#3B82F6'}
                        onChange={(value) => handleChange(field.name, value)}
                        required={field.required}
                        error={errors[field.name]}
                        disabled={loading}
                    />
                );
            default:
                return (
                    <TextInput
                        key={field.name}
                        label={field.label}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        error={errors[field.name]}
                        disabled={loading}
                    />
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? `Edit ${title}` : `Tambah ${title} Baru`}
            size="md"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Batal
                    </button>
                    <button type="submit" form="generic-form" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2">
                        {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                    </button>
                </div>
            }
        >
            <form id="generic-form" onSubmit={handleSubmit} className="space-y-4">
                {fields.map(renderField)}
                <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as StatusMaster)} options={statusOptions} required disabled={loading} />
            </form>
        </Modal>
    );
}

export default GenericMasterFormModal;

/**
 * TagList Component - dengan ColorPicker
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { Tag } from '../../../types/hr-master.types';

const columns: TableColumn<Tag>[] = [
    { header: 'Nama Tag', accessor: 'namaTag' },
    {
        header: 'Warna Tag',
        accessor: 'warnaTag',
        render: (item) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: item.warnaTag }}
                />
                <span className="font-mono text-xs">{item.warnaTag}</span>
            </div>
        )
    },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaTag', label: 'Nama Tag', type: 'text' as const, required: true, placeholder: 'Masukkan nama tag', minLength: 1, maxLength: 50 },
    { name: 'warnaTag', label: 'Warna Tag', type: 'color' as const, required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const TagList: React.FC = () => (
    <GenericMasterList<Tag>
        entityType="tag"
        title="Tag"
        subtitle="Kelola data tag untuk kategorisasi"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaTag}
    />
);

export default TagList;

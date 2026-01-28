/**
 * GolonganList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { Golongan } from '../../../types/hr-master.types';

const columns: TableColumn<Golongan>[] = [
    { header: 'Nama Golongan', accessor: 'namaGolongan' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaGolongan', label: 'Nama Golongan', type: 'text' as const, required: true, placeholder: 'Masukkan nama golongan', minLength: 1, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const GolonganList: React.FC = () => (
    <GenericMasterList<Golongan>
        entityType="golongan"
        title="Golongan"
        subtitle="Kelola data golongan"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaGolongan}
    />
);

export default GolonganList;

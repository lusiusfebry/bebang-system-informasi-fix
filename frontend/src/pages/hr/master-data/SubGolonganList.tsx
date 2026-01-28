/**
 * SubGolonganList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { SubGolongan } from '../../../types/hr-master.types';

const columns: TableColumn<SubGolongan>[] = [
    { header: 'Nama Sub Golongan', accessor: 'namaSubGolongan' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaSubGolongan', label: 'Nama Sub Golongan', type: 'text' as const, required: true, placeholder: 'Masukkan nama sub golongan', minLength: 1, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const SubGolonganList: React.FC = () => (
    <GenericMasterList<SubGolongan>
        entityType="sub-golongan"
        title="Sub Golongan"
        subtitle="Kelola data sub golongan"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaSubGolongan}
    />
);

export default SubGolonganList;

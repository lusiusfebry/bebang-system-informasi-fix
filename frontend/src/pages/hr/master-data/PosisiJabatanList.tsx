/**
 * PosisiJabatanList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { PosisiJabatan } from '../../../types/hr-master.types';

const columns: TableColumn<PosisiJabatan>[] = [
    { header: 'Nama Posisi Jabatan', accessor: 'namaPosisiJabatan' },
    { header: 'Department', accessor: 'department.namaDepartment', render: (item) => item.department?.namaDepartment || '-' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaPosisiJabatan', label: 'Nama Posisi Jabatan', type: 'text' as const, required: true, placeholder: 'Masukkan nama posisi jabatan', minLength: 2, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const PosisiJabatanList: React.FC = () => (
    <GenericMasterList<PosisiJabatan>
        entityType="posisi-jabatan"
        title="Posisi Jabatan"
        subtitle="Kelola data posisi jabatan organisasi"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaPosisiJabatan}
    />
);

export default PosisiJabatanList;

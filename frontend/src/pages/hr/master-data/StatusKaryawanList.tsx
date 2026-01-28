/**
 * StatusKaryawanList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { StatusKaryawan } from '../../../types/hr-master.types';

const columns: TableColumn<StatusKaryawan>[] = [
    { header: 'Nama Status', accessor: 'namaStatus' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaStatus', label: 'Nama Status', type: 'text' as const, required: true, placeholder: 'Masukkan nama status', minLength: 2, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const StatusKaryawanList: React.FC = () => (
    <GenericMasterList<StatusKaryawan>
        entityType="status-karyawan"
        title="Status Karyawan"
        subtitle="Kelola data status karyawan"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaStatus}
    />
);

export default StatusKaryawanList;

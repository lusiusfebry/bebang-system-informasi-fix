/**
 * LokasiKerjaList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { LokasiKerja } from '../../../types/hr-master.types';

const columns: TableColumn<LokasiKerja>[] = [
    { header: 'Nama Lokasi Kerja', accessor: 'namaLokasiKerja' },
    { header: 'Alamat', accessor: 'alamat', render: (item) => item.alamat || '-' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaLokasiKerja', label: 'Nama Lokasi Kerja', type: 'text' as const, required: true, placeholder: 'Masukkan nama lokasi kerja', minLength: 2, maxLength: 100 },
    { name: 'alamat', label: 'Alamat', type: 'textarea' as const, required: true, placeholder: 'Masukkan alamat lengkap', maxLength: 500 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const LokasiKerjaList: React.FC = () => (
    <GenericMasterList<LokasiKerja>
        entityType="lokasi-kerja"
        title="Lokasi Kerja"
        subtitle="Kelola data lokasi kerja"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaLokasiKerja}
    />
);

export default LokasiKerjaList;

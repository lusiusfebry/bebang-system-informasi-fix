/**
 * KategoriPangkatList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { KategoriPangkat } from '../../../types/hr-master.types';

const columns: TableColumn<KategoriPangkat>[] = [
    { header: 'Nama Kategori Pangkat', accessor: 'namaKategoriPangkat' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaKategoriPangkat', label: 'Nama Kategori Pangkat', type: 'text' as const, required: true, placeholder: 'Masukkan nama kategori pangkat', minLength: 2, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const KategoriPangkatList: React.FC = () => (
    <GenericMasterList<KategoriPangkat>
        entityType="kategori-pangkat"
        title="Kategori Pangkat"
        subtitle="Kelola data kategori pangkat"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaKategoriPangkat}
    />
);

export default KategoriPangkatList;

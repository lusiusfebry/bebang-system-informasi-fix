/**
 * JenisHubunganKerjaList Component
 */

import React from 'react';
import { GenericMasterList } from './GenericMasterList';
import type { TableColumn } from '../../../components/common';
import type { JenisHubunganKerja } from '../../../types/hr-master.types';

const columns: TableColumn<JenisHubunganKerja>[] = [
    { header: 'Nama Jenis Hubungan Kerja', accessor: 'namaJenisHubunganKerja' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

const formFields = [
    { name: 'namaJenisHubunganKerja', label: 'Nama Jenis Hubungan Kerja', type: 'text' as const, required: true, placeholder: 'Masukkan nama jenis hubungan kerja', minLength: 2, maxLength: 100 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Masukkan keterangan (opsional)', maxLength: 500 },
];

export const JenisHubunganKerjaList: React.FC = () => (
    <GenericMasterList<JenisHubunganKerja>
        entityType="jenis-hubungan-kerja"
        title="Jenis Hubungan Kerja"
        subtitle="Kelola data jenis hubungan kerja"
        columns={columns}
        formFields={formFields}
        getItemName={(item) => item.namaJenisHubunganKerja}
    />
);

export default JenisHubunganKerjaList;

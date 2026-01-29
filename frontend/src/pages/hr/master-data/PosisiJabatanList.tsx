/**
 * PosisiJabatanList Component - dengan dedicated form modal untuk department selection
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DataTable,
    SearchFilter,
    Pagination,
    DeleteConfirmDialog,
    useToast,
} from '../../../components/common';
import type { TableColumn } from '../../../components/common';
import { useHRMasterData } from '../../../hooks/useHRMasterData';
import PosisiJabatanFormModal from './components/PosisiJabatanFormModal';
import { useAuth } from '../../../contexts/AuthContext';
import { PERMISSIONS } from '../../../constants/permissions';
import type {
    PosisiJabatan,
    StatusMaster,
    CreatePosisiJabatanInput,
    UpdatePosisiJabatanInput,
} from '../../../types/hr-master.types';

const columns: TableColumn<PosisiJabatan>[] = [
    { header: 'Nama Posisi Jabatan', accessor: 'namaPosisiJabatan', sortable: true },
    { header: 'Department', accessor: 'department.namaDepartment', render: (item) => item.department?.namaDepartment || '-' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

export const PosisiJabatanList: React.FC = () => {
    const { user } = useAuth();

    // Permissions
    const canCreate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_CREATE);
    const canUpdate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_UPDATE);
    const canDelete = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_DELETE);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusMaster | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PosisiJabatan | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { data, loading, meta, fetchData, createItem, updateItem, deleteItem } =
        useHRMasterData<PosisiJabatan>('posisi-jabatan', { autoFetch: false });

    useEffect(() => {
        fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
    }, [currentPage, limit, searchTerm, statusFilter, fetchData]);

    const handleSearch = useCallback((search: string) => { setSearchTerm(search); setCurrentPage(1); }, []);
    const handleStatusFilter = useCallback((status: StatusMaster | '') => { setStatusFilter(status); setCurrentPage(1); }, []);
    const handlePageChange = useCallback((page: number) => { setCurrentPage(page); }, []);
    const handleLimitChange = useCallback((newLimit: number) => { setLimit(newLimit); setCurrentPage(1); }, []);

    const handleCreate = () => { setSelectedItem(null); setIsFormModalOpen(true); };
    const handleEdit = (item: PosisiJabatan) => { setSelectedItem(item); setIsFormModalOpen(true); };
    const handleDelete = (item: PosisiJabatan) => { setSelectedItem(item); setIsDeleteDialogOpen(true); };
    const handleCloseFormModal = () => { setIsFormModalOpen(false); setSelectedItem(null); };
    const handleCloseDeleteDialog = () => { setIsDeleteDialogOpen(false); setSelectedItem(null); };

    const handleFormSubmit = async (formData: CreatePosisiJabatanInput | UpdatePosisiJabatanInput) => {
        setSubmitting(true);
        try {
            if (selectedItem) {
                const result = await updateItem(selectedItem.id, formData);
                if (result) {
                    showToast('Posisi Jabatan berhasil diperbarui', 'success');
                    handleCloseFormModal();
                    fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
                } else {
                    showToast('Gagal memperbarui posisi jabatan', 'error');
                }
            } else {
                const result = await createItem(formData);
                if (result) {
                    showToast('Posisi Jabatan berhasil ditambahkan', 'success');
                    handleCloseFormModal();
                    fetchData({ page: 1, limit });
                    setCurrentPage(1);
                    setSearchTerm('');
                    setStatusFilter('');
                } else {
                    showToast('Gagal menambahkan posisi jabatan', 'error');
                }
            }
        } catch {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            const success = await deleteItem(selectedItem.id);
            if (success) {
                showToast('Posisi Jabatan berhasil dihapus', 'success');
                handleCloseDeleteDialog();
                fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
            } else {
                showToast('Gagal menghapus posisi jabatan', 'error');
            }
        } catch {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                <ol className="flex items-center gap-2">
                    <li><button onClick={() => navigate('/hr')} className="hover:text-blue-600 dark:hover:text-blue-400">Master Data</button></li>
                    <li>/</li>
                    <li className="text-gray-900 dark:text-white font-medium">Posisi Jabatan</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Posisi Jabatan</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola data posisi jabatan organisasi</p>
                </div>
                {canCreate && (
<button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah Posisi Jabatan
                </button>
                )}
            </div>

            <div className="mb-4">
                <SearchFilter onSearch={handleSearch} onFilterStatus={handleStatusFilter} placeholder="Cari posisi jabatan..." initialSearch={searchTerm} initialStatus={statusFilter} />
            </div>

            <DataTable columns={columns} data={data} loading={loading} keyExtractor={(item) => item.id} onEdit={canUpdate ? handleEdit : undefined} onDelete={canDelete ? handleDelete : undefined} emptyMessage="Tidak ada data posisi jabatan" />

            {meta && meta.totalPages > 0 && (
                <Pagination currentPage={currentPage} totalPages={meta.totalPages} totalItems={meta.total} itemsPerPage={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}

            <PosisiJabatanFormModal isOpen={isFormModalOpen} onClose={handleCloseFormModal} onSubmit={handleFormSubmit} posisiJabatan={selectedItem} loading={submitting} />
            <DeleteConfirmDialog isOpen={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} itemName={selectedItem?.namaPosisiJabatan || ''} loading={submitting} />
        </div>
    );
};

export default PosisiJabatanList;

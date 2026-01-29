/**
 * DepartmentList Component
 * Halaman daftar Department dengan CRUD functionality
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
import DepartmentFormModal from './components/DepartmentFormModal';
import { useAuth } from '../../../contexts/AuthContext';
import { PERMISSIONS } from '../../../constants/permissions';
import type {
    Department,
    StatusMaster,
    CreateDepartmentInput,
    UpdateDepartmentInput,
} from '../../../types/hr-master.types';

const columns: TableColumn<Department>[] = [
    { header: 'Nama Department', accessor: 'namaDepartment' },
    { header: 'Divisi', accessor: 'divisi.namaDivisi', render: (item) => item.divisi?.namaDivisi || '-' },
    { header: 'Manager', accessor: 'namaManager', render: (item) => item.namaManager || '-' },
    { header: 'Keterangan', accessor: 'keterangan', render: (item) => item.keterangan || '-' },
    { header: 'Status', accessor: 'status' },
];

export const DepartmentList: React.FC = () => {
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
    const [selectedItem, setSelectedItem] = useState<Department | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { data, loading, meta, fetchData, createItem, updateItem, deleteItem } =
        useHRMasterData<Department>('department', { autoFetch: false });

    useEffect(() => {
        fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
    }, [currentPage, limit, searchTerm, statusFilter, fetchData]);

    const handleSearch = useCallback((search: string) => { setSearchTerm(search); setCurrentPage(1); }, []);
    const handleStatusFilter = useCallback((status: StatusMaster | '') => { setStatusFilter(status); setCurrentPage(1); }, []);
    const handlePageChange = useCallback((page: number) => { setCurrentPage(page); }, []);
    const handleLimitChange = useCallback((newLimit: number) => { setLimit(newLimit); setCurrentPage(1); }, []);

    const handleCreate = () => { setSelectedItem(null); setIsFormModalOpen(true); };
    const handleEdit = (item: Department) => { setSelectedItem(item); setIsFormModalOpen(true); };
    const handleDelete = (item: Department) => { setSelectedItem(item); setIsDeleteDialogOpen(true); };
    const handleCloseFormModal = () => { setIsFormModalOpen(false); setSelectedItem(null); };
    const handleCloseDeleteDialog = () => { setIsDeleteDialogOpen(false); setSelectedItem(null); };

    const handleFormSubmit = async (formData: CreateDepartmentInput | UpdateDepartmentInput) => {
        setSubmitting(true);
        try {
            if (selectedItem) {
                const result = await updateItem(selectedItem.id, formData);
                if (result) { showToast('Department berhasil diperbarui', 'success'); handleCloseFormModal(); fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined }); }
                else showToast('Gagal memperbarui department', 'error');
            } else {
                const result = await createItem(formData);
                if (result) { showToast('Department berhasil ditambahkan', 'success'); handleCloseFormModal(); fetchData({ page: 1, limit }); setCurrentPage(1); setSearchTerm(''); setStatusFilter(''); }
                else showToast('Gagal menambahkan department', 'error');
            }
        } catch { showToast('Terjadi kesalahan', 'error'); }
        finally { setSubmitting(false); }
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            const success = await deleteItem(selectedItem.id);
            if (success) { showToast('Department berhasil dihapus', 'success'); handleCloseDeleteDialog(); fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined }); }
            else showToast('Gagal menghapus department', 'error');
        } catch { showToast('Terjadi kesalahan', 'error'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="p-6">
            <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                <ol className="flex items-center gap-2">
                    <li><button onClick={() => navigate('/hr')} className="hover:text-blue-600 dark:hover:text-blue-400">Master Data</button></li>
                    <li>/</li>
                    <li className="text-gray-900 dark:text-white font-medium">Department</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Department</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola data department organisasi</p>
                </div>
                {canCreate && (
<button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah Department
                </button>
                )}
            </div>

            <div className="mb-4">
                <SearchFilter onSearch={handleSearch} onFilterStatus={handleStatusFilter} placeholder="Cari department..." initialSearch={searchTerm} initialStatus={statusFilter} />
            </div>

            <DataTable columns={columns} data={data} loading={loading} keyExtractor={(item) => item.id} onEdit={canUpdate ? handleEdit : undefined} onDelete={canDelete ? handleDelete : undefined} emptyMessage="Tidak ada data department" />

            {meta && meta.totalPages > 0 && (
                <Pagination currentPage={currentPage} totalPages={meta.totalPages} totalItems={meta.total} itemsPerPage={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}

            <DepartmentFormModal isOpen={isFormModalOpen} onClose={handleCloseFormModal} onSubmit={handleFormSubmit} department={selectedItem} loading={submitting} />
            <DeleteConfirmDialog isOpen={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} itemName={selectedItem?.namaDepartment || ''} loading={submitting} />
        </div>
    );
};

export default DepartmentList;

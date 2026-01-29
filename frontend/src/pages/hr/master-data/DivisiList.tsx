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
import { useAuth } from '../../../contexts/AuthContext';
import { PERMISSIONS } from '../../../constants/permissions';
import DivisiFormModal from './components/DivisiFormModal';
import type {
    Divisi,
    StatusMaster,
    CreateDivisiInput,
    UpdateDivisiInput,
} from '../../../types/hr-master.types';

// Table columns definition
const columns: TableColumn<Divisi>[] = [
    {
        header: 'Nama Divisi',
        accessor: 'namaDivisi',
    },
    {
        header: 'Keterangan',
        accessor: 'keterangan',
        render: (item) => item.keterangan || '-',
    },
    {
        header: 'Status',
        accessor: 'status',
    },
];

export const DivisiList: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Permissions
    const canCreate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_CREATE);
    const canUpdate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_UPDATE);
    const canDelete = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_DELETE);

    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusMaster | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDivisi, setSelectedDivisi] = useState<Divisi | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Data fetching
    const {
        data: divisiList,
        loading,
        meta,
        fetchData,
        createItem,
        updateItem,
        deleteItem,
    } = useHRMasterData<Divisi>('divisi', { autoFetch: false });

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchData({
            page: currentPage,
            limit,
            search: searchTerm || undefined,
            status: statusFilter || undefined,
        });
    }, [currentPage, limit, searchTerm, statusFilter, fetchData]);

    // Handle search
    const handleSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page
    }, []);

    // Handle status filter
    const handleStatusFilter = useCallback((status: StatusMaster | '') => {
        setStatusFilter(status);
        setCurrentPage(1);
    }, []);

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Handle limit change
    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1);
    }, []);

    // Open form modal for create
    const handleCreate = () => {
        setSelectedDivisi(null);
        setIsFormModalOpen(true);
    };

    // Open form modal for edit
    const handleEdit = (divisi: Divisi) => {
        setSelectedDivisi(divisi);
        setIsFormModalOpen(true);
    };

    // Open delete confirmation
    const handleDelete = (divisi: Divisi) => {
        setSelectedDivisi(divisi);
        setIsDeleteDialogOpen(true);
    };

    // Close form modal
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedDivisi(null);
    };

    // Close delete dialog
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedDivisi(null);
    };

    // Submit form (create/update)
    const handleFormSubmit = async (data: CreateDivisiInput | UpdateDivisiInput) => {
        setSubmitting(true);
        try {
            if (selectedDivisi) {
                // Update
                const result = await updateItem(selectedDivisi.id, data);
                if (result) {
                    showToast('Divisi berhasil diperbarui', 'success');
                    handleCloseFormModal();
                    fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
                } else {
                    showToast('Gagal memperbarui divisi', 'error');
                }
            } else {
                // Create
                const result = await createItem(data);
                if (result) {
                    showToast('Divisi berhasil ditambahkan', 'success');
                    handleCloseFormModal();
                    fetchData({ page: 1, limit });
                    setCurrentPage(1);
                    setSearchTerm('');
                    setStatusFilter('');
                } else {
                    showToast('Gagal menambahkan divisi', 'error');
                }
            }
        } catch {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!selectedDivisi) return;

        setSubmitting(true);
        try {
            const success = await deleteItem(selectedDivisi.id);
            if (success) {
                showToast('Divisi berhasil dihapus', 'success');
                handleCloseDeleteDialog();
                fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined });
            } else {
                showToast('Gagal menghapus divisi', 'error');
            }
        } catch {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                <ol className="flex items-center gap-2">
                    <li>
                        <button
                            onClick={() => navigate('/hr')}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Master Data
                        </button>
                    </li>
                    <li>/</li>
                    <li className="text-gray-900 dark:text-white font-medium">Divisi</li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Daftar Divisi
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola data divisi organisasi
                    </p>
                </div>
                {canCreate && (
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white 
                            bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 
                            transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Divisi
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="mb-4">
                <SearchFilter
                    onSearch={handleSearch}
                    onFilterStatus={handleStatusFilter}
                    placeholder="Cari divisi..."
                    initialSearch={searchTerm}
                    initialStatus={statusFilter}
                />
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={divisiList}
                loading={loading}
                keyExtractor={(item) => item.id}
                onEdit={canUpdate ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                emptyMessage="Tidak ada data divisi"
            />

            {/* Pagination */}
            {meta && meta.totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    totalItems={meta.total}
                    itemsPerPage={limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            )}

            {/* Form Modal */}
            <DivisiFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                divisi={selectedDivisi}
                loading={submitting}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={selectedDivisi?.namaDivisi || ''}
                loading={submitting}
            />
        </div>
    );
};

export default DivisiList;

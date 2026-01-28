/**
 * GenericMasterList Component
 * Halaman list generik untuk master data sederhana dengan sorting support
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, SearchFilter, Pagination, DeleteConfirmDialog, useToast } from '../../../components/common';
import type { TableColumn, SortState } from '../../../components/common';
import { useHRMasterData } from '../../../hooks/useHRMasterData';
import { GenericMasterFormModal } from './components/GenericMasterFormModal';
import type { HRMasterEntityType, StatusMaster, HRMasterData } from '../../../types/hr-master.types';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'color';
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
}

interface GenericMasterListProps<T> {
    entityType: HRMasterEntityType;
    title: string;
    subtitle: string;
    columns: TableColumn<T>[];
    formFields: FormField[];
    getItemName: (item: T) => string;
}

export function GenericMasterList<T extends HRMasterData>({
    entityType,
    title,
    subtitle,
    columns,
    formFields,
    getItemName,
}: GenericMasterListProps<T>) {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusMaster | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Sorting state
    const [sortState, setSortState] = useState<SortState | undefined>(undefined);

    const { data, loading, meta, fetchData, createItem, updateItem, deleteItem } =
        useHRMasterData<T>(entityType, { autoFetch: false });

    // Build sort string for API (e.g., "namaDivisi:asc" or "createdAt:desc")
    const buildSortString = (sort?: SortState): string | undefined => {
        if (!sort) return undefined;
        return `${sort.key}:${sort.direction}`;
    };

    useEffect(() => {
        fetchData({
            page: currentPage,
            limit,
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            sort: buildSortString(sortState),
        });
    }, [currentPage, limit, searchTerm, statusFilter, sortState, fetchData]);

    const handleSearch = useCallback((search: string) => { setSearchTerm(search); setCurrentPage(1); }, []);
    const handleStatusFilter = useCallback((status: StatusMaster | '') => { setStatusFilter(status); setCurrentPage(1); }, []);
    const handlePageChange = useCallback((page: number) => { setCurrentPage(page); }, []);
    const handleLimitChange = useCallback((newLimit: number) => { setLimit(newLimit); setCurrentPage(1); }, []);

    // Handle sort change
    const handleSort = useCallback((sort: SortState) => {
        setSortState(sort);
        setCurrentPage(1); // Reset to first page when sorting changes
    }, []);

    const handleCreate = () => { setSelectedItem(null); setIsFormModalOpen(true); };
    const handleEdit = (item: T) => { setSelectedItem(item); setIsFormModalOpen(true); };
    const handleDelete = (item: T) => { setSelectedItem(item); setIsDeleteDialogOpen(true); };
    const handleCloseFormModal = () => { setIsFormModalOpen(false); setSelectedItem(null); };
    const handleCloseDeleteDialog = () => { setIsDeleteDialogOpen(false); setSelectedItem(null); };

    const handleFormSubmit = async (formData: Record<string, unknown>) => {
        setSubmitting(true);
        try {
            if (selectedItem) {
                const result = await updateItem(selectedItem.id, formData);
                if (result) {
                    showToast(`${title} berhasil diperbarui`, 'success');
                    handleCloseFormModal();
                    fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined, sort: buildSortString(sortState) });
                } else {
                    showToast(`Gagal memperbarui ${title.toLowerCase()}`, 'error');
                }
            } else {
                const result = await createItem(formData);
                if (result) {
                    showToast(`${title} berhasil ditambahkan`, 'success');
                    handleCloseFormModal();
                    fetchData({ page: 1, limit });
                    setCurrentPage(1);
                    setSearchTerm('');
                    setStatusFilter('');
                    setSortState(undefined);
                } else {
                    showToast(`Gagal menambahkan ${title.toLowerCase()}`, 'error');
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
                showToast(`${title} berhasil dihapus`, 'success');
                handleCloseDeleteDialog();
                fetchData({ page: currentPage, limit, search: searchTerm || undefined, status: statusFilter || undefined, sort: buildSortString(sortState) });
            } else {
                showToast(`Gagal menghapus ${title.toLowerCase()}`, 'error');
            }
        } catch {
            showToast('Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Format entity type for breadcrumb display
    const breadcrumbLabel = title;

    return (
        <div className="p-6">
            <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                <ol className="flex items-center gap-2">
                    <li><button onClick={() => navigate('/hr')} className="hover:text-blue-600 dark:hover:text-blue-400">Master Data</button></li>
                    <li>/</li>
                    <li className="text-gray-900 dark:text-white font-medium">{breadcrumbLabel}</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar {title}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
                <button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah {title}
                </button>
            </div>

            <div className="mb-4">
                <SearchFilter onSearch={handleSearch} onFilterStatus={handleStatusFilter} placeholder={`Cari ${title.toLowerCase()}...`} initialSearch={searchTerm} initialStatus={statusFilter} />
            </div>

            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                keyExtractor={(item) => item.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage={`Tidak ada data ${title.toLowerCase()}`}
                sortState={sortState}
                onSort={handleSort}
            />

            {meta && meta.totalPages > 0 && (
                <Pagination currentPage={currentPage} totalPages={meta.totalPages} totalItems={meta.total} itemsPerPage={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}

            <GenericMasterFormModal isOpen={isFormModalOpen} onClose={handleCloseFormModal} onSubmit={handleFormSubmit} item={selectedItem} loading={submitting} title={title} fields={formFields} />
            <DeleteConfirmDialog isOpen={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} itemName={selectedItem ? getItemName(selectedItem) : ''} loading={submitting} />
        </div>
    );
}

export default GenericMasterList;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DataTable,
    Pagination,
    TableColumn,
    SortState,
    Avatar,
    DeleteConfirmDialog,
    useToast
} from '../../../components/common';
import { EmployeeAdvancedFilter } from '../../../components/employee/EmployeeAdvancedFilter';
import { EmployeeQuickViewModal } from '../../../components/employee/EmployeeQuickViewModal';
import { BulkQRCodeGenerator } from '../../../components/employee';
import { employeeService } from '../../../services/employee.service';
import { Employee, EmployeeFilterState } from '../../../types/employee.types';
import { PermissionGuard } from '../../../components/auth/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';

const EmployeeList: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // State
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortState, setSortState] = useState<SortState>({ key: 'namaLengkap', direction: 'asc' });
    const [filters, setFilters] = useState<EmployeeFilterState>({
        search: '',
        divisiId: '',
        departmentId: '',
        statusKaryawanId: '',
        tagId: '',
        lokasiKerjaId: ''
    });

    // Selection & Actions
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [quickViewId, setQuickViewId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isBulkQROpen, setIsBulkQROpen] = useState(false);

    // Fetch Data
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                sortBy: sortState.key as any,
                sortOrder: sortState.direction,
                ...filters
            };
            const response = await employeeService.getEmployees(params);

            // Handle response data correctly based on service return type
            if (response.success && response.meta) {
                setEmployees(response.data.map(item => ({ ...item } as Employee)));
                setTotal(response.meta.total);
                setTotalPages(response.meta.totalPages);
            } else {
                setEmployees([]);
                setTotal(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            showToast('Gagal memuat data karyawan', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, limit, sortState, filters]);

    // Handlers
    const handleFilterChange = (newFilters: EmployeeFilterState) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page
        setSelectedIds(new Set()); // Reset selection
    };

    const handleSort = (sort: SortState) => {
        setSortState(sort);
    };

    const handleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = employees.map(e => e.id);
            setSelectedIds(new Set(allIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDelete = async () => {
        try {
            await employeeService.bulkDeleteEmployees(Array.from(selectedIds));
            showToast(`${selectedIds.size} karyawan berhasil dihapus`, 'success');
            setIsBulkConfirmOpen(false);
            setSelectedIds(new Set());
            fetchEmployees();
        } catch (error) {
            console.error('Bulk delete error:', error);
            showToast('Gagal menghapus karyawan terpilih', 'error');
        }
    };

    const handleDeleteOne = async () => {
        if (!deleteId) return;
        try {
            await employeeService.deleteEmployee(deleteId);
            showToast('Karyawan berhasil dihapus', 'success');
            setDeleteId(null);
            fetchEmployees();
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Gagal menghapus karyawan', 'error');
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const blob = await employeeService.exportEmployeesCSV(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `karyawan-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Data karyawan berhasil diexport', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('Gagal export data', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // Columns Definition
    const columns: TableColumn<Employee>[] = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={employees.length > 0 && selectedIds.size === employees.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                />
            ),
            accessor: 'id',
            className: 'w-10 text-center',
            render: (emp) => (
                <input
                    type="checkbox"
                    checked={selectedIds.has(emp.id)}
                    onChange={() => handleSelectOne(emp.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                />
            )
        },
        {
            header: 'Karyawan',
            accessor: 'namaLengkap',
            sortable: true,
            render: (emp) => (
                <div className="flex items-center gap-3">
                    <Avatar src={emp.fotoKaryawan || undefined} name={emp.namaLengkap} size="md" />
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">{emp.namaLengkap}</div>
                        <div className="text-xs text-gray-500">{emp.nomorIndukKaryawan}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Posisi & Divisi',
            accessor: 'posisiJabatan.namaPosisiJabatan',
            render: (emp) => (
                <div>
                    <div className="text-sm text-gray-900 dark:text-white">{emp.posisiJabatan?.namaPosisiJabatan || '-'}</div>
                    <div className="text-xs text-gray-500">{emp.divisi?.namaDivisi || '-'}</div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'statusKaryawan.namaStatus',
            render: (emp) => (
                <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {emp.statusKaryawan?.namaStatus || '-'}
                </span>
            )
        },
        {
            header: 'Lokasi',
            accessor: 'lokasiKerja.namaLokasiKerja',
            render: (emp) => emp.lokasiKerja?.namaLokasiKerja || '-'
        },
        {
            header: 'Aksi',
            accessor: 'id',
            className: 'text-right',
            render: (emp) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setQuickViewId(emp.id)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Quick View"
                    >
                        <span className="material-symbols-rounded">visibility</span>
                    </button>

                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_UPDATE}>
                        <button
                            onClick={() => navigate(`/hr/employees/${emp.id}`)}
                            className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                            title="Edit Details"
                        >
                            <span className="material-symbols-rounded">edit_square</span>
                        </button>
                    </PermissionGuard>

                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
                        <button
                            onClick={() => setDeleteId(emp.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Hapus"
                        >
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    </PermissionGuard>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Karyawan</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola data seluruh karyawan perusahaan</p>
                </div>
                <div className="flex gap-2">
                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_CREATE}>
                        <button
                            onClick={() => navigate('/hr/employees/create')}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                            Tambah Karyawan
                        </button>
                    </PermissionGuard>

                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_IMPORT}>
                        <button
                            onClick={() => navigate('/hr/employees/import')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-rounded">upload</span>
                            Import Excel
                        </button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Filters */}
            <EmployeeAdvancedFilter
                onFilterChange={handleFilterChange}
                initialFilters={filters}
            />

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-sm font-medium">
                            {selectedIds.size}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">karyawan terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Batal
                        </button>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE_EXPORT}>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1"
                            >
                                {isExporting ? (
                                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span className="material-symbols-rounded text-base">download</span>
                                )}
                                Export CSV
                            </button>
                        </PermissionGuard>

                        <button
                            onClick={() => setIsBulkQROpen(true)}
                            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1"
                        >
                            <span className="material-symbols-rounded text-base">qr_code_2</span>
                            Generate QR
                        </button>

                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
                            <button
                                onClick={() => setIsBulkConfirmOpen(true)}
                                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 rounded flex items-center gap-1"
                            >
                                <span className="material-symbols-rounded text-base">delete</span>
                                Hapus
                            </button>
                        </PermissionGuard>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={employees}
                    loading={loading}
                    emptyMessage="Tidak ada data karyawan yang sesuai filter"
                    onSort={handleSort}
                    sortState={sortState}
                    keyExtractor={(item) => item.id}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    itemsPerPage={limit}
                    totalItems={total}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            </div>

            {/* Modals */}
            <EmployeeQuickViewModal
                isOpen={!!quickViewId}
                employeeId={quickViewId}
                onClose={() => setQuickViewId(null)}
                onViewFullProfile={(id) => {
                    navigate(`/hr/employees/${id}`);
                    setQuickViewId(null);
                }}
            />

            <DeleteConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteOne}
                title="Hapus Karyawan"
                message="Apakah Anda yakin ingin menghapus data karyawan ini? Data yang dihapus tidak dapat dikembalikan."
            />

            <DeleteConfirmDialog
                isOpen={isBulkConfirmOpen}
                onClose={() => setIsBulkConfirmOpen(false)}
                onConfirm={handleBulkDelete}
                title={`Hapus ${selectedIds.size} Karyawan`}
                message={`Apakah Anda yakin ingin menghapus ${selectedIds.size} karyawan yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus Semua"
                confirmVariant="danger"
            />

            {
                isBulkQROpen && (
                    <BulkQRCodeGenerator
                        selectedEmployeeIds={Array.from(selectedIds)}
                        onClose={() => setIsBulkQROpen(false)}
                        onSuccess={() => setSelectedIds(new Set())}
                    />
                )
            }
        </div >
    );
};

export default EmployeeList;

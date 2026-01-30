
import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../../constants/permissions';
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { userService, SimpleUser, UserFilterState } from '../../services/user.service';
import { roleService, Role } from '../../services/role.service';
import { DataTable, Pagination, SearchFilter, useToast, TableColumn } from '../../components/common';

const UserManagement: React.FC = () => {
    // const { user: currentUser } = useAuth(); // rename to avoid conflict
    const { showToast } = useToast();

    // Permissions
    // const canUpdateRole = currentUser?.roleCode === 'ADMIN' || currentUser?.permissions?.includes(PERMISSIONS.USER_UPDATE);

    // States
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<UserFilterState>({});

    // Role Assignment Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch Users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
                page,
                limit,
                search: filters.search,
                roleId: filters.roleId
            });
            if (response.success && response.data) {
                setUsers(response.data);
                setTotal(response.meta.total);
                setTotalPages(response.meta.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Gagal memuat data pengguna', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, limit, filters, showToast]);

    // Fetch Roles (for filter and assignment)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRoles();
                if (response.success) {
                    setRoles(response.data);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handlers
    const handleSearch = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setPage(1);
    }, []);

    const handleAssignRole = (user: SimpleUser) => {
        setSelectedUser(user);
        setSelectedRoleId(user.role?.id || '');
        setIsAssignModalOpen(true);
    };

    const submitAssignRole = async () => {
        if (!selectedUser || !selectedRoleId) return;
        setSubmitting(true);
        try {
            await userService.assignRole(selectedUser.id, selectedRoleId);
            showToast('Role berhasil diperbarui', 'success');
            setIsAssignModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error assigning role:', error);
            showToast('Gagal memperbarui role', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Columns
    const columns: TableColumn<SimpleUser>[] = [
        { header: 'Nama Lengkap', accessor: 'fullName' },
        { header: 'Email', accessor: 'email', render: (u) => u.email || '-' },
        {
            header: 'Role',
            accessor: 'role.name',
            render: (u) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${u.role?.code === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        u.role?.code === 'HR_MANAGER' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'}`}>
                    {u.role?.name || 'No Role'}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (u) => (
                <span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Aksi',
            accessor: 'id',
            className: 'text-right',
            render: (u) => (
                <div className="flex justify-end">
                    <PermissionGuard permission={PERMISSIONS.USER_UPDATE}>
                        <button
                            onClick={() => handleAssignRole(u)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Ubah Role
                        </button>
                    </PermissionGuard>
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pengguna</h1>
                <p className="text-gray-500 dark:text-gray-400">Atur pengguna dan hak akses</p>
            </div>

            <div className="mb-4 flex gap-4">
                <div className="flex-1">
                    <SearchFilter
                        onSearch={handleSearch}
                        placeholder="Cari pengguna..."
                    />
                </div>
                <div className="w-48">
                    <select
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
                        value={filters.roleId || ''}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, roleId: e.target.value || undefined }));
                            setPage(1);
                        }}
                    >
                        <option value="">Semua Role</option>
                        {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={users}
                loading={loading}
                keyExtractor={(u) => u.id}
                emptyMessage="Tidak ada pengguna ditemukan"
            />

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={limit}
                onPageChange={setPage}
                onLimitChange={(l) => { setLimit(l); setPage(1); }}
            />

            {/* Assign Role Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Ubah Role: {selectedUser?.fullName}
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pilih Role
                            </label>
                            <select
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                            >
                                <option value="" disabled>Pilih Role</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <p className="mt-2 text-xs text-gray-500">
                                {roles.find(r => r.id === selectedRoleId)?.description}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitAssignRole}
                                disabled={submitting || !selectedRoleId}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

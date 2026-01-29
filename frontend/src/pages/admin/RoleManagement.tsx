
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../../constants/permissions';
import { roleService, Role } from '../../services/role.service';
import { DataTable, useToast, DeleteConfirmDialog, TableColumn } from '../../components/common';
import { Permission } from '../../types/auth';

const RoleManagement: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    // Permissions
    const canCreate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.ROLE_CREATE);
    const canUpdate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.ROLE_UPDATE);
    const canDelete = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.ROLE_DELETE);

    // States
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal & Form States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        permissionIds: [] as string[]
    });

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                roleService.getRoles(),
                roleService.getAllPermissions()
            ]);

            if (rolesRes.success) setRoles(rolesRes.data);
            if (permsRes.success) setPermissions(permsRes.data);

        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Gagal memuat data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Group Permissions by Module
    const groupedPermissions = React.useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach(p => {
            const module = p.module || 'Other';
            if (!groups[module]) groups[module] = [];
            groups[module].push(p);
        });
        return groups;
    }, [permissions]);

    // Handlers
    const handleCreate = () => {
        setSelectedRole(null);
        setFormData({ name: '', code: '', description: '', permissionIds: [] });
        setIsFormOpen(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setFormData({
            name: role.name,
            code: role.code,
            description: role.description || '',
            permissionIds: role.permissions.map(p => p.id)
        });
        setIsFormOpen(true);
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (selectedRole) {
                await roleService.updateRole(selectedRole.id, {
                    name: formData.name,
                    description: formData.description,
                    permissionIds: formData.permissionIds
                });
                showToast('Role berhasil diperbarui', 'success');
            } else {
                await roleService.createRole({
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    description: formData.description,
                    permissionIds: formData.permissionIds
                });
                showToast('Role berhasil dibuat', 'success');
            }
            setIsFormOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving role:', error);
            showToast('Gagal menyimpan role', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedRole) return;
        setSubmitting(true);
        try {
            await roleService.deleteRole(selectedRole.id);
            showToast('Role berhasil dihapus', 'success');
            setIsDeleteOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting role:', error);
            showToast('Gagal menghapus role', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePermission = (id: string) => {
        setFormData(prev => {
            const ids = new Set(prev.permissionIds);
            if (ids.has(id)) ids.delete(id);
            else ids.add(id);
            return { ...prev, permissionIds: Array.from(ids) };
        });
    };

    const toggleModule = (module: string, checked: boolean) => {
        const modulePermissions = groupedPermissions[module].map(p => p.id);
        setFormData(prev => {
            const ids = new Set(prev.permissionIds);
            modulePermissions.forEach(id => {
                if (checked) ids.add(id);
                else ids.delete(id);
            });
            return { ...prev, permissionIds: Array.from(ids) };
        });
    };

    const columns: TableColumn<Role>[] = [
        { header: 'Nama Role', accessor: 'name' },
        { header: 'Kode', accessor: 'code' },
        { header: 'Deskripsi', accessor: 'description', render: (r) => r.description || '-' },
        {
            header: 'Aksi',
            accessor: 'id',
            className: 'text-right',
            render: (r) => (
                <div className="flex justify-end gap-2">
                    {canUpdate && !r.isSystem && (
                        <button
                            onClick={() => handleEdit(r)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                        >
                            <span className="material-symbols-rounded">edit</span>
                        </button>
                    )}
                    {canDelete && !r.isSystem && (
                        <button
                            onClick={() => handleDelete(r)}
                            className="text-red-600 hover:text-red-800 p-1"
                        >
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Role</h1>
                    <p className="text-gray-500 dark:text-gray-400">Atur role dan permissions aplikasi</p>
                </div>
                {canCreate && (
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-rounded">add</span>
                        Tambah Role
                    </button>
                )}
            </div>

            <DataTable columns={columns} data={roles} loading={loading} keyExtractor={(r) => r.id} emptyMessage="Tidak ada role" />

            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Role"
                message={`Apakah Anda yakin ingin menghapus role "${selectedRole?.name}"?`}
                loading={submitting}
            />

            {/* Role Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-6 my-8 max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {selectedRole ? 'Edit Role' : 'Tambah Role Baru'}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Role</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Role</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!selectedRole} // Code immutable only on create? Actually usually code is unique identifier logic. But let's allow read-only on edit.
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 disabled:opacity-50"
                                        value={formData.code}
                                        onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                                    <textarea
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
                                        rows={2}
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Permissions</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {Object.entries(groupedPermissions).map(([module, perms]) => {
                                        const allChecked = perms.every(p => formData.permissionIds.includes(p.id));
                                        const someChecked = perms.some(p => formData.permissionIds.includes(p.id));

                                        return (
                                            <div key={module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={allChecked}
                                                        ref={input => { if (input) input.indeterminate = someChecked && !allChecked; }}
                                                        onChange={(e) => toggleModule(module, e.target.checked)}
                                                        className="rounded text-primary focus:ring-primary"
                                                    />
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{module}</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {perms.map(p => (
                                                        <label key={p.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1 rounded">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.permissionIds.includes(p.id)}
                                                                onChange={() => togglePermission(p.id)}
                                                                className="mt-1 rounded text-primary focus:ring-primary"
                                                            />
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</div>
                                                                <div className="text-xs text-gray-500">{p.description}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;

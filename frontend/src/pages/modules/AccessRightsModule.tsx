import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { PERMISSIONS } from '../../constants/permissions';
import UserManagement from '../admin/UserManagement';
import RoleManagement from '../admin/RoleManagement';

export default function AccessRightsModule() {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'users', label: 'Pengguna', path: '/access-rights/users', permission: PERMISSIONS.USER_READ },
        { id: 'roles', label: 'Roles & Permissions', path: '/access-rights/roles', permission: PERMISSIONS.ROLE_READ },
    ];

    const currentTab = tabs.find(t => location.pathname.startsWith(t.path))?.id || 'users';

    return (
        <MainLayout>
            <div className="mb-6">
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <a href="/" className="hover:text-primary transition-colors">Home</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-gray-900 dark:text-white font-medium">Access Rights</span>
                </nav>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-rounded text-white text-3xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Access Rights</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola hak akses, roles, dan permissions</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <PermissionGuard key={tab.id} permission={tab.permission}>
                            <button
                                onClick={() => navigate(tab.path)}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                    ${currentTab === tab.id
                                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        </PermissionGuard>
                    ))}
                </div>
            </div>

            <Routes>
                <Route index element={<Navigate to="users" replace />} />
                <Route
                    path="users"
                    element={
                        <PermissionGuard permission={PERMISSIONS.USER_READ} fallback={<div>Access Denied</div>}>
                            <UserManagement />
                        </PermissionGuard>
                    }
                />
                <Route
                    path="roles"
                    element={
                        <PermissionGuard permission={PERMISSIONS.ROLE_READ} fallback={<div>Access Denied</div>}>
                            <RoleManagement />
                        </PermissionGuard>
                    }
                />
            </Routes>
        </MainLayout>
    );
}


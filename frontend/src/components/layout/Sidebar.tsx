import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS, PermissionString } from '../../constants/permissions';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    isBottom?: boolean;
    isDanger?: boolean;
    permission?: PermissionString;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/'
    },
    {
        id: 'employees',
        label: 'Karyawan',
        icon: 'group',
        path: '/hr/employees',
        permission: PERMISSIONS.EMPLOYEE_READ
    },
    {
        id: 'resignation',
        label: 'Resignations',
        icon: 'person_remove',
        path: '/hr/resignations',
        permission: PERMISSIONS.RESIGNATION_READ
    },
    {
        id: 'master-data',
        label: 'Master Data',
        icon: 'database',
        path: '/hr/master-data/divisi',
        permission: PERMISSIONS.HR_MASTER_READ
    },
    {
        id: 'access-rights',
        label: 'Hak Akses',
        icon: 'admin_panel_settings',
        path: '/access-rights',
        permission: PERMISSIONS.ROLE_READ // Or USER_READ
    },
    {
        id: 'help',
        label: 'Help Desk',
        icon: 'help_center',
        path: '/help',
        isBottom: true
    },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose?.();
    };

    const handleLogout = () => {
        logout();
        onClose?.();
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        // For sub-routes (e.g. /hr/employees/123 matches /hr/employees)
        return location.pathname.startsWith(path);
    };

    const hasPermission = (permission?: PermissionString) => {
        if (!user) return false;
        // Admin bypass
        if (user.roleCode === 'ADMIN') return true;
        // No permission required
        if (!permission) return true;

        return user.permissions?.includes(permission);
    };

    const renderMenuItem = (item: MenuItem) => {
        if (!hasPermission(item.permission)) return null;

        const active = isActive(item.path);
        return (
            <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
            >
                <span
                    className={`material-symbols-outlined text-xl ${active ? 'fill-icon' : ''}`}
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                    {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
            </button>
        );
    };

    const topItems = menuItems.filter(item => !item.isBottom);
    const bottomGroup = menuItems.filter(item => item.isBottom);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Mobile Close Button */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {topItems.map(renderMenuItem)}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    {bottomGroup.map(renderMenuItem)}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

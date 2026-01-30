import { useState, useEffect } from 'react';
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
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/'
    },
    {
        id: 'master-data',
        label: 'Master Data',
        icon: 'database',
        path: '/hr/master-data',
        permission: PERMISSIONS.HR_MASTER_READ,
        children: [
            { id: 'divisi', label: 'Divisi', icon: 'domain', path: '/hr/master-data/divisi' },
            { id: 'department', label: 'Department', icon: 'group_work', path: '/hr/master-data/department' },
            { id: 'posisi', label: 'Posisi Jabatan', icon: 'work', path: '/hr/master-data/posisi-jabatan' },
            { id: 'pangkat', label: 'Kategori Pangkat', icon: 'stars', path: '/hr/master-data/kategori-pangkat' },
            { id: 'golongan', label: 'Golongan', icon: 'grade', path: '/hr/master-data/golongan' },
            { id: 'sub-golongan', label: 'Sub Golongan', icon: 'hotel_class', path: '/hr/master-data/sub-golongan' },
            { id: 'hubungan-kerja', label: 'Jenis Hub. Kerja', icon: 'handshake', path: '/hr/master-data/jenis-hubungan-kerja' },
            { id: 'tag', label: 'Tag', icon: 'label', path: '/hr/master-data/tag' },
            { id: 'lokasi', label: 'Lokasi Kerja', icon: 'location_on', path: '/hr/master-data/lokasi-kerja' },
            { id: 'status-karyawan', label: 'Status Karyawan', icon: 'badge', path: '/hr/master-data/status-karyawan' },
        ]
    },
    {
        id: 'manajemen-karyawan',
        label: 'Manajemen Karyawan',
        icon: 'group',
        path: '/hr/employees',
        permission: PERMISSIONS.EMPLOYEE_READ,
        children: [
            { id: 'employees', label: 'Karyawan', icon: 'person', path: '/hr/employees' },
            { id: 'resignation', label: 'Resignations', icon: 'person_remove', path: '/hr/resignations' }
        ]
    },
    {
        id: 'access-rights',
        label: 'Hak Akses',
        icon: 'admin_panel_settings',
        path: '/access-rights',
        permission: PERMISSIONS.ROLE_READ
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
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    useEffect(() => {
        // Auto-expand menu based on current path
        const matchingMenu = menuItems.find(item =>
            item.children && item.children.some(child => location.pathname.startsWith(child.path))
        );
        if (matchingMenu) {
            setExpandedMenus(prev => prev.includes(matchingMenu.id) ? prev : [...prev, matchingMenu.id]);
        }
    }, [location.pathname]);

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose?.();
    };

    const toggleSubMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
        );
    };

    const handleLogout = () => {
        logout();
        onClose?.();
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/' || location.pathname === '/hr/dashboard';
        return location.pathname.startsWith(path);
    };

    const hasPermission = (permission?: PermissionString) => {
        if (!user) return false;
        if (user.roleCode === 'ADMIN') return true;
        if (!permission) return true;
        return user.permissions?.includes(permission);
    };

    const renderMenuItem = (item: MenuItem) => {
        if (!hasPermission(item.permission)) return null;

        const active = isActive(item.path);
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.id);
        const isChildActive = hasChildren && item.children?.some(child => isActive(child.path));

        if (hasChildren) {
            return (
                <div key={item.id} className="space-y-1">
                    <button
                        onClick={() => toggleSubMenu(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${isChildActive || active ? 'text-primary bg-primary/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-xl ${(isChildActive || active) ? 'fill-icon' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>

                    {/* Submenu */}
                    {isExpanded && (
                        <div className="pl-4 space-y-1 mt-1 border-l-2 border-gray-100 dark:border-gray-800 ml-4">
                            {item.children?.map(child => (
                                <button
                                    key={child.id}
                                    onClick={() => handleNavigation(child.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${isActive(child.path)
                                            ? 'text-primary font-medium bg-primary/10'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {child.icon}
                                    </span>
                                    <span>{child.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

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

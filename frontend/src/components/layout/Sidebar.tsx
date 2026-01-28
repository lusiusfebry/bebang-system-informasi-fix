import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
}

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
    { id: 'recent', label: 'Recent Activities', icon: 'history', path: '/activities' },
    { id: 'profile', label: 'My Profile', icon: 'person', path: '/profile' },
    { id: 'messages', label: 'Messages', icon: 'chat_bubble', path: '/messages' },
];

const bottomItems: MenuItem[] = [
    { id: 'help', label: 'Help Desk', icon: 'help_center', path: '/help', isBottom: true },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        return location.pathname.startsWith(path);
    };

    const renderMenuItem = (item: MenuItem) => {
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
                    {menuItems.map(renderMenuItem)}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    {bottomItems.map(renderMenuItem)}
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
